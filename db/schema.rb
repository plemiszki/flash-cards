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

ActiveRecord::Schema.define(version: 20181020033422) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "adjectives", force: :cascade do |t|
    t.string "english",                         null: false
    t.string "masculine",                       null: false
    t.string "feminine",                        null: false
    t.string "transliterated_masculine"
    t.string "transliterated_feminine"
    t.string "masculine_plural"
    t.string "transliterated_masculine_plural"
  end

  create_table "card_tags", force: :cascade do |t|
    t.integer "tag_id",                     null: false
    t.integer "card_id",                    null: false
    t.string  "card_type", default: "card"
  end

  create_table "cards", force: :cascade do |t|
    t.string "question", null: false
    t.string "answer",   null: false
  end

  create_table "nouns", force: :cascade do |t|
    t.string   "english",               null: false
    t.string   "english_plural",        null: false
    t.string   "foreign",               null: false
    t.string   "foreign_plural",        null: false
    t.integer  "gender",                null: false
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.string   "transliterated"
    t.string   "transliterated_plural"
  end

  create_table "questions", force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "quiz_questions", force: :cascade do |t|
    t.integer "quiz_id",     null: false
    t.integer "question_id", null: false
    t.integer "amount",      null: false
    t.integer "tag_id"
    t.index ["question_id"], name: "index_quiz_questions_on_question_id", using: :btree
    t.index ["quiz_id"], name: "index_quiz_questions_on_quiz_id", using: :btree
    t.index ["tag_id"], name: "index_quiz_questions_on_tag_id", using: :btree
  end

  create_table "quizzes", force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                          null: false
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "encrypted_password", limit: 128
    t.string   "confirmation_token", limit: 128
    t.string   "remember_token",     limit: 128
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["remember_token"], name: "index_users_on_remember_token", using: :btree
  end

  create_table "verbs", force: :cascade do |t|
    t.string "english",                   null: false
    t.string "infinitive",                null: false
    t.string "transliterated_infinitive"
  end

end
