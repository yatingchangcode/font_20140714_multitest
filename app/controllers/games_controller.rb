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

    @stage = params[:stage]

    @join_visitors_number = params[:join_visitors_number]
  end

  def stage2
    @game = Game.find(params[:id])

    @stage = params[:stage]

    @join_visitors_number = params[:join_visitors_number]
  end

  def stage_idioms
    @game = Game.find(params[:id])

    @stage = params[:stage]

    @join_visitors_number = params[:join_visitors_number]
  end

  def server1
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size
    @second = params[:second]

    Setting.messaging['second'] = params[:second]
    Setting.messaging['game'] = params[:id]
    Setting.messaging['stage'] = params[:stage]
    @stage = params[:stage]
    Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record?join_visitors_number=#{params[:join_visitors_number]}"
    #@user_unregs = [1,4]
    if Setting.messaging['is_record_open'] != true
      `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    end
  end

  def server2
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    Setting.messaging['second'] = params[:second]

    Setting.messaging['game'] = params[:id]
    Setting.messaging['stage'] = params[:stage]
    #@user_unregs = [1,4]
    Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record?join_visitors_number=#{params[:join_visitors_number]}"
    if Setting.messaging['is_record_open'] != true
      `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    end
  end

  def tvwall_A1
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
  end

  def tvwall_A2
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]

    @space_top = "120"
    @space_left = "5%"
    @space_right = "4%"
    @canvas_scale = 0.171
    @canvas_border = 9
    @font_formula = "w / 3 * 16 / 15"
    @bar_formula = "(w + 5) / 2"
    @timebar_height = "12px"
    case @visitors.length
    when 2
      @canvas_scale = 0.243
      @canvas_border = 15
      @space_top = "140"
      @space_left = "25%"
      @space_right = "24%"
      @timebar_height = "16px"
    when 3
      @canvas_scale = 0.217
      @canvas_border = 13
      @space_left = "18%"
      @space_right = "17%"
      @timebar_height = "15px"
    when 4
      @font_formula = "w / 3 * 16.2 / 15"
      @bar_formula = "(w + 3) / 2"
      @canvas_scale = 0.191
      @canvas_border = 11
      @space_left = "10%"
      @space_right = "9%"
      @timebar_height = "14px"
    end
  end

  def tvwall_A3
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
  end

  def tvwall_B1
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
  end

  def tvwall_B2
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
  end

  def tvwall_B3
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
  end

  def server_idioms
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    # for idioms stage, rule is 60 seconds
    @second = params[:second]
    Setting.messaging['second'] = params[:second]

    Setting.messaging['game'] = params[:id]
    Setting.messaging['stage'] = params[:stage]
    Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record_idioms?join_visitors_number=#{params[:join_visitors_number]}"
    if Setting.messaging['is_record_open'] != true
      `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    end
  end

  def record
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @stage = Setting.messaging['stage']
    
  end

  def record_idioms
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @stage = Setting.messaging['stage']
    
  end

  def get_game_data
    if Setting.messaging['game'].present?
      @game = Game.find(Setting.messaging['game'])
      @visitor = @game.visitors.where(number: params[:id]).first

      respond_to do |format|
        format.json { render :json => { visitor: @visitor,second: Setting.messaging['second'],game: Setting.messaging['game'], stage: Setting.messaging['stage'], recordUrl: Setting.messaging['record_url']} }
      end
    else
      respond_to do |format|
        format.json { render :json => "false" }
      end
    end

  end
end
