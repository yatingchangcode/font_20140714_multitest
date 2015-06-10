var helper = require('./helper');

module.exports = function (socket, io) {

  var game_id, stage_name, visitors;

  socket.on('down_location', function (msg) {
    emit_to_server('down_location', msg);
  });

  socket.on('move_location', function (msg) {
    emit_to_server('move_location', msg);
  });

  server_control_action('up_location');
  server_control_action('submit');
  server_control_action('cancelSubmit');
  server_control_action('right');
  server_control_action('removeO');
  server_control_action('setCorrectCount');
  server_control_action('showCorrectUsers');
  server_control_action('userOut');


  //
  socket.on('clear', function (msg) {
    socket.broadcast.emit('clear', msg);
  });

  //
  socket.on('clearAll', function () {
    socket.broadcast.emit('clear');
  });


  //
  socket.on('set_gameinfo_to_socket', function (msg) {
    game_id = msg.game;
    stage_name = msg.stage;
    visitors = msg.visitors.split(",");
  });

  //
  socket.on('action', function (msg) {

    helper.emitUserId(msg.user_id, function (x) {
      io.to(x).emit('action', msg);
    });
    helper.emitUserId('0', function (x) {
      io.to(x).emit('action', msg);
    });
  });



  socket.on('reset', function (msg) {
    socket.broadcast.emit('reset', msg);
  });

  //
  socket.on('continue_write', function (msg) {
    helper.emitUserId(msg.user_id, function (x) {
      io.to(x).emit('continue_write', msg);
    });
    helper.emitUserId('0', function (x) {
      io.to(x).emit('continue_write', msg);
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
