var helper = require('./helper');
var path = require('path');
var fs = require('fs');
var mkdirp = require("mkdirp");

var game_id = 0;
var stage_name = '';
var visitors = [];
var user_id_file_path = {};

module.exports = function (socket, io) {

  socket.on('idioms.down_location', function (msg) {
    msg.cid = msg_cid(msg);
    emit_to_everyone('down_location', msg);
    cache_action(msg.cid, "down", msg.x, msg.y, msg.stamp);
  });

  socket.on('idioms.move_location', function (msg) {
    msg.cid = msg_cid(msg);
    emit_to_everyone('move_location', msg);
    cache_action(msg.cid, "move", msg.x, msg.y, msg.stamp);
  });

  server_control_action('up_location');
  server_control_action('submit');
  server_control_action('move_block');
  server_control_action('send_text');
  server_control_action('rewrite');

  socket.on('idioms.clear', function (msg) {
    msg.cid = msg_cid(msg);
    io.sockets.emit('clear', msg);

    var cid = msg.cid;
    if (user_id_file_path[cid]) {
      cache_action(cid, "clear", null, null, msg.stamp);
    } else {
      renew_one(cid, true);
    }
  });


  socket.on('idioms.set_gameinfo_to_socket', function (msg) {
    game_id = msg.game;
    stage_name = msg.stage;
    visitors = JSON.parse(msg.visitors.replace(/&quot;/g, '"'));
  });

  socket.on('idioms.action', function (msg) {

    helper.emitUserId(msg.user_id, function (x) {
      io.to(x).emit('action', msg);
    });
    helper.emitUserId('0', function (x) {
      io.to(x).emit('action', msg);
    });

    //when mobile send event, into the if else.
    if (msg.action === "device_start") {
      msg.cid = msg_cid(msg);
      start_cache(msg.user_id, msg.cid, game_id, stage_name);
      cache_action(msg.cid, "create", null, null, msg.stamp);
    } else if (msg.action === "device_stop") {
      msg.cid = msg_cid(msg);
      cache_action(msg.cid, "end", null, null, msg.stamp);
      save_action(msg.cid, false);
    }
  });

  socket.on('continue_write', function (msg) {
    helper.emitUserId(msg.user_id, function (x) {
      io.to(x).emit('continue_write', msg);
    });
    helper.emitUserId('0', function (x) {
      io.to(x).emit('continue_write', msg);
    });
  });

  function server_control_action(action) {
    socket.on('idioms.'+action, function (msg) {
      msg.cid = msg_cid(msg);
      emit_to_everyone(action, msg);
    });
  }


  function emit_to_server(action, msg) {
    helper.emitUserId('0', function (x) {
      io.to(x).emit(action, msg);
    });
  }

  function emit_to_everyone(action, msg) {
    io.sockets.emit(action, msg);
  }

    function start_cache(uid, cid, game_id, stage) {
    var visitor = _(visitors).find(function (visitor) {
      return visitor.number == uid;
    });

    var now_time_string = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '');
    var file_name = visitor.name + '_stage' + stage + '_' + now_time_string;

    ///Users/motephyr/Projects/Ruby/font_20140714/socketio/controller
    var current_path = __dirname;
    var record_path = path.resolve(current_path, "../../public/record");
    var file_path = record_path + '/game' + game_id + '/' + file_name;

    user_id_file_path[cid] = [file_path];
  }

  function cache_action(cid, action, x, y, stamp) {
    if (user_id_file_path[cid]) {
      user_id_file_path[cid].push([action, x, y, stamp]);
    }
  }

  function save_action(cid, default_value) {
    var data = user_id_file_path[cid];
    if (data) {
      user_id_file_path[cid] = null;

      if (!user_id_file_path[cid + "-renew"]) {
        user_id_file_path[cid + "-renew"] = default_value;
      }
      var file_path = data[0];
      var tosave = { file_path: data[0], renew: user_id_file_path[cid + "-renew"], cid: cid, data: data.slice(1, data.length)};
      var content = JSON.stringify(tosave);
      console.log(content);
      mkdirp(path.dirname(file_path), function (err) {
        if (err) return cb(err)
          fs.writeFile(file_path + ".json", content, function (err) {
            if (err) {
              throw 'error opening file: ' + err;
            }

            console.log('file written');

          });
      });
      renew_one(cid, false);

    }
  }

  function renew_one(cid, renew) {
    user_id_file_path[cid + "-renew"] = renew;
  }

  function renew_all(visitors, renew) {
    _(visitors).forEach(function (n) {
      for (var r = 1; r < 8; r++){
        for (var c = 1; c < 12; c++) {
          renew_one(r+'_'+c, renew);
        };
      };
    });
  }

  function msg_cid (msg) {
    return msg.user_id +'_' + msg.block.row + '_' + msg.block.column;
  }

};