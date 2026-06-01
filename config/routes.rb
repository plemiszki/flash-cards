Rails.application.routes.draw do
  root to: 'quizzes#index'
  get '/cards/bulk_add' => 'cards#bulk_add'
  resources :cards, only: [:index, :show]
  resources :highlights, only: [:index]
  resources :nouns, only: [:index, :show]
  resources :verbs, only: [:index, :show]
  resources :adjectives, only: [:index, :show]
  resources :adverbs, only: [:index, :show]
  resources :tags, only: [:index, :show]
  resources :quizzes, only: [:index, :show]
  get '/quizzes/:id/run' => 'quizzes#run'
  resources :spanish_nouns, only: [:index, :show]
  resources :spanish_verbs, only: [:index, :show]
  resources :spanish_adjectives, only: [:index, :show]
  resources :spanish_miscs, only: [:index, :show]
  resources :french_nouns, only: [:index, :show]
  resources :french_verbs, only: [:index, :show]
  resources :french_adjectives, only: [:index, :show]
  resources :french_countries, only: [:index, :show]
  resources :french_cities, only: [:index, :show]
  resources :french_miscs, only: [:index, :show]
  resources :vocabulary, only: [:index]

  namespace :api do
    resources :cards, only: [:index, :new, :show, :create, :update, :destroy]
    resources :nouns, only: [:index, :show, :create, :update, :destroy]
    resources :verbs, only: [:index, :show, :create, :update, :destroy]
    resources :adjectives, only: [:index, :show, :create, :update, :destroy]
    resources :adverbs, only: [:index, :show, :create, :update, :destroy]
    resources :tags, only: [:index, :show, :create, :update, :destroy]
    resources :card_tags, only: [:create, :destroy]
    resources :quizzes, only: [:index, :show, :create, :update, :destroy]
    resources :quiz_questions, only: [:create, :update, :destroy]
    resources :quiz_question_tags, only: [:create, :destroy]
    get '/quizzes/:id/run' => 'quizzes#run'
    resources :spanish_nouns, only: [:index, :show, :create, :update, :destroy]
    resources :spanish_verbs, only: [:index, :show, :create, :update, :destroy]
    resources :spanish_adjectives, only: [:index, :show, :create, :update, :destroy]
    resources :spanish_miscs, only: [:index, :show, :create, :update, :destroy]
    resources :french_nouns, only: [:index, :show, :create, :update, :destroy]
    get '/french_verbs/:id/fetch' => 'french_verbs#fetch'
    resources :french_verbs, only: [:index, :show, :create, :update, :destroy]
    resources :french_adjectives, only: [:index, :show, :create, :update, :destroy]
    resources :french_countries, only: [:index, :show, :create, :update, :destroy]
    resources :french_cities, only: [:index, :show, :create, :update, :destroy]
    resources :french_miscs, only: [:index, :show, :create, :update, :destroy]
    resources :match_bins, only: [:create, :destroy]
    resources :match_items, only: [:create, :destroy]
    resources :jobs, only: [:create, :show]
    resources :highlights, only: [:index, :create, :destroy]
    resources :card_generations, only: [:create]
  end
end
