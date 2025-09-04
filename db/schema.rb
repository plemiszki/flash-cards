# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_09_04_162703) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pg_stat_statements"

  create_table "adjectives", id: :serial, force: :cascade do |t|
    t.string "english", null: false
    t.string "masculine", null: false
    t.string "feminine", null: false
    t.string "transliterated_masculine"
    t.string "transliterated_feminine"
    t.string "masculine_plural"
    t.string "transliterated_masculine_plural"
    t.integer "streak", default: 0
    t.date "last_streak_add"
  end

  create_table "adverbs", id: :serial, force: :cascade do |t|
    t.string "foreign", null: false
    t.string "transliterated", null: false
    t.string "english", null: false
    t.index ["foreign", "english"], name: "index_adverbs_on_foreign_and_english", unique: true
  end

  create_table "card_tags", id: :serial, force: :cascade do |t|
    t.integer "tag_id", null: false
    t.integer "cardtagable_id", null: false
    t.string "cardtagable_type", default: "card"
  end

  create_table "cards", id: :serial, force: :cascade do |t|
    t.string "question", null: false
    t.string "answer", null: false
    t.string "image_url", default: ""
    t.boolean "multiple_choice", default: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.string "answer_placeholder", default: ""
    t.string "hint", default: ""
    t.jsonb "config", default: {}
    t.datetime "streak_freeze_expiration", precision: nil
    t.string "notes", default: ""
    t.string "cloudinary_url", default: ""
  end

  create_table "french_adjectives", force: :cascade do |t|
    t.string "english", null: false
    t.string "masculine", null: false
    t.string "feminine", null: false
    t.string "masculine_plural", null: false
    t.string "feminine_plural", null: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "streak_freeze_expiration", precision: nil
    t.string "url", default: ""
    t.string "note", default: ""
  end

  create_table "french_cities", force: :cascade do |t|
    t.string "english", null: false
    t.string "french", null: false
    t.integer "streak", default: 0
    t.datetime "streak_freeze_expiration", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "url", default: ""
  end

  create_table "french_countries", force: :cascade do |t|
    t.string "english", null: false
    t.string "french", null: false
    t.integer "gender", null: false
    t.integer "streak", default: 0
    t.datetime "streak_freeze_expiration", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "url", default: ""
  end

  create_table "french_miscs", force: :cascade do |t|
    t.string "french", null: false
    t.string "english", null: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "streak_freeze_expiration", precision: nil
    t.string "url", default: ""
    t.string "note", default: ""
  end

  create_table "french_nouns", id: :serial, force: :cascade do |t|
    t.string "english", null: false
    t.string "english_plural", null: false
    t.string "french", null: false
    t.string "french_plural", null: false
    t.integer "gender", null: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.string "note", default: ""
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "streak_freeze_expiration", precision: nil
    t.string "url", default: ""
    t.boolean "uncountable", default: false
  end

  create_table "french_verbs", force: :cascade do |t|
    t.string "english", null: false
    t.string "french", null: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.string "note", default: ""
    t.jsonb "forms", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "streak_freeze_expiration", precision: nil
    t.string "url", default: ""
    t.boolean "use_etre", default: false
    t.boolean "reflexive", default: false, null: false
  end

  create_table "jobs", force: :cascade do |t|
    t.string "name", null: false
    t.string "text", default: ""
    t.boolean "show_progress", default: true
    t.integer "current_value", default: 0
    t.integer "total_value", default: 0
    t.jsonb "metadata", default: {}
    t.boolean "done", default: false
    t.boolean "killed", default: false
  end

  create_table "match_bins", force: :cascade do |t|
    t.string "name", null: false
    t.integer "card_id", null: false
  end

  create_table "match_items", force: :cascade do |t|
    t.string "name", null: false
    t.integer "match_bin_id", null: false
  end

  create_table "nouns", id: :serial, force: :cascade do |t|
    t.string "english", null: false
    t.string "english_plural", null: false
    t.string "foreign", null: false
    t.string "foreign_plural", null: false
    t.integer "gender", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "transliterated"
    t.string "transliterated_plural"
    t.boolean "uncountable", default: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
  end

  create_table "questions", id: :serial, force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "quiz_question_tags", force: :cascade do |t|
    t.integer "tag_id", null: false
    t.integer "quiz_question_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id", "quiz_question_id"], name: "index_quiz_question_tags_on_tag_id_and_quiz_question_id", unique: true
  end

  create_table "quiz_questions", id: :serial, force: :cascade do |t|
    t.integer "quiz_id", null: false
    t.integer "question_id", null: false
    t.integer "amount", null: false
    t.integer "tag_id"
    t.boolean "use_all_available", default: false
    t.boolean "chained", default: false
    t.integer "position"
    t.index ["question_id"], name: "index_quiz_questions_on_question_id"
    t.index ["quiz_id"], name: "index_quiz_questions_on_quiz_id"
    t.index ["tag_id"], name: "index_quiz_questions_on_tag_id"
  end

  create_table "quizzes", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.boolean "use_archived", default: false
    t.integer "max_questions", default: 0
  end

  create_table "spanish_adjectives", force: :cascade do |t|
    t.string "english", null: false
    t.string "masculine", null: false
    t.string "feminine", null: false
    t.string "masculine_plural", null: false
    t.string "feminine_plural", null: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.datetime "streak_freeze_expiration", precision: nil
  end

  create_table "spanish_miscs", force: :cascade do |t|
    t.string "spanish", null: false
    t.string "english", null: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.datetime "streak_freeze_expiration", precision: nil
  end

  create_table "spanish_nouns", force: :cascade do |t|
    t.string "english", null: false
    t.string "english_plural", null: false
    t.string "spanish", null: false
    t.string "spanish_plural", null: false
    t.integer "gender", null: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.string "note", default: ""
    t.datetime "streak_freeze_expiration", precision: nil
  end

  create_table "spanish_verbs", force: :cascade do |t|
    t.string "english", null: false
    t.string "spanish", null: false
    t.integer "streak", default: 0
    t.date "last_streak_add"
    t.string "note", default: ""
    t.jsonb "forms", default: {}
    t.datetime "streak_freeze_expiration", precision: nil
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "encrypted_password", limit: 128
    t.string "confirmation_token", limit: 128
    t.string "remember_token", limit: 128
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["remember_token"], name: "index_users_on_remember_token"
  end

  create_table "verbs", id: :serial, force: :cascade do |t|
    t.string "english", null: false
    t.string "infinitive", null: false
    t.string "transliterated_infinitive"
    t.string "irregular_imperative_informal", default: ""
    t.string "irregular_imperative_formal", default: ""
    t.string "irregular_imperative_informal_transliterated", default: ""
    t.string "irregular_imperative_formal_transliterated", default: ""
    t.string "postposition", default: ""
    t.string "english_irregular_imperfective", default: ""
    t.string "english_preposition", default: ""
    t.integer "streak", default: 0
    t.date "last_streak_add"
  end
end
