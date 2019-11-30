class Api::JobsController < AdminController

  def create
    name = job_params[:name]
    case name
    when 'fetch vocabulary'
      words = params[:words]
      job = Job.create({ name: name, text: 'Fetching Word Definitions', show_progress: true, total_value: words.length })
      FetchWordDefinitions.perform_async({ job_id: job.id, words: words })
    when 'create vocabulary cards'
      words = params[:words]
      job = Job.create({ name: name, text: 'Creating Vocabulary Cards', show_progress: true, total_value: words.keys.length })
      CreateVocabularyCards.perform_async({ job_id: job.id, words: words })
    end
    render json: { job: job.serializable_hash.deep_transform_keys! { |k| k.camelize(:lower) } }, status: 200
  end

  def show
    job = Job.find(params[:id])
    render json: { job: job.serializable_hash.deep_transform_keys! { |k| k.camelize(:lower) } }, status: 200
  end

  private

  def job_params
    params[:job].permit(:name)
  end

end
