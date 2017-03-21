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

    record_path ||= File.expand_path(File.join("record"), Rails.public_path)
    file_path = FileUtils.mkdir_p("#{record_path}/game#{@game.id}_#{@game.created_at.strftime("%Y%m%d")}")

    redirect_to game_path(@game)
  end

  def destroy
    @game = Game.find(params[:id])
    @game.destroy
    
    redirect_to games_path
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

  def stageB2
    @game = Game.find(params[:id])

    @stage = params[:stage]

    @join_visitors_number = params[:join_visitors_number]
  end

  def stage_idioms
    @game = Game.find(params[:id])

    @stage = params[:stage]

    @join_visitors_number = params[:join_visitors_number]
  end

  def stage_multi
    @game = Game.find(params[:id])

    @stage = params[:stage]

    @join_visitors_number = params[:join_visitors_number]
  end

  def stage_mix
    @game = Game.find(params[:id])

    @stage = params[:stage]

    @join_visitors_number = params[:join_visitors_number]
  end

  def server1
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size
    
    @second = params[:second]
    @counting = params[:counting]
    @stage = params[:stage]
    if @stage == 'C1'
      @stage = 'A1'
    end

    Setting.messaging['second'] = @second
    Setting.messaging['game'] = params[:id]
    Setting.messaging['stage'] = @stage
    #Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record?join_visitors_number=#{params[:join_visitors_number]}"
    #@user_unregs = [1,4]
    # if Setting.messaging['is_record_open'] != true
    #   `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    # end
  end

  def server2
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    @counting = params[:counting]
    @stage = params[:stage]
    if @stage == 'C2'
      @stage = 'A2'
    end

    Setting.messaging['second'] = @second
    Setting.messaging['game'] = params[:id]
    Setting.messaging['stage'] = @stage
    #@user_unregs = [1,4]
    # Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record?join_visitors_number=#{params[:join_visitors_number]}"
    # if Setting.messaging['is_record_open'] != true
    #   `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    # end
  end

  def serverB2
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size
    @second = params[:second]

    Setting.messaging['second'] = params[:second]
    Setting.messaging['game'] = params[:id]
    Setting.messaging['stage'] = params[:stage]
    @stage = params[:stage]
    # Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record?join_visitors_number=#{params[:join_visitors_number]}"
    #@user_unregs = [1,4]
    # if Setting.messaging['is_record_open'] != true
    #   `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    # end
  end

  def server_idioms
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    # for idioms stage, rule is 60 seconds
    @stage = params[:stage]
    @second = params[:second]
    if @stage == 'C-idioms'
      @stage = "B3"
    end
    Setting.messaging['second'] = @second
    Setting.messaging['game'] = params[:id]
    Setting.messaging['stage'] = @stage
    # Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record_idioms?join_visitors_number=#{params[:join_visitors_number]}"
    # if Setting.messaging['is_record_open'] != true
    #   `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    # end
  end

  def server_multi
    @game = Game.find(params[:id])

    visitors_splits = params[:join_visitors_number].split(",")

    @visitors = @game.visitors.where(number: visitors_splits)
    @range = 1..@visitors.size
    @auto = params[:auto]
    @second = params[:second]
    @counting = params[:counting]

    Setting.messaging['second'] = params[:second]
    Setting.messaging['game'] = params[:id]
    # Setting.messaging['stage'] = params[:stage]
    # To control the mobile get in A1 view, through get_game_data event
    Setting.messaging['stage'] = 'A1'
    @stage = params[:stage]

    command_name = "echo"
    xdg_open_test = `xdg-open`
    open_test = `open`
    if xdg_open_test != nil or open_test != nil
      if xdg_open_test != nil
        command_name = "xdg-open" 
      else
        command_name = "open" 
      end
    end
    
    # if @visitors.length > 10
    #   # should_opens = @visitors.length / 20 + 1
    #   # if @visitors.length % 20 == 0
    #   #   should_opens = should_opens - 1
    #   # end
    #   # per_visitor = @visitors.length / should_opens
    #   # @visitors[(@visitors.length/2.0).ceil..@visitors.length-1].each do |visitor|
    #   visitor_per_page = @visitors.length / 2
    #   if @visitors.length % 2 == 0
    #     visitor_per_page = visitor_per_page - 1
    #   end

    #   #  5: 0-2, 3-4
    #   # 13: 0-6, 7-12

    #   # 14: 0-7, 8-13

    #   url_1 = "http://0.0.0.0:3000/games/#{params[:id]}/tvwall_#{@stage}?join_visitors_number=#{visitors_splits[0..visitor_per_page].join(',')}&second=#{@second}&counting=#{@counting}&tv_n=tv_1"
    #   url_2 = "http://0.0.0.0:3000/games/#{params[:id]}/tvwall_#{@stage}?join_visitors_number=#{visitors_splits[visitor_per_page+1..@visitors.length-1].join(',')}&second=#{@second}&counting=#{@counting}&tv_n=tv_2"

    #   p url_1
    #   p url_2

    #   if Setting.messaging['is_tv_1_open'] != true
    #     `#{command_name} '#{url_1}'`
    #   end
    #   if Setting.messaging['is_tv_2_open'] != true
    #     `#{command_name} '#{url_2}'`
    #   end

      
      

    #   # url = "http://0.0.0.0:3000/games/#{params[:id]}/record?join_visitors_number=#{params[:join_visitors_number]}"
    #   # `xdg-open #{url} || open #{url}`
    # else

    #   url_1 = "http://0.0.0.0:3000/games/#{params[:id]}/tvwall_#{@stage}?join_visitors_number=#{visitors_splits[0..@visitors.length-1].join(',')}&second=#{@second}&counting=#{@counting}&tv_n=tv_1"
    #   if Setting.messaging['is_tv_1_open'] != true
    #     `#{command_name} '#{url_1}'`
    #   end
    # end

    url_1 = "http://0.0.0.0:3000/games/#{params[:id]}/tvwall_#{@stage}?join_visitors_number=#{visitors_splits[0..@visitors.length-1].join(',')}&second=#{@second}&counting=#{@counting}&tv_n=tv_1&order_type=#{params[:order_type]}&auto=#{params[:auto]}&rice=#{params[:rice]}"
    if Setting.messaging['is_tv_1_open'] != true
      `#{command_name} '#{url_1}'`
    end

    #Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record?join_visitors_number=#{params[:join_visitors_number]}"
    #@user_unregs = [1,4]
    # if Setting.messaging['is_record_open'] != true
    #   `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    # end
  end

  def server_mix
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size
    @second = params[:second]
    @counting = params[:counting]
    @common = params[:common]
    @locking = params[:locking]

    Setting.messaging['second'] = params[:second]
    Setting.messaging['game'] = params[:id]
    Setting.messaging['stage'] = params[:stage]
    @stage = params[:stage]
    # Setting.messaging['record_url'] = "http://0.0.0.0:3000/games/#{params[:id]}/record?join_visitors_number=#{params[:join_visitors_number]}"
    #@user_unregs = [1,4]
    # if Setting.messaging['is_record_open'] != true
    #   `xdg-open #{Setting.messaging['record_url']} || open #{Setting.messaging['record_url']}`
    # end
  end

  def tvwall_A1
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    @counting = params[:counting]

  end

  def tvwall_A2
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    @counting = params[:counting]
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
    @counting = params[:counting]
  end

  def tvwall_B2_v1
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

  def tvwall_C1
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    @counting = params[:counting]
  end

  def tvwall_C2
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    @counting = params[:counting]
  end

  def tvwall_C3
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
    @counting = params[:counting]
  end

  def tvwall_c_idioms
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @second = params[:second]
  end

  def tvwall_multi

    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @auto = params[:auto];
    @second = params[:second]
    @counting = params[:counting]
    @tv_n = params[:tv_n]
    @order_type = params[:order_type]
  end

  def tvwall_mix
    @game = Game.find(params[:id])
    @visitors = @game.visitors.where(number: params[:join_visitors_number].split(","))
    @range = 1..@visitors.size

    @stage = params[:stage]
    @second = params[:second]
    @counting = params[:counting]
    @common = params[:common]
    @locking = params[:locking]
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
        format.json { render :json => { visitor: @visitor,
          second: Setting.messaging['second'],
          common: Setting.messaging['common'],
          locking: Setting.messaging['locking'],
          game: Setting.messaging['game'], 
          stage: Setting.messaging['stage'],
          recordUrl: Setting.messaging['record_url']} }
      end
    else
      respond_to do |format|
        format.json { render :json => "false" }
      end
    end

  end

  def convert_page
    @game = Game.find(params[:id])
    @files = get_record_json_data(@game)    
  end

  def set_game_data
    res = { success: false }
    if params[:second]
      Setting.messaging['second'] = params[:second]
      res['success'] = true
    end
    if params[:common]
      Setting.messaging['common'] = params[:common]
      res['success'] = true
    end
    if params[:locking]
      Setting.messaging['locking'] = params[:locking]
      res['success'] = true
    end
    respond_to do |format|
      format.json { render :json => res }
    end
  end

  private
  def get_record_json_data(game)
    record_path ||= File.expand_path(File.join("record"), Rails.public_path)
    file_dir = "#{record_path}/game#{game.id}"
    web_url = "/record/game#{game.id}"
    Dir.chdir(file_dir) 
    files = Dir.glob("*.json").map { |x| "#{web_url}/#{x}" } 
  end


end
