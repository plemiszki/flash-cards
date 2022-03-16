class CreateVocabularyCards
  include Sidekiq::Worker
  sidekiq_options :retry => false

  def perform(args)
    job = Job.find(args['job_id'])
    words = eval(args['words'])
    words.keys.each do |word|
      unless Card.find_by_question("Define \"#{word}\"").present?
        card = Card.create!({ question: "Define \"#{word}\"", answer: words[word], multiple_choice: true })
        CardTag.create!({ tag_id: Tag.find_by_name('Vocabulary').id, cardtagable_id: card.id, cardtagable_type: 'Card' })
      end
      job.update(current_value: job.current_value + 1)
    end
    job.update(done: true)
  end

end
