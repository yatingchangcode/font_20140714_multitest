var helper = require('./helper');
module.exports = function (socket, io) {
  var game_id, stage_name, visitors;

  socket.on('idiom.down_location', function (msg) {
    msg.cid = msg.block.row + "_" + msg.block.column;
    emit_to_everyone('down_location', msg);
  });

  socket.on('idiom.move_location', function (msg) {
    msg.cid = msg.block.row + "_" + msg.block.column;
    emit_to_everyone('move_location', msg);
  });

  server_control_action('idiom.up_location');
  server_control_action('idiom.submit');
  server_control_action('idiom.move_block');
  server_control_action('idiom.send_text');
  server_control_action('idiom.rewrite');

  //
  socket.on('idiom.clear', function (msg) {
    msg.cid = msg.block.row + "_" + msg.block.column;
    socket.broadcast.emit('clear', msg);
  });


  //
  socket.on('idiom.set_gameinfo_to_socket', function (msg) {
    game_id = msg.game;
    stage_name = msg.stage;
    visitors = msg.visitors.split(",");
  });

  //
  socket.on('idiom.action', function (msg) {

    helper.emitUserId(msg.user_id, function (x) {
      io.to(x).emit('action', msg);
    });
    helper.emitUserId('0', function (x) {
      io.to(x).emit('action', msg);
    });
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
      emit_to_everyone(action, msg);
    });
  }


  function emit_to_server(action, msg) {
    helper.emitUserId('0', function (x) {
      io.to(x).emit(action, msg);
    });
  }

  function emit_to_everyone(action, msg) {
    socket.broadcast.emit(action, msg);
  }

};