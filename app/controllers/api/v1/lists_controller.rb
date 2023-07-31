class Api::V1::ListsController < ApplicationController
  def index
    @user = User.find(params[:user_id])
    @lists = @user.lists
    render json: @lists
  end

  # switch the order ids of two lists
  def switch
    @list1 = List.find(params[:list1_id])
    @list2 = List.find(params[:list2_id])
    @list1.orderId, @list2.orderId = @list2.orderId, @list1.orderId
    @list1.save
    @list2.save
  end

  def create
    @user = User.find(params[:user_id])

    # ensure user has not reached list limit
    if @user.lists.length >= @user.lists_allowed
      render json: {error: 'You have reached your list limit. Please upgrade your Bunny plan.'}
      return
    end

    @list = @user.lists.create(list_params)
    @list.orderId = List.all.length + 1

    if @list.save
      render json: @list
      print json: @list
    else
      render json: {error: 'Error creating list'}
    end
  end

  def destroy
    @list = List.find(params[:id])
    @list.destroy
  end

  private
  def list_params
    params.require(:list).permit(:title, :list1_id, :list2_id)
  end
end