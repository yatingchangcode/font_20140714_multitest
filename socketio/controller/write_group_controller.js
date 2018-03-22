var helper = require('./helper');
var path = require('path');
var fs = require('fs');
var mkdirp = require("mkdirp");

var game_id = 0;
var stage_name = '';
var visitors = [];
var user_id_file_path = {};

module.exports = function (socket, io) {

	function msg_cid (msg) {
		if(msg.block){
			return msg.user_id + '_' + msg.block;
		}
		return msg.user_id;
	}

	function server_control_action(action) {
		socket.on("group."+action, function (msg) {
			msg.cid = msg_cid(msg);
			emit_to_server(action, msg);
		});
	}
	
	function emit_to_server(action, msg) {
		helper.emitUserId('0', function (x) {
			io.to(x).emit(action, msg);
		});
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

	function save_action(cid) {
		var data = user_id_file_path[cid];
		if (data) {
			user_id_file_path[cid] = null;

			var file_path = data[0];
			var tosave = { file_path: data[0], renew: user_id_file_path[cid + "-renew"], cid: cid, data: data.slice(1, data.length)};
			var content = JSON.stringify(tosave);
			console.log(content);
			mkdirp(path.dirname(file_path), function (err) {
				if (err) return cb(err);
				fs.writeFile(file_path + ".json", content, function (err) {
					if (err) {
						throw 'error opening file: ' + err;
					}
					console.log('file written');
				});
			});
			// renew_one(cid, false);
		}
	}

	function renew_one(cid, renew) {
		user_id_file_path[cid + "-renew"] = renew;
	}

	socket.on('group.down_location', function (msg) {
		msg.cid = msg_cid(msg);
		emit_to_server('down_location', msg);
		cache_action(msg.cid, "down", msg.x, msg.y, msg.stamp);
	});

	socket.on('group.move_location', function (msg) {
		msg.cid = msg_cid(msg);
		emit_to_server('move_location', msg);
		cache_action(msg.cid, "move", msg.x, msg.y, msg.stamp);
	});

	server_control_action('up_location');
	server_control_action('submit');	// single block submit: "group.submit"; total submit: "submit"
	server_control_action('move_block');
	// The following events are extend from write_controller.js
	// server_control_action('cancelSubmit');
	// server_control_action('right');
	// server_control_action('removeO');
	// server_control_action('setCorrectCount');
	// server_control_action('showCorrectUsers');
	// server_control_action('userOut');
	// server_control_action('zoom');
	// server_control_action('unZoom');

	socket.on('group.clear', function (msg) {
	    // io.sockets.emit('clear', msg);
	    msg.cid = msg_cid(msg);

	    helper.emitUserId(msg.user_id, function (x) {
	    	io.to(x).emit('clear', msg);
	    });
	    helper.emitUserId('0', function (x) {
	    	io.to(x).emit('clear', msg);
	    });

	    var cid = msg.cid;
	    if (user_id_file_path[cid]) {
	    	cache_action(cid, "clear", null, null, msg.stamp);
	    }
	});


	socket.on('group.action', function (msg) {

		helper.emitUserId(msg.user_id, function (x) {
			io.to(x).emit('action', msg);
		});
		helper.emitUserId('0', function (x) {
			io.to(x).emit('action', msg);
		});

	    //when mobile send event, into the if else.
	    if (msg.action === "device_start") {
	    	msg.cid = msg_cid(msg);
	    	renew_one(msg.cid, !msg.hasTrack);
	    	start_cache(msg.user_id, msg.cid, game_id, stage_name);
	    	cache_action(msg.cid, "create", null, null, msg.stamp);
	    } else if (msg.action === "device_stop") {
	    	msg.cid = msg_cid(msg);
	    	cache_action(msg.cid, "end", null, null, msg.stamp);
	    	save_action(msg.cid);
	    }
	});

	socket.on('group.continue_write', function (msg) {
		helper.emitUserId(msg.user_id, function (x) {
			io.to(x).emit('continue_write', msg);
		});
		helper.emitUserId('0', function (x) {
			io.to(x).emit('continue_write', msg);
		});
	});

	socket.on('group.set_gameinfo_to_socket', function (msg) {
		game_id = msg.game;
		stage_name = msg.stage;
		visitors = JSON.parse(msg.visitors.replace(/&quot;/g, '"'));
	});

};