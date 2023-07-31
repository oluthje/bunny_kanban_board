class Api::V1::CardsController < ApplicationController
  def index
    @list = List.find(params[:list_id])
    @cards = @list.cards
    render json: @cards
  end

  # switch the order ids of two cards
  def switch
    @card1 = Card.find(params[:card1_id])
    @card2 = Card.find(params[:card2_id])
    @card1.orderId, @card2.orderId = @card2.orderId, @card1.orderId
    @card1.save
    @card2.save
  end

  def create
    @list = List.find(params[:list_id])
    @user = User.find(params[:user_id])

    # ensure user has not reached the card limit
    if @list.cards.length >= @user.cards_allowed
      render json: {error: 'You have reached your card limit. Please upgrade your Bunny plan.'}
      return
    end

    @card = @list.cards.create(card_params)
    @card.orderId = @list.cards.length - 1
    if @card.save
      render json: @card
    else
      render json: {error: 'Error creating card'}
    end
  end

  def destroy
    @card = Card.find(params[:id])
    @card.destroy
  end

  private
  def card_params
    params.require(:card).permit(:title, :card1_id, :card2_id, :user_id)
  end
end
