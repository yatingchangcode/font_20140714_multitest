class ChatsController < WebsocketRails::BaseController

  def initialize_session
    # perform application setup here
    controller_store[:user_count] = 0
    controller_store[:user_id_file_path] = {}     #需轉檔的使用者id和暫存路徑
  end

  def get_user_count
    # perform application setup here
    connection = WebsocketRails.users[0]

    data = {:user_count => controller_store[:user_count]}
    connection.send_message :get_user_count, data
  end

  def is_connected
    target_id = message[:check_id]
    from_connection = WebsocketRails.users[message[:user_id]]
    target_connection = WebsocketRails.users[target_id]
    # p target_connection.methods
    # p target_connection.connections.length
    from_connection.send_message :is_connected, { check_id:target_id, connected: target_connection.connections.length }
  end

  def save_record
    record_connection = WebsocketRails.users["record"]
    control_connection = WebsocketRails.users[0]
    record_connection.send_message :save_record, message
    control_connection.send_message :save_record, message
  end

  def open_file

    record_path ||= File.expand_path(File.join("record"), Rails.public_path)
    file_path = FileUtils.mkdir_p("#{record_path}/#{message[:file_path]}")
    # message[:file_path] = game#{game_id}_#{@game.created_at.strftime("%Y%m%d")}/#{file_name}
    # file_path = FileUtils.mkdir_p(message[:file_path])
    p "open_file"
    p file_path
    #controller_store[:user_id_file_path][message[:trade_key]] = file_path
    controller_store[:user_id_file_path][message[:trade_key]] = file_path
    #p controller_store[:user_id_file_path]
  end

  def save_file 
    p "save_frames"
    controller_store[:user_id_file_path][message[:trade_key]] << [ message[:timestamp], Base64.decode64(message[:base64]) ]
    # file_path = controller_store[:user_id_file_path][message[:trade_key]][0]
    # file_name = message[:timestamp]
    # enc   = Base64.decode64(message[:base64])
    # f = File.open("#{file_path}/#{file_name}.png", 'wb') {|f| f.write(enc)}
  end

  def close_file
    p "trans_to_mp4"
    framerate = 50
    file_path = controller_store[:user_id_file_path][message[:trade_key]][0]
    arranged = arrange_frames(controller_store[:user_id_file_path][message[:trade_key]][1..-1], framerate)
    controller_store[:user_id_file_path][message[:trade_key]] = nil
    p arranged.count
    arranged.each do |frame|
      file_name = frame[0]
      f = File.open("#{file_path}/#{file_name}.png", 'wb') {|f| f.write(frame[1])}
    end

    begin
      p Subprocess.check_call(["ffmpeg", "-framerate", framerate.to_s, "-pix_fmt", "yuv420p", "-s", "480x480", "-i", "#{file_path}/%d.png", "#{file_path}.mp4", "-y"])
      control_connection = WebsocketRails.users["record"]
      #log_msg = "編號[" + message[:trade_key] + "]已存檔"
      control_connection.send_message :save_record, {callback_id: message[:callback_id], is_saved: message[:is_total_end] }
    rescue Subprocess::NonZeroExit => e
      puts e.message
      control_connection = WebsocketRails.users["record"]
      control_connection.send_message :save_record, {callback_id: message[:callback_id], is_saved: message[:is_total_end], msg: e.message }
    end
  end



  def client_connected
    controller_store[:user_count] += 1

    set_record_status(true)
    
    set_connection_status(params,true)

    p "user_count #{controller_store[:user_count]} ,user #{params[:client_id]} connected #{Time.now}"
    WebsocketRails.users[params[:client_id]] = connection
  end

  def client_disconnected
    controller_store[:user_count] -= 1

    set_record_status(false)
    
    # set_connection_status(params,false)

    p "user_count #{controller_store[:user_count]} ,user #{params[:client_id]} disconnected #{Time.now}"
    known_connections = WebsocketRails.users[params[:client_id]]
    known_connections.connections.delete connection

    set_connection_status(params, known_connections.connections.length > 0)
  end

  private 
  def arrange_frames(origin_data, framerate)
    computed = []
    ms = 1000 / framerate
    startTime = origin_data[0][0].to_i
    endTime = origin_data[-1][0].to_i
    offsetTime = endTime - startTime
    p offsetTime
    i = 0
    j = 0
    small = 0 # 1:small 2:big
    big = 0
    p "offT = #{offsetTime}"
#===============
    arylen = origin_data.length
    while offsetTime < 0 do
            i+=1
            small = 1
            startTime = origin_data[i][0].to_i
            offsetTime = endTime - startTime
    end
    if small == 1 then
            origin_data = origin_data[i..arylen]
    end
#===============
    arylen = origin_data.length
    while offsetTime > 10000 do
	    j+=1
	    big= 1
	    startTime = origin_data[j][0].to_i
	    offsetTime = endTime - startTime
    end
    arylen = origin_data.length
    if big == 1 then
	    origin_data = origin_data[j..arylen]
    end
#===============
    startTime = origin_data[0][0].to_i
    it = startTime
    offsetTime = endTime - startTime
    frameCount = 0
    lessNear = nil

    while it <= endTime  do
      origin_data.each_with_index do |d, index|
        si = d[0].to_i
        if si <= it then
          lessNear = d
        elsif si > it then
          origin_data = origin_data[index..-1]
          break
        end
      end
      frameCount+=1
      computed.push( [frameCount.to_s, lessNear[1]] ) 
      it += ms
    end
    return computed
  end

  def set_record_status(status)
    if params[:client_id] == 'record'
      p "is_record_open"
      Setting.messaging['is_record_open'] = status
    end

    # for tv wall
    if params[:tv_id] == 'tv_1'
      p "is_tv_1_actions"
      Setting.messaging['is_tv_1_open'] = status
      # Setting.messaging['is_record_open'] = status
    end 
    if params[:tv_id] == 'tv_2'
      p "is_tv_2_actions"
      Setting.messaging['is_tv_2_open'] = status
      # Setting.messaging['is_record_open'] = status
    end    
  end

  def set_connection_status(params,status)
    if params[:client_id] == '0' || params[:client_id] == 'record'
      #do nothing
    else
      link_number = params[:client_id].to_i
      link_number_str = params[:client_id].to_s
      data = { :"#{link_number_str}" => status}
      manager_connection =  WebsocketRails.users[0]
      manager_connection.send_message :client_connected, data

      # trigger_connection =  WebsocketRails.users[link_number]
      # trigger_connection.send_message :client_connected, data
    end
  end

end
