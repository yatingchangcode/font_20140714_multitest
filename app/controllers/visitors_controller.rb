class VisitorsController < ApplicationController
  before_action :find_game
  def new
    @visitor = @game.visitors.new
  end

  private
  def find_game
    @game = Game.find(params[:game_id])
  end
end
