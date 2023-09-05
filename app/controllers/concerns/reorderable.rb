module Reorderable
  extend ActiveSupport::Concern

  def reorder(relation) # reorder a model after one has been deleted
    relation.each_with_index do |object, index|
      object.update!(position: index)
    end
    relation
  end

end
