Rails.application.routes.draw do
  root to: "nouns#index"
  resources :nouns, only: [:index, :show]

  namespace :api do
    resources :nouns, only: [:index, :show, :create, :update, :destroy]
  end
end
