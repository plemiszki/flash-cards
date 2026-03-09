orphaned = QuizQuestion.where.not(tag_id: nil).where.not(tag_id: Tag.select(:id))
count = orphaned.count
orphaned.update_all(tag_id: nil)
puts "Nullified tag_id on #{count} quiz_question(s)"
