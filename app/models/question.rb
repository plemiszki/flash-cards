class Question

  attr_reader :id, :name, :entity

  def initialize(id, name, entity)
    @id = id
    @name = name
    @entity = entity
  end

  RECORDS = YAML.load_file(Rails.root.join("config", "questions.yml"))
    .map { |attrs| new(attrs["id"], attrs["name"], attrs["entity"]) }
    .freeze

  def self.all
    RECORDS
  end

  def self.find(id)
    RECORDS.find { |q| q.id == id.to_i } || raise(ActiveRecord::RecordNotFound, "Couldn't find Question with 'id'=#{id}")
  end

  def self.find_by!(name:)
    RECORDS.find { |q| q.name == name } || raise(ActiveRecord::RecordNotFound, "Couldn't find Question with name=#{name}")
  end

end
