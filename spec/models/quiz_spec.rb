require 'rails_helper'

RSpec.describe Quiz, type: :model do
  describe '#run' do
    let(:quiz) { Quiz.create!(name: 'Test Quiz', max_questions: 0) }
    let(:tag) { Tag.create!(name: 'Test') }

    def make_card(question: 'Q', answer: 'A')
      Card.create!(question: question, answer: answer, config: {})
    end

    def make_quiz_question(type:, amount:, position: 0)
      qq = QuizQuestion.create!(
        quiz: quiz,
        question_id: 9,  # 'Card'
        amount: amount,
        position: position,
        chained: false,
        quiz_question_type: type,
      )
      QuizQuestionTag.create!(quiz_question: qq, tag: tag)
      qq
    end

    context 'manual_amount' do
      it 'returns exactly amount card questions' do
        3.times { |i| CardTag.create!(tag: tag, cardtagable: make_card(question: "Q#{i}")) }
        make_quiz_question(type: :manual_amount, amount: 2)

        result = quiz.run

        expect(result.length).to eq(2)
        expect(result).to all(include(entityName: 'card'))
      end

      it 'prioritizes highlighted cards over non-highlighted cards' do
        highlighted1 = make_card(question: 'H1')
        highlighted2 = make_card(question: 'H2')
        non_highlighted1 = make_card(question: 'N1')
        non_highlighted2 = make_card(question: 'N2')
        non_highlighted3 = make_card(question: 'N3')
        [highlighted1, highlighted2, non_highlighted1, non_highlighted2, non_highlighted3].each do |card|
          CardTag.create!(tag: tag, cardtagable: card)
        end
        Highlight.create!(highlightable: highlighted1)
        Highlight.create!(highlightable: highlighted2)
        make_quiz_question(type: :manual_amount, amount: 2)

        result = quiz.run

        expect(result.map { |q| q[:cardId] }).to contain_exactly(highlighted1.id, highlighted2.id)
      end
    end


    context 'all_highlighted' do
      it 'returns only cards that have a Highlight record' do
        plain_card1  = make_card(question: 'Plain 1')
        plain_card2  = make_card(question: 'Plain 2')
        highlighted  = make_card(question: 'Highlighted')
        CardTag.create!(tag: tag, cardtagable: plain_card1)
        CardTag.create!(tag: tag, cardtagable: plain_card2)
        CardTag.create!(tag: tag, cardtagable: highlighted)
        Highlight.create!(highlightable: highlighted)
        make_quiz_question(type: :all_highlighted, amount: 1)

        result = quiz.run

        expect(result.map { |q| q[:cardId] }).to contain_exactly(highlighted.id)
      end
    end

    context 'everything' do
      it 'returns all tagged cards regardless of highlight status' do
        highlighted_card     = make_card(question: 'Highlighted')
        non_highlighted_card = make_card(question: 'Non-highlighted')
        CardTag.create!(tag: tag, cardtagable: highlighted_card)
        CardTag.create!(tag: tag, cardtagable: non_highlighted_card)
        Highlight.create!(highlightable: highlighted_card)
        make_quiz_question(type: :everything, amount: 2)

        result = quiz.run

        expect(result.map { |q| q[:cardId] }).to contain_exactly(highlighted_card.id, non_highlighted_card.id)
      end
    end

    context 'max_questions' do
      it 'caps the result at max_questions' do
        quiz.update!(max_questions: 3)
        5.times { |i| CardTag.create!(tag: tag, cardtagable: make_card(question: "Q#{i}")) }
        make_quiz_question(type: :manual_amount, amount: 5)

        result = quiz.run

        expect(result.length).to eq(3)
      end
    end
  end
end
