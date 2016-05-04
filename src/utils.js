haitao.isObject = function(obj){
	return Object.prototype.toString.call(obj) == '[object Object]';
};
  
haitao.isFunction = function(obj){
	return Object.prototype.toString.call(obj) == '[object Function]';
};

haitao.isArray = function(obj){
	return Object.prototype.toString.call(obj) == '[object Array]';
};

haitao.extend = function(obj){
	if(!haitao.isObject(obj)){
		return false;
	}
	for(var i=1; i<arguments.length; i++){
		var o = arguments[i];
		for(var prop in o){
			obj[prop] = o[prop];
		}
	}  
	return obj;
};