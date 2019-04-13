Rails.application.routes.draw do
  root to: 'quizzes#index'
  resources :cards, only: [:index, :show]
  resources :nouns, only: [:index, :show]
  resources :verbs, only: [:index, :show]
  resources :adjectives, only: [:index, :show]
  resources :adverbs, only: [:index, :show]
  resources :tags, only: [:index, :show]
  resources :quizzes, only: [:index, :show]
  resources :questions, only: [:index, :show]
  get '/quizzes/:id/run' => 'quizzes#run'
  resources :spanish_nouns, only: [:index, :show]

  namespace :api do
    resources :cards, only: [:index, :show, :create, :update, :destroy]
    get '/cards_archived' => 'cards#index_archived'
    resources :nouns, only: [:index, :show, :create, :update, :destroy]
    resources :verbs, only: [:index, :show, :create, :update, :destroy]
    resources :adjectives, only: [:index, :show, :create, :update, :destroy]
    resources :adverbs, only: [:index, :show, :create, :update, :destroy]
    resources :tags, only: [:index, :show, :create, :update, :destroy]
    resources :card_tags, only: [:create, :destroy]
    resources :quizzes, only: [:index, :show, :create, :update, :destroy]
    resources :questions, only: [:index, :show, :create, :update, :destroy]
    resources :quiz_questions, only: [:create, :destroy]
    get '/quizzes/:id/run' => 'quizzes#run'
    resources :spanish_nouns, only: [:index, :show, :create, :update, :destroy]
  end
end
