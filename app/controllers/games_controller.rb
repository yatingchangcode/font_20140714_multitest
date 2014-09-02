class GamesController < ApplicationController
  def index
    @games = Game.all
    @game = Game.new
  end

  def show
    @game = Game.find(params[:id])
    @visitors = @game.visitors
  end

  def create
    @game = Game.new

    @game.save

    redirect_to game_path(@game)
  end

  def stage1
    @game = Game.find(params[:id])

    @show_second = false
    @join_visitors_number = params[:join_visitors_number]
  end

  def stage2
    @game = Game.find(params[:id])

    @show_second = true
    @join_visitors_number = params[:join_visitors_number]
  end

  def server
    @game = Game.find(params[:id])
    session[:game] = params[:id]
    @visitors = @game.visitors.where(id: params[:join_visitors_number].split(","))

    @range = 1..@visitors.size

    #@user_unregs = [2,3]
  end

  def get_visitor_photo
    if session[:game].present?
      @game = Game.find(session[:game])
      @visitor = @game.visitors.find(params[:id])

      respond_to do |format|
        format.json { render :json => @visitor }
      end
    else
      respond_to do |format|
        format.json { render :json => "false" }
      end
    end

  end
end
