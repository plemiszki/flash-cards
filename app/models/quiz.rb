class Quiz < ActiveRecord::Base

  validates :name, presence: true

  has_many :quiz_questions
  has_many :questions, through: :quiz_questions

  def run
    result = []
    @nouns = Noun.all.to_a.shuffle
    @verbs = Verb.all.to_a.shuffle
    @adjectives = Adjective.all.to_a.shuffle
    @cards = Card.all.to_a.shuffle
    quiz_questions.each do |quiz_question|
      question = quiz_question.question
      quiz_question.amount.times do
        check_if_anything_empty
        case question.name
        when 'Single Noun'
          noun = @nouns.pop
          plural = (rand(2) == 1)
          result << {
            question: (plural ? noun.english_plural.capitalize : noun.english.capitalize),
            answer_transliterated: (plural ? noun.transliterated_plural : noun.transliterated),
            answer_hindi: (plural ? noun.foreign_plural : noun.foreign)
          }
        when 'Single Verb'
          verb = @verbs.pop
          result << {
            question: verb.english.capitalize,
            answer_transliterated: verb.transliterated_infinitive,
            answer_hindi: verb.infinitive
          }
        when 'Single Adjective'
          adjective = @adjectives.pop
          result << {
            question: adjective.english.capitalize,
            answer_transliterated: adjective.transliterated_masculine,
            answer_hindi: adjective.masculine
          }
        when 'Subject is a Noun'
          noun = @nouns.pop
        when 'Subject is an Adjective'
          adjective = @adjectives.pop
        when 'Subject is an Adjective Noun'
          noun = @nouns.pop
          adjective = @adjectives.pop
        when 'Noun is an Adjective'
          noun = @nouns.pop
          adjective = @adjectives.pop
        when 'Card'
          # tagged_cards = @cards.select { |card| card.tags.map(&:id).include?(quiz_question.tag_id) }
          card = @cards.pop
          result << {
            question: card.question,
            answer: card.answer
          }
        end
      end
    end
    result
  end

  private

  def check_if_anything_empty
    @nouns = Noun.all.to_a.shuffle if @nouns.empty?
    @verbs = Verb.all.to_a.shuffle if @verbs.empty?
    @adjectives = Adjective.all.to_a.shuffle if @adjectives.empty?
    @cards = Card.all.to_a.shuffle if @cards.empty?
  end

end
