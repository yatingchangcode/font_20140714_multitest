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

  def open_file
    p message[:user_id]+" open_file"

    @game = Game.find(message[:game])
    @visitor = @game.visitors.find_by(number: message[:user_id])

    file_name = "#{@visitor.name}_stage#{message[:stage]}_#{Time.now.strftime("%Y%m%d_%H%M%S")}"
   
    record_path ||= File.expand_path(File.join("record"), Rails.public_path)
    file_path = FileUtils.mkdir_p("#{record_path}/game#{message[:game]}_#{@game.created_at.strftime("%Y%m%d")}/#{file_name}")
    
    controller_store[:user_id_file_path][message[:trade_key]] = file_path
    #p controller_store[:user_id_file_path]
  end

  def save_file 
    p message[:user_id]+" save_file: cache frames"
    controller_store[:user_id_file_path][message[:trade_key]] << [ message[:timestamp], Base64.decode64(message[:base64]) ]
    # file_path = controller_store[:user_id_file_path][message[:trade_key]][0]
    # file_name = message[:timestamp]
    # enc   = Base64.decode64(message[:base64])
    # f = File.open("#{file_path}/#{file_name}.png", 'wb') {|f| f.write(enc)}
  end

  def close_file
    p message[:user_id]+" close_file: prepare arrange"
    framerate = 50
    file_path = controller_store[:user_id_file_path][message[:trade_key]][0]
    arranged = arrange_frames(controller_store[:user_id_file_path][message[:trade_key]][1..-1], framerate)
    p message[:user_id]+" close_file: frame arranged"
    p message[:user_id]+" close_file: saving arranged frames"
    arranged.each do |frame|
      file_name = frame[0]
      f = File.open("#{file_path}/#{file_name}.png", 'wb') {|f| f.write(frame[1])}
    end
    p message[:user_id]+" close_file: arranged frames saved"
    #file_path = controller_store[:user_id_file_path][message[:trade_key]][0]
    #p Dir[file_path + "/*.png"]
    # p message[:user_id]+" close_file"
    # file_path = controller_store[:user_id_file_path][message[:trade_key]][0]
    begin
      p Subprocess.check_call(["ffmpeg", "-framerate", framerate.to_s, "-pix_fmt", "yuv420p", "-s", "480x480", "-i", "#{file_path}/%d.png", "#{file_path}.mp4", "-y"])
      controller_store[:user_id_file_path][message[:trade_key]] = nil
    rescue Subprocess::NonZeroExit => e
      puts e.message
      puts "Why aren't llamas one of your favorite animals?"
    end
  end



  def client_connected
    controller_store[:user_count] += 1
    if params[:client_id] == 'record'
      p "is_recode_open"
      Setting.messaging['is_record_open'] = true
    end
    p "user_count #{controller_store[:user_count]} ,user #{params[:client_id]} connected #{Time.now}"
    WebsocketRails.users[params[:client_id]] = connection
  end

  def client_disconnected
    controller_store[:user_count] -= 1
    if params[:client_id] == 'record'
      p "is_recode_close"
      Setting.messaging['is_record_open'] = false
    end
    p "user_count #{controller_store[:user_count]} ,user #{params[:client_id]} disconnected #{Time.now}"
    known_connections = WebsocketRails.users[params[:client_id]]
    known_connections.connections.delete connection
  end

  private 
  def arrange_frames(origin_data, framerate)
    computed = []
    ms = 1000 / framerate
    startTime = origin_data[0][0].to_i
    endTime = origin_data[-1][0].to_i
    it = startTime

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

end
