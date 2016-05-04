var event = {
	_listeners : {},

	addEvent: function(type,fn){
		if(typeof this._listeners[type] === "undefined"){
			this._listeners[type] = [];
		}
		if(haitao.isFunction(fn)){
			this._listeners[type].push(fn);
		}
		return this;
	},

	fireEvent: function(type){
		var arr = this._listeners[type];
		if(!haitao.isArray(arr)){
			return this;
		}
		for(var i=0; i<arr.length; i++){
			arr[i].apply({},Array.prototype.slice.call(arguments,1));
		}
		return this;
	},

	removeEvent: function(type, fn){
		if(!fn){
			delete this._listeners[type];
			return this;
		}
		var arr = this._listeners[type];
		for(var i=0; i<arr.length; i++){
			if(arr[i]==fn){
				arr.splice(i,1);
			}
		}
		return this;
	}
};

haitao.prototype = haitao.extend(haitao.prototype,event);

