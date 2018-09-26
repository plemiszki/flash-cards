Rails.application.routes.draw do
  root to: "nouns#index"
  resources :nouns, only: [:index, :show]
  resources :verbs, only: [:index, :show]
  resources :adjectives, only: [:index, :show]

  namespace :api do
    resources :nouns, only: [:index, :show, :create, :update, :destroy]
    resources :verbs, only: [:index, :show, :create, :update, :destroy]
    resources :adjectives, only: [:index, :show, :create, :update, :destroy]
  end
end
