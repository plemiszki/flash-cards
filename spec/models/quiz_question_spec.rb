require 'rails_helper'

RSpec.describe QuizQuestion, type: :model do
  describe '#get_amount' do
    # Uses question id: 1 ("Hindi - Single Noun"), entity: "Noun"
    let(:quiz)                { Quiz.create!(name: 'Test Quiz', max_questions: 10) }
    let(:quiz_tag)            { Tag.create!(name: 'Beginner') }
    let(:needs_attention_tag) { Tag.create!(name: 'Needs Attention') }
    let(:archived_tag)        { Tag.create!(name: 'Archived') }

    let(:quiz_question) do
      QuizQuestion.create!(
        quiz: quiz,
        question_id: 1,
        amount: 5,
        position: 0,
        chained: false,
        use_all_available: false,
        quiz_question_type: :manual_amount,
      )
    end

    let(:noun1) { Noun.create!(english: 'dog', english_plural: 'dogs', foreign: 'kutta', foreign_plural: 'kutte', gender: 1) }
    let(:noun2) { Noun.create!(english: 'cat', english_plural: 'cats', foreign: 'billi', foreign_plural: 'billian', gender: 2) }

    before do
      QuizQuestionTag.create!(quiz_question: quiz_question, tag: quiz_tag)
      # Both nouns belong to the quiz tag
      CardTag.create!(tag: quiz_tag, cardtagable: noun1)
      CardTag.create!(tag: quiz_tag, cardtagable: noun2)
      # Only noun1 needs attention; only noun2 is archived
      CardTag.create!(tag: needs_attention_tag, cardtagable: noun1)
      CardTag.create!(tag: archived_tag, cardtagable: noun2)
    end

    context 'when type is manual_amount' do
      it 'returns the amount column value' do
        expect(quiz_question.get_amount).to eq(5)
      end
    end

    context 'when type is everything' do
      before { quiz_question.update!(quiz_question_type: :everything) }

      it 'returns the count of all entities associated with any quiz question tag' do
        expect(quiz_question.get_amount).to eq(2)
      end
    end

    context 'when type is all_highlighted' do
      before { quiz_question.update!(quiz_question_type: :all_highlighted) }

      it 'returns the count of entities that also have the Needs Attention tag' do
        expect(quiz_question.get_amount).to eq(1)
      end
    end

    context 'when type is all_non_archived' do
      before { quiz_question.update!(quiz_question_type: :all_non_archived) }

      it 'returns the count of entities that do not have the Archived tag' do
        expect(quiz_question.get_amount).to eq(1)
      end
    end
  end
end
