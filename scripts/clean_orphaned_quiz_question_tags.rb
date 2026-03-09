orphaned = QuizQuestionTag.where.missing(:tag)
count = orphaned.count
orphaned.destroy_all
puts "Deleted #{count} orphaned quiz_question_tag(s)"
