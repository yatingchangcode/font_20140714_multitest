var helper = require('./helper');
module.exports = function (socket, io) {
  var game_id, stage_name, visitors;

  socket.on('b2.down_location', function (msg) {
    emit_to_server('down_location', msg);
  });

  socket.on('b2.move_location', function (msg) {
    emit_to_server('move_location', msg);
  });

  server_control_action('b2.up_location');
  server_control_action('b2.submit');
  server_control_action('b2.move_block');
  server_control_action('b2.right');
  server_control_action('b2.remove_o');
  server_control_action('b2.setCorrectCount');
  server_control_action('b2.showCorrectUsers');



  //
  socket.on('b2.clear', function (msg) {
    socket.broadcast.emit('clear', msg);
  });

  //
  socket.on('b2.clearAll', function () {
    socket.broadcast.emit('clear');
  });
  //
  socket.on('b2.set_gameinfo_to_socket', function (msg) {
    game_id = msg.game;
    stage_name = msg.stage;
    visitors = msg.visitors.split(",");
  });

  //
  socket.on('b2.action', function (msg) {

    helper.emitUserId(msg.user_id, function (x) {
      io.to(x).emit('action', msg);
    });
    helper.emitUserId('0', function (x) {
      io.to(x).emit('action', msg);
    });
  });

  function server_control_action(action) {
    socket.on(action, function (msg) {
      emit_to_server(action, msg);
    });
  }


  function emit_to_server(action, msg) {
    helper.emitUserId('0', function (x) {
      io.to(x).emit(action, msg);
    });
  }

  return socket;
};