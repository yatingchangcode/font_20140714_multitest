
/**
 * @fileoverview Utilities for canvases recording in html page.
 * @author miecowbai@gmail.com (Kino Lien)
 */
(function(scope){
	/**
	 * Point object contains x, y coordinates and time stamp.
	 * @typedef {Object} Point
	 * @property {Number} x The x coordinate.
	 * @property {Number} y The y coordinate.
	 * @property {Number} stamp The datetime in milliseconds since 1970/01/01.
	 */
	 
	 /**
	 * Snapshot object record the snapshot of canvas element by stamps.
	 * @typedef {Object} Snapshot
	 * @property {Number} stamp The datetime in milliseconds since 1970/01/01.
	 * @property {HTMLCanvasElement} el The snapshot element.
	 */
	 
	 /**
	 * CompiledSnapshot object record the compiled element by stamps.
	 * @typedef {Object} CompiledSnapshot
	 * @property {Number} stamp The datetime in milliseconds since 1970/01/01.
	 * @property {String} base64 The compiled canvas snapshot in base 64 format.
	 */
	
	/**
	 * Canvas id and Recorder Instance mapping
	 * @private {Object.<string, RecorderInstance>}
	 */
	var instanceMap_ = {};
	
	/**
	 * The Recorder properties definitions.
	 * @typedef {Object} CanvasRdrProp
	 * @property {Number} width The source width.
	 * @property {Number} height The source height.
	 * @property {Number} lineWidth The source line width.
	 * @property {String} lineCap Sets the style of the end caps for a line. values: butt|round|square.
	 * @property {String} lineColor The line stroke color.
	 * @property {String} recordFormat The frame format. values: 480p
	 * @property {bool} cacheLastFrame True to cache the last action on the context.
	 * @property {Number} frameRate The frame rate, FPS(Frames Per Second).
	 * @property {String|HTMLImageElement} backgroundImage The image url or html element.
	 */
	var prop_ = {
		width: 500,
		height: 500,
		lineWidth: 9,
		lineCap: 'round',
		lineColor: '#000000',
		recordFormat: '480p',
		frameRate: 30,
		cacheLastFrame: true
		// backgroundImage
	};
	
	/**
	 * Get and record a snapshot of canvas.
	 * @private
	 * @param {Number} stamp The time stamp in milliseconds since 1970/01/01.
	 * @param {HTMLCanvasElement} sourceEl The source html canvas element.
	 * @return {Snapshot} 
	 */
	var record_ = function(stamp, sourceEl){
		var testC = document.createElement('canvas');
		var testCon = testC.getContext('2d');
		testC.width = sourceEl.width;
		testC.height = sourceEl.height;
		testCon.drawImage(sourceEl, 0, 0);
		
		return {stamp: stamp || (new Date()).getTime(), el: testC};
	};
	
	/**
	 * Calculate and arrange frame data in specified frame rate.
	 * @private
	 * @param {Array.<CompiledSnapshot>} data The compiled snapshots list.
	 * @param {Number} frameRate The fps.
	 * @return {Array.<CompiledSnapshot>} 
	 */
	var arrangeFrame_ = function(data, frameRate){
		/*
		var ms = 1 / frameRate * 1000;
		var startTime = data[0].stamp;
		var endTime = data[data.length-1].stamp;
		var endS = endTime - startTime;
		var it = startTime;
		
		var computedRecords = [];
		var frameCount = 0;
		var lessNear;
		var stampStep = startTime;
		var base64Step;
		while(it <= endTime){
			for(var i = 0; i < data.length; i++){
				var current = data[i];
				if (current.stamp <= it){
					lessNear = current;
				}else if(current.stamp > it){
					data = data.slice(i);
					break;
				}
			}
			computedRecords.push({
				originStamp: lessNear.stamp,
				stamp: frameCount++,
				base64: lessNear.base64
			});
			it += ms;
		}
		return computedRecords;
		*/
		return data;
	};
	
	/**
	 * Get canvas html element.
	 * @private
	 * @param {string|CanvasHTMLElement} id The id string.
	 * @return {CanvasHTMLElement} 
	 */
	var createEl_ = function(id){
		if(typeof id == 'string' && (id = id.trim()) ){
			var el = document.createElement('canvas');
			el.id = id;
			return el;
		}else{
			console.error('CR can not handle the null, undefined, empty id string or elements.');
			return null;
		}
	};
	
	/**
	 * Enum for Recorder Status.
	 * @enum {Number}
	 */
	var Status_ = {
		UNKNOWN: -1,
		IDLE: 0,
		//COMPILING: 1,
		RECORDING: 2,
		//COMPILING_PREV_AND_RECORDING_NEW: 3
	};
	
	/**
	 * Initialize the Recorder Empty Instance
	 * @private
	 */
	function RecorderEmptyInstance(){}
	RecorderEmptyInstance.prototype.point = function(){return this;};
	RecorderEmptyInstance.prototype.line = function(){return this;};
	RecorderEmptyInstance.prototype.clear = function(){return this;};
	RecorderEmptyInstance.prototype.start = function(){};
	RecorderEmptyInstance.prototype.stop = function(){};
	RecorderEmptyInstance.prototype.prop = function(){};
	
	/**
	 * Initialize the Canvas Recorder Instance
	 * @constructor
	 * @param {String} id A id string.
	 */
	function RecorderInstance(id){
		this.el_ = createEl_(id);
		this.id_ = this.el_.id;
		this.prop();
		
		var format = this.prop_.recordFormat || prop_.recordFormat;
		var ph = this.prop_.height || prop_.height;
		var pw = this.prop_.width || prop_.width;

		var h = this.height_ = parseInt(format);
		var w = this.width_ = (pw / ph) * h;
		
		var sourceMinWidth = Math.min(pw, ph);
		var minWidth = Math.min(
			this.el_.width = Math.round(w),
			this.el_.height = Math.round(h)
		);
		
		this.scale_ = minWidth / sourceMinWidth;
		
		var con = this.context_ = this.el_.getContext('2d');
		var back = this.prop_.backgroundImage || prop_.backgroundImage;
		if(back){
			if(typeof back == 'string'){
				this.backImg_ = new Image();
				this.backImg_.addEventListener('load', (function(scope, context, width, height){
					return function(){
						context.drawImage(this, 0, 0, width, height);
						scope.backImgLoad_ = true;
					}
				})(this, con, w, h));
				this.backImg_.src = back;
			}else if(Object.prototype.toString.call(back) == '[object HTMLImageElement]'){
				this.backImg_ = back;
				con.drawImage(back, 0, 0, w, h);
				this.backImgLoad_ = true;
			}else{
				console.error('CR can not handle the invalid image url/element.');
			}
		}
		
		var plienw = this.prop_.lineWidth || prop_.lineWidth;

		this.context_.lineWidth = minWidth / (sourceMinWidth / plienw);
		this.context_.lineCap = this.prop_.lineCap || prop_.lineCap;
		this.context_.strokeStyle = this.prop_.lineColor || prop_.lineColor;
		
		this.status_ = Status_.IDLE;
		this.history_ = [];
		this.compiledHistory_ = {};
	}
	
	/**
	 * Record a point of specified canvas.
	 * @param {Point} pt A point Object.
	 * @param {Function|null} callback
	 * @return {RecorderInstance}
	 */
	RecorderInstance.prototype.point = function(pt, callback){
		if(this.status_ == Status_.IDLE || this.status_ == Status_.RECORDING){
			var con = this.context_;
			var x = this.scale_ * pt.x;
			var y = this.scale_ * pt.y;
			con.beginPath();
			con.moveTo(x - 0.1, y - 0.1);
			con.lineTo(x, y);
			con.moveTo(x, y);
			con.stroke();
			if(this.status_){
				this.history_.push(record_(pt.stamp, this.el_));
			}
			if(typeof callback == 'function'){
				setTimeout((function(scope, point){
					return function(){
						callback.call(scope, point);
					};
				})(this, pt), 0);
			}	
		}
		return this;
	};
	
	/**
	 * Record a line of specified canvas.
	 * @param {Point} pt A point Object.
	 * @param {Function|null} callback
	 * @return {RecorderInstance}
	 */
	RecorderInstance.prototype.line = function(pt, callback){
		if(this.status_ == Status_.IDLE || this.status_ == Status_.RECORDING){
			var con = this.context_;
			var x = this.scale_ * pt.x;
			var y = this.scale_ * pt.y;
			con.lineTo(x, y);
			con.moveTo(x, y);
			con.stroke();
			if(this.status_){
				this.history_.push(record_(pt.stamp, this.el_));
			}
			if(typeof callback == 'function'){
				setTimeout((function(scope, point){
					return function(){
						callback.call(scope, point);
					};
				})(this, pt), 0);
			}
		}
		return this;
	};
	
	/**
	 * Record a clear action of specified canvas.
	 * @param {Number} stamp The time stamp in milliseconds since 1970/01/01.
	 * @param {Function|null} callback
	 * @return {RecorderInstance}
	 */
	RecorderInstance.prototype.clear = function(stamp, callback){
		if(this.status_ == Status_.IDLE || this.status_ == Status_.RECORDING){
			if(this.backImg_){
				this.context_.drawImage(this.backImg_, 0, 0, this.width_, this.height_);
			}else{
				this.context_.clearRect(0, 0, this.width_, this.height_);
			}
			if(this.status_){
				this.history_.push(record_(stamp, this.el_));
			}
			if(typeof callback == 'function'){
				setTimeout((function(scope, s){
					return function(){
						callback.call(scope, s);
					};
				})(this, stamp), 0);
			}
		}
		return this;
	};
	
	/**
	 * To Start a recording process.
	 * @param {Number} stamp The time stamp in milliseconds since 1970/01/01.
	 * @param {Function|null} startCallback
	 * @return {RecorderInstance}
	 */
	RecorderInstance.prototype.start = function(stamp, startCallback){
		// Handle the restart record in the case of non-completed compiling of previous recording.
		// ...
		if(this.status_ == Status_.RECORDING){
			console.error('CR at [' + this.id_ + '] is recording');
			return;
		}
		
		this.status_ = Status_.RECORDING;

		var pclf = this.prop_.cacheLastFrame;
		var cacheLastFrame = 
			(typeof pclf != 'undefined' && Object.prototype.toString.call(pclf) == '[object Boolean]')?
			pclf : prop_.cacheLastFrame;

		if(this.backImg_){
			if(this.backImgLoad_){
				if(!cacheLastFrame) this.context_.drawImage(this.backImg_, 0, 0, this.width_, this.height_);
				this.history_.push(record_(stamp, this.el_));
			}else{
				this.backImg_.addEventListener('load', (function(scope, s, recordMethod, cache){
					return function(){
						if(!cache) scope.context_.drawImage(this, 0, 0, scope.width_, scope.height_);
						scope.history_.push(recordMethod(s, scope.el_));
					};
				})(this, stamp, record_, cacheLastFrame));
			}
		}else{
			if(!cacheLastFrame) this.context_.clearRect(0, 0, this.width_, this.height_);
			this.history_.push(record_(stamp, this.el_));
		}
		if(typeof startCallback == 'function'){
			setTimeout((function(scope, s){
				return function(){
					startCallback.call(scope, s);
				};
			})(this, stamp), 0);
		}
	};
	
	/**
	 * To Stop a recording process.
	 * @param {Number} stamp The time stamp in milliseconds since 1970/01/01.
	 * @param {Function|null} resultsCallback
	 * @return {RecorderInstance}
	 */
	RecorderInstance.prototype.stop = function(stamp, resultsCallback){
		var self = this;
		if(self.status_ == Status_.RECORDING){
			self.history_.push(record_(stamp, self.el_));
			
			var frameRate = this.prop_.frameRate || prop_.frameRate || 25;
			var compilingTemp = self.history_.slice(0);
			self.history_ = [];
			self.status_ = Status_.IDLE;
			var item;
			var timeseq = 0;
			var stampKey = compilingTemp[0].stamp + "-" + compilingTemp[compilingTemp.length-1].stamp;
			self.compiledHistory_[stampKey] = [];
			while(item = compilingTemp.shift()){
				isLast = compilingTemp.length == 0;
				setTimeout((function(scope, t, last, key){
					return function(){	
						scope.compiledHistory_[key].push({stamp:t.stamp, base64:t.el.toDataURL()});
						//compiled.push({stamp:t.stamp, base64:t.el.toDataURL()});
						if(last){
							resultsCallback.call(scope, arrangeFrame_(scope.compiledHistory_[key].slice(0), frameRate));
							scope.compiledHistory_[key] = null;
						}
					};
				})(self, item, isLast, stampKey), timeseq += 3);
			}
			
		}
	};

	/**
	 * To Change the property of a record instance.
	 * @param {CanvasRdrProp|null} property The CanvasRdrProp object.
	 * @return {RecorderInstance|CanvasRdrProp}
	 */
	RecorderInstance.prototype.prop = function(property){
		if(!this.prop_) this.prop_ = {};
		if(property && Object.prototype.toString.call(property) == '[object Object]'){
			for(var p in property){
				this.prop_[p] = property[p];
			}
			return this;
		}
		return this.prop_;
	};
	
	/**
	 * Gets the canvas recorder instance or empty object.
	 * @param {String} id A id string.
	 * @return {RecorderInstance|RecorderEmptyInstance}
	 */
	function CR(id){
		if(typeof id == 'string' && (id = id.trim()) ){
			if(!instanceMap_[id]){
				return new RecorderEmptyInstance();
			}
			return instanceMap_[id];
		}
		console.error('CR can not handle the [' + id + '].');
		return new RecorderEmptyInstance();
	}
	
	/**
	 * Register and new a canvas recorder instance.
	 * @param {String|Array.<String>} id A id string.
	 */
	CR.reg = function(id){
		var ids;
		if(Object.prototype.toString.call(id) == '[object Array]'){
			ids = id.slice(0);
		}else ids = [id];
		for(var i = 0, len = ids.length; i<len; i++){
			var id = ids[i];
			if(typeof id == 'string' && (id = id.trim()) ){
				if(!instanceMap_[id]){
					instanceMap_[id] = new RecorderInstance(id);
				}
			}else{
				console.error('CR can not handle the [' + id + '].');
			}
		}
	};
	
	/**
	 * Unregister and delete the specified canvas id.
	 * @param {String|Array.<String>} id A id string.
	 */
	CR.unreg = function(id){
		var ids;
		if(Object.prototype.toString.call(id) == '[object Array]'){
			ids = id.slice(0);
		}else ids = [id];
		for(var i = 0, len = ids.length; i<len; i++){
			var id = ids[i];
			if(typeof id == 'string' && (id = id.trim()) ){
				if(instanceMap_[id]){
					instanceMap_[id] = null;
				}
			}else{
				console.error('CR can not handle the [' + id + '].');
			}	
		}
	}
	
	/**
	 * Gets or sets the common properties of canvas recorder.
	 * @param {Object|null} property A canvas recorder properties.
	 * @param {Object}
	 */
	CR.prop = function(property){
		if(property && Object.prototype.toString.call(property) == '[object Object]'){
			for(var p in property){
				prop_[p] = property[p];
			}
			for(var ins in instanceMap_){
				instanceMap_[ins].prop(property);
			}
			var back = prop_.backgroundImage;
			if(back){
				if(typeof back == 'string'){
					var imgEl = new Image();
					imgEl.onload = function(){
						prop_.backgroundImage = this;
					};
					imgEl.src = back;
				}else if(Object.prototype.toString.call(back) == '[object HTMLImageElement]'){
				}else{
					console.error('CR can not handle the invalid image url/element.');
				}
			}
		}
		return prop_;
	};
	
	CR.clearAll = function(){
		for(var ins in instanceMap_){
			instanceMap_[ins].clear();
		}
		return CR;
	};

	/**
	 * Enum for Recorder Status to CR class enum.
	 * @enum {Number}
	 */
	CR.Status = {};
	for(var p in Status_){
		CR.Status[p] = Status_[p];
	}
	
	// return to input scope
	scope.CR = CR;
})(window);


