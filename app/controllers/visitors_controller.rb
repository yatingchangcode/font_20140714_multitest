class VisitorsController < ApplicationController
  before_action :find_game
  def new
    @visitor = @game.visitors.new
  end

  def create
    @visitor = @game.visitors.build(visitor_params)
    @visitor.number = @game.visitors.size +1

    if @visitor.save
      redirect_to game_path(@game)
    else
      render :new
    end
  end

  private
  def visitor_params
    params.require(:visitor).permit(:name,:image)
  end

  def find_game
    @game = Game.find(params[:game_id])
  end
end
