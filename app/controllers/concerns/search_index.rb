module SearchIndex

  MAX_PAGE_LINKS = 10

  extend ActiveSupport::Concern

  def perform_search(model:, associations: [], custom_queries: {})

    widget = model.constantize

    if params[:batch_size]
      batch_size = params[:batch_size].to_i
      page = params[:page].to_i
      offset = batch_size * (page - 1)
    end

    order_column = params[:order_by]
    order_direction = params[:order_direction]
    order_string = order_column
    order_string += ' DESC' if order_direction == 'desc'

    if params[:search_criteria]
      where_obj, not_obj = {}, {}
      fuzzy_where_obj = {}
      params[:search_criteria].each do |key, value|
        next if key.in?(custom_queries.keys.map(&:to_s))
        key = value['db_name'] if value['db_name']
        if value['min_value']
          where_obj[key] = Range.new(value['min_value'].to_i, value['max_value'].to_i)
        elsif value['start_date']
          convert_date = -> (string) { Date.strptime(string, "%m/%d/%y") }
          where_obj[key] = Range.new(convert_date.(value['start_date']), convert_date.(value['end_date']))
        elsif value['value'].is_a?(ActionController::Parameters)
          where_obj[key] = value['value'].values
        elsif value.has_key?('not')
          not_obj[key] = value['not']
        else
          if value['fuzzy']
            fuzzy_where_obj[key] = value['value']
          else
            where_obj[key] = value['value']
          end
        end
      end
      widgets_meeting_search_criteria = widget.where(where_obj).where.not(not_obj)
      fuzzy_where_obj.each do |key, value|
        widgets_meeting_search_criteria = widgets_meeting_search_criteria.where("#{key} ilike ?", "%#{value}%")
      end
      custom_queries.each do |field_name, values_hash|
        if params[:search_criteria][field_name]
          value = params[:search_criteria][field_name]["value"].to_sym
          info = values_hash[value]
          widgets_meeting_search_criteria = widgets_meeting_search_criteria
            .joins(info[:joins])
            .where(info[:where])
            .group(info[:group])
            .having(info[:having])
        end
      end
    else
      widgets_meeting_search_criteria = widget.all
    end

    widgets = widgets_meeting_search_criteria.order(order_string).includes(associations).limit(batch_size).offset(offset)

    if params[:batch_size]
      total_count = widgets_meeting_search_criteria.to_a.count # <-- casting to array avoids fuzzy_search error
      pages_count = total_count / batch_size
      pages_count += 1 if total_count % batch_size > 0

      @page_numbers = [page]
      index = 1
      while @page_numbers.length < [pages_count, MAX_PAGE_LINKS].min do
        @page_numbers << (page + index)
        @page_numbers << (page - index)
        @page_numbers.select! { |page| page > 0 && page <= pages_count }
        index += 1
      end
      @page_numbers.sort!
      @more_pages = pages_count > @page_numbers[-1]
    end

    widgets
  end

end
