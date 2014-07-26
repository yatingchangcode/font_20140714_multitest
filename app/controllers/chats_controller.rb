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
    random_name = SecureRandom.hex(6)
    file_path = Dir.mktmpdir("#{message[:user_id]}/#{random_name}")
    controller_store[:user_id_file_path] << { :message[:user_id] => file_path}
  end

  def save_file 
    file_path = controller_store[:user_id_file_path][message[:user_id]]
    enc   = Base64.decode64(message[:base64])
    f = File.open("#{file_path}/#{message[:timestamp]}.jpg", 'wb') {|f| f.write(enc)}
  end

  def close_file
    #controller_store[:user_id_file] - :message[:user_id]
    begin
      p Subprocess.check_call(['ls', '-al', 'tmp'])
    rescue Subprocess::NonZeroExit => e
      puts e.message
      puts "Why aren't llamas one of your favorite animals?"
    end
  end



  def client_connected
    controller_store[:user_count] += 1
    p "user_count #{controller_store[:user_count]} ,user connected #{Time.now}"
    WebsocketRails.users[params[:client_id]] = connection
  end

  def client_disconnected
    controller_store[:user_count] -= 1
    p "user_count #{controller_store[:user_count]} ,user disconnected #{Time.now}"
    known_connections = WebsocketRails.users[client_id]
    known_connections.connections.delete connection
  end
end
