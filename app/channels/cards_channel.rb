class CardsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'cards'
  end
end
