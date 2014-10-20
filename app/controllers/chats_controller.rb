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
    p controller_store[:user_id_file_path]
  end

  def save_file 
    p message[:user_id]+" save_file"
    file_path = controller_store[:user_id_file_path][message[:trade_key]][0]
    file_name = message[:timestamp]

    enc   = Base64.decode64(message[:base64])
    f = File.open("#{file_path}/#{file_name}.png", 'wb') {|f| f.write(enc)}
  end

  def close_file
    p message[:user_id]+" close_file"
    file_path = controller_store[:user_id_file_path][message[:trade_key]][0]
    begin
      p Subprocess.check_call(["ffmpeg", "-framerate", "50", "-i", "#{file_path}/%d.png", "#{file_path}.mp4", "-y"])
    rescue Subprocess::NonZeroExit => e
      puts e.message
      puts "Why aren't llamas one of your favorite animals?"
    end
  end



  def client_connected
    controller_store[:user_count] += 1
    p "user_count #{controller_store[:user_count]} ,user #{params[:client_id]} connected #{Time.now}"
    WebsocketRails.users[params[:client_id]] = connection
  end

  def client_disconnected
    controller_store[:user_count] -= 1
    p "user_count #{controller_store[:user_count]} ,user #{params[:client_id]} disconnected #{Time.now}"
    known_connections = WebsocketRails.users[params[:client_id]]
    known_connections.connections.delete connection
  end
end
