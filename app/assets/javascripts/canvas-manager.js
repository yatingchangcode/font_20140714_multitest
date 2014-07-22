/**
 * @fileoverview Utilities for handling canvases in html page.
 * @author miecowbai@google.com (Kino Lien)
 */
 
(function(scope){
	/**
	 * Point object contains x and y coordinates.
	 * @typedef {Object} Point
	 * @property {number} x The x coordinate.
	 * @property {number} y The y coordinate.
	 */
	
	/**
	 * Draw parameter config
	 * @typedef {Object} DrawConfig
	 * @property {Array.<string>} id The canvas id collection
	 * @property {Point} point A point Object, contains x and y coordinates.
	 */
	 
	/**
	 * Canvas id and Canvas Instance mapping
	 * @private {Object.<string, CanvasInstance>}
	 */
	var instanceMap_ = {};
	
	/**
	 * Auto increment id number, if canvas element id is empty.
	 * @private {number}
	 */
	var idCount_ = 0;
	
	/**
	 * The CanvasManager properties definitions.
	 * @typedef {Object} CanvasMgrProp
	 * @property {Number} width The source canvas width.
	 * @property {Number} height The source canvas height.
	 * @property {Number} lineWidth The source canvas line width.
	 * @property {String} lineCap Sets the style of the end caps for a line. values: butt|round|square.
	 * @property {String} lineColor The line stroke color.
	 * @property {Number} targetZoomScale The area scale to target canvases, using vector way.
	 * @property {String|HTMLImageElement} backgroundImage The image url or html element.
	 */
	var prop_ = {
		width: 500,
		height: 500,
		lineWidth: 9,
		lineCap: 'round',
		lineColor: '#00ccff',
		targetZoomScale: 1
		// backgroundImage
	};
	
	
	/**
	 * Get exist id or auto increment id.
	 * @private
	 * @param {CanvasHTMLElement} el 
	 * @return {string} canvas id
	 */
	var getId_ = function(el){
		return el.id || (el.id = 'kino-cm-' + ++idCount_);
	};
	
	/**
	 * Get exist canvas html element.
	 * @private
	 * @param {string|CanvasHTMLElement} id The id string or html element
	 * @return {CanvasHTMLElement} 
	 */
	var getEl_ = function(id){
		if(typeof id == 'string' && (id = id.trim()) ){
			var el = document.getElementById(id);
			if(el && el.tagName.toLowerCase() == 'canvas'){
				return el;
			}else{
				console.error('The element is NOT a canvas. (id = '+ id +')');
			}
		}else if(Object.prototype.toString.call(id) == '[object HTMLCanvasElement]'){
			return id;
		}else{
			console.error('CM can not handle the null, undefined, empty id string or non-canvas elements.');
		}
	};
	
	/**
	 * Initialize the Canvas Empty Instance
	 * @private
	 */
	function CanvasEmptyInstance(){}
	CanvasEmptyInstance.prototype.point = function(){return this;};
	CanvasEmptyInstance.prototype.line = function(){return this;};
	CanvasEmptyInstance.prototype.clear = function(){return this;};
	//CanvasEmptyInstance.prototype.prop = function(){return this;};
	
	
	/**
	 * Initialize the Canvas Instance
	 * @constructor
	 * @param {String|HTMLCanvasElement} id A id string or the canvas dom element.
	 * @return {CanvasInstance}
	 */
	function CanvasInstance(id){
		this.el_ = getEl_(id);
		this.id_ = getId_(this.el_);
		
		this.rootScale_ = Math.pow(prop_.targetZoomScale, 1/2);
		var w = this.width_ = prop_.width * this.rootScale_ ;
		var h = this.height_ = prop_.height * this.rootScale_ ;

		var sourceMinWidth = Math.min(prop_.width, prop_.height);
		var minWidth = Math.min(
			this.el_.width = Math.round(w),
			this.el_.height = Math.round(h)
		);
		
		var con = this.context_ = this.el_.getContext('2d');
		var back = prop_.backgroundImage;
		if(back){
			if(typeof back == 'string'){
				this.backImg_ = new Image();
				this.backImg_.onload = function(){
					con.drawImage(this, 0, 0, w, h);
				};
				this.backImg_.src = back;
			}else if(Object.prototype.toString.call(back) == '[object HTMLImageElement]'){
				this.backImg_ = back;
				con.drawImage(back, 0, 0, w, h);
			}else{
				console.error('CM can not handle the invalid image url/element.');
			}
		}
		
		this.context_.lineWidth = minWidth / (sourceMinWidth / prop_.lineWidth);
		this.context_.lineCap = prop_.lineCap;
		this.context_.strokeStyle = prop_.lineColor;	
	}
	
	/**
	 * Draw a point on specified canvas.
	 * @param {Point} pt A point Object, contains x and y coordinates.
	 * @param {Function|null} callback
	 * @return {CanvasInstance}
	 */
	CanvasInstance.prototype.point = function(pt, callback){
		var con = this.context_;
		var x = this.rootScale_ * pt.x;
		var y = this.rootScale_ * pt.y;
		con.beginPath();
		con.moveTo(x - 0.1, y - 0.1);
		con.lineTo(x, y);
		con.moveTo(x, y);
		con.stroke();
		if(typeof callback == 'function'){
			callback();
		}
		return this;
	};
	
	/**
	 * Draw a line on specified canvas, from current point to input point.
	 * @param {Point} pt A point Object, contains x and y coordinates.
	 * @param {Function|null} callback
	 * @return {CanvasInstance}
	 */
	CanvasInstance.prototype.line = function(pt, callback){
		var con = this.context_;
		var x = this.rootScale_ * pt.x;
		var y = this.rootScale_ * pt.y;
		con.lineTo(x, y);
		con.moveTo(x, y);
		con.stroke();
		if(typeof callback == 'function'){
			callback();
		}
		return this;
	};
	
	/**
	 * Clear the canvas to blank or background image if its exist.
	 * @return {CanvasInstance}
	 */
	CanvasInstance.prototype.clear = function(){
		if(this.backImg_){
			this.context_.drawImage(this.backImg_, 0, 0, this.width_, this.height_);
		}else{
			this.context_.clearRect(0, 0, this.width_, this.height_);
		}
		return this;
	};
	
	/**
	 * Get
	 * @param {CanvasMgrProp} property A canvas manager property object.
	 * @return {CanvasInstance}
	 */
	//CanvasInstance.prototype.prop = function(property){return this;};
	
	/**
	 * Gets the canvas instance or empty object.
	 * @param {String|HTMLCanvasElement} id A id string or the canvas dom element.
	 * @return {CanvasInstance|CanvasEmptyInstance}
	 */
	function CM(id){
		var el = getEl_(id);
		var cid = getId_(el);
		if(!instanceMap_[cid]){
			return new CanvasEmptyInstance();
		}
		return instanceMap_[cid];
	}
	
	/**
	 * Register and new a canvas instance.
	 * @param {String|HTMLCanvasElement} id A id string or the canvas dom element.
	 */
	CM.reg = function(id){
		var el = getEl_(id);
		var cid = getId_(el);
		if(!instanceMap_[cid]){
			instanceMap_[cid] = new CanvasInstance(el || cid);
		}
	};
	
	/**
	 * Unregister and delete the specified canvas id/element.
	 * @param {String|HTMLCanvasElement} id A id string or the canvas dom element.
	 */
	CM.unreg = function(id){
		var el = getEl_(id);
		var cid = getId_(el);
		if(instanceMap_[cid]){
			instanceMap_[cid] = null;
		}
	}
	
	/**
	 * Gets or sets the common properties of canvas manager
	 * @param {Object|null} property A canvas manager properties.
	 * @param {Object}
	 */
	CM.prop = function(property){
		if(Object.prototype.toString.call(property) == '[object Object]'){
			for(var p in property){
				prop_[p] = property[p];
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
					console.error('CM can not handle the invalid image url/element.');
				}
			}
		}
		return prop_;
	};
	
	// return to input scope
	scope.CM = CM;
})(window);


CM.prop({
	width: 500,
	height: 500,
	lineWidth: 6,
	lineColor: '#a0e0e0',
	targetZoomScale: 0.25,
	backgroundImage: 'assets/block-524.png'
});

// ***** After window ready *****
// register canvas
// CM.reg('multiple');
// unregister canvas
//CM.unreg('multiple');
// CM('multiple').point({ x: x, y: y });
// CM('multiple').line({ x: x, y: y });
// CM('multiple').clear();



