class FrenchWords < ActiveRecord::Migration[7.0]
  def change
    create_table "french_nouns", id: :serial, force: :cascade do |t|
      t.string "english", null: false
      t.string "english_plural", null: false
      t.string "french", null: false
      t.string "french_plural", null: false
      t.integer "gender", null: false
      t.integer "streak", default: 0
      t.date "last_streak_add"
      t.string "note", default: ""

      t.timestamps
    end

    create_table "french_verbs", force: :cascade do |t|
      t.string "english", null: false
      t.string "french", null: false
      t.integer "streak", default: 0
      t.date "last_streak_add"
      t.string "note", default: ""
      t.jsonb "forms", default: {}

      t.timestamps
    end

    create_table "french_adjectives", force: :cascade do |t|
      t.string "english", null: false
      t.string "masculine", null: false
      t.string "feminine", null: false
      t.string "masculine_plural", null: false
      t.string "feminine_plural", null: false
      t.integer "streak", default: 0
      t.date "last_streak_add"

      t.timestamps
    end

    create_table "french_miscs", force: :cascade do |t|
      t.string "french", null: false
      t.string "english", null: false
      t.integer "streak", default: 0
      t.date "last_streak_add"

      t.timestamps
    end

  end
end
