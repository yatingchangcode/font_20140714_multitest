
module.exports = function(io){

  this.emitUserId = function(user_id,message_name,message){
    for (var x in client_id[user_id]){
      io.to(client_id[user_id][x]).emit(message_name,message)
    }
  }
}