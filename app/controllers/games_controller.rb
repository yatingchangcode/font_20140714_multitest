class GamesController < ApplicationController

  @@game = 0
  @@second = 0
  @@stage = ""

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

    @join_visitors_number = params[:join_visitors_number]
  end

  def stage2
    @game = Game.find(params[:id])

    @join_visitors_number = params[:join_visitors_number]
  end

  def stage_idioms
    @game = Game.find(params[:id])

    @join_visitors_number = params[:join_visitors_number]
  end

  def server1
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size
    @second = params[:second]
    @@second = params[:second]

    @@game = params[:id]
    @@stage = "1"
    #@user_unregs = [1,4]
  end

  def server2
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    @@second = params[:second]

    @@game = params[:id]
    @@stage = "2"
    #@user_unregs = [1,4]
  end

  def tvwall_A1
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    @@second = params[:second]

    #@user_unregs = [1,4]
  end

  def server_idioms
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    # for idioms stage, rule is 60 seconds
    @second = params[:second]
    @@second = params[:second]

    @@game = params[:id]
    @@stage = "idioms"

  end

  def record
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @stage = @@stage
    
  end

  def record_idioms
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @@game = params[:id]
    @stage = "idioms"
    
  end

  def get_game_data
    if @@game.present?
      @game = Game.find(@@game)
      @visitor = @game.visitors.where(number: params[:id]).first

      respond_to do |format|
        format.json { render :json => { visitor: @visitor,second: @@second,game: @@game, stage: @@stage} }
      end
    else
      respond_to do |format|
        format.json { render :json => "false" }
      end
    end

  end
end
