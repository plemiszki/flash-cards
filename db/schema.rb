# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_08_01_224747) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "adjectives", id: :serial, force: :cascade do |t|
    t.string "english", null: false
    t.string "masculine", null: false
    t.string "feminine", null: false
    t.string "transliterated_masculine"
    t.string "transliterated_feminine"
    t.string "masculine_plural"
    t.string "transliterated_masculine_plural"
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "transliterated"
    t.string "transliterated_plural"
    t.boolean "uncountable", default: false
  end

  create_table "questions", id: :serial, force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "quiz_questions", id: :serial, force: :cascade do |t|
    t.integer "quiz_id", null: false
    t.integer "question_id", null: false
    t.integer "amount", null: false
    t.integer "tag_id"
    t.index ["question_id"], name: "index_quiz_questions_on_question_id"
    t.index ["quiz_id"], name: "index_quiz_questions_on_quiz_id"
    t.index ["tag_id"], name: "index_quiz_questions_on_tag_id"
  end

  create_table "quizzes", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.boolean "use_archived", default: false
  end

  create_table "spanish_adjectives", force: :cascade do |t|
    t.string "english", null: false
    t.string "masculine", null: false
    t.string "feminine", null: false
    t.string "masculine_plural", null: false
    t.string "feminine_plural", null: false
  end

  create_table "spanish_nouns", force: :cascade do |t|
    t.string "english", null: false
    t.string "english_plural", null: false
    t.string "spanish", null: false
    t.string "spanish_plural", null: false
    t.integer "gender", null: false
  end

  create_table "spanish_verbs", force: :cascade do |t|
    t.string "english", null: false
    t.string "spanish", null: false
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  end

end
