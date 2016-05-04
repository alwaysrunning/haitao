(function(root, undefined) {
  "use strict";


var haitao = function() {
};


haitao.VERSION = '0.0.1';

// Export to the root, which is probably `window`.
root.haitao = haitao;




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

haitao.findDom = function(selector,context){
	var sel = selector.replace(/\s/g,"");
	var type = sel[0];
	var eles = sel.slice(1);
	var ctn = context === undefined ? root.document : context;
	var dom, arr =[];
	switch (type){
		case "#":
		dom = ctn.getElementById(eles);
		break;
		case "=":
		dom = ctn.getElementsByTagName(eles);
		break;
		case "@":
		dom = ctn.getElementsByName(eles);
		break;
		case ".":
		var doms = ctn.getElementsByTagName("*");
		for(var i=0; i<doms.length; i++){
			if(doms[i].className == eles){
				arr.push(doms[i]);
			}
		}
		break;
	}
	return dom || arr;
};	

haitao.get = function(url,data,callback){
    haitao.send(url,'GET',callback,data);
};

haitao.load = function(url,data,callback){
    haitao.send(url,'GET',callback,data);
};

haitao.send = function(url,method,callback,datas){
    var data = datas || null, request;
    if(root.XMLHttpRequest){
        request = new root.XMLHttpRequest();
    }else{
        request = new root.ActiveXObject("Microsoft.XMLHTTP");
    } 
    if(haitao.isObject(data)){
        data = haitao.formatParams(data);
    }
    if(method=='GET'){
        request.open(method, url+'?'+data,true);
        request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        request.send(null);
    }else if(method=='POST'){
        request.open(method,url,true);
        request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        request.send(data);
    }       
    if(haitao.isFunction(callback)){
        request.onreadystatechange = function(){
            if(request.readyState===4 && (request.status === 200 || request.status ===0)){
                callback(request.responseText);
            }
        };
    }
};
haitao.formatParams = function(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".",""));
    return arr.join("&");
};


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



var listener = {
  init: function (fn) {
    if (!Router.listeners) {
      Router.listeners = [];
    }
    function onchange(onChangeEvent) {
      for (var i = 0, l = Router.listeners.length; i < l; i++) {
        Router.listeners[i](onChangeEvent);
      }
    }   
    if('onhashchange' in root){
         root.onhashchange = onchange;    
    }
    Router.listeners.push(fn);
  }
};

var Router = function (routes) {
  this.routes   = {};
  this.mount(routes || {});
};

Router.prototype.init = function () {
  var self = this;
  this.handler = function(onChangeEvent) {
    var newURL = onChangeEvent && onChangeEvent.newURL || root.location.hash;
    var url = newURL.replace(/.*#/, '');
    self.dispatch('on', url.charAt(0) === '/' ? url : '/' + url);
  };

  listener.init(this.handler);

  return this;
};


function _every(arr, iterator) {
  for (var i = 0; i < arr.length; i += 1) {
    if (iterator(arr[i], i, arr) === false) {
      return;
    }
  }
}

function regifyString(str) {
  var last = 0, out = "";
  str = out += str.substr(last);
  var captures = str.match(/:([^\/]+)/ig);
  if (captures) {
    return "([._a-zA-Z0-9-%()]+)";
  }
}

Router.prototype.dispatch = function(method, path) {
  var self = this, fns = this.traverse(method, path.replace(/\?.*/, ""), this.routes, "");
  self.invoke(fns, self);
  return true;
};

Router.prototype.invoke = function(fns, thisArg) {
  var apply;
  apply = function(fn) {
    if (Array.isArray(fn)) {
      return _every(fn, apply);
    } else if (typeof fn === "function") {
      return fn.apply(thisArg, fns.captures || []);
    } 
  };
  _every(fns, apply);

};

Router.prototype.traverse = function(method, path, routes, regexp) {
  var fns = [], current, exact, match, next;
  for (var r in routes) {
    if (routes.hasOwnProperty(r)) {
      current = exact = regexp + "/" + r;
      match = path.match(new RegExp("^" + exact));
      if (!match) {
        continue;
      }

      if (match[0] && match[0] == path && routes[r][method]) {
        next = [ routes[r][method] ];
        next.matched = true;
        next.captures = match.slice(1);
        return next;
      }
      next = this.traverse(method, path, routes[r], current);
      if (next.matched) {
        if (next.length > 0) {
          fns = fns.concat(next);
        }
        fns.matched = true;
        fns.captures = next.captures;
        return fns;
      }
    }
  }
  return false;
};

Router.prototype.insert = function(method, path, route, parent) {
  var parentType, nested, part;
  parent = parent || this.routes;
  part = path.shift();
  if (/\:|\*/.test(part) && !/\\d|\\w/.test(part)) {
    part = regifyString(part); 
  }
  if (path.length > 0) {
    parent[part] = parent[part] || {};
    return this.insert(method, path, route, parent[part]);
  }
  parentType = typeof parent[part];
  if (parentType == "undefined") {
    nested = {};
    nested[method] = route;
    parent[part] = nested;
    return;
  }
};


Router.prototype.mount = function(routes, path) {
  if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
    return;
  }
  var self = this, rename;
  path = path || [];
  if (!Array.isArray(path)) {
    path = path.split("/");
  }
  function insertOrMount(route) {
    var parts = route.split("/"), 
    isRoute = parts[0] === "" || false, 
    event = isRoute ? "on" : rename;
    if (isRoute) {
      parts.shift();
    }
    self.insert(event, parts, routes[route]);
  }
  for (var route in routes) {
    if (routes.hasOwnProperty(route)) {
      insertOrMount(route);
    }
  }
};

haitao.prototype.router = function(routes){
  return new Router(routes);
};


var _ = {};

var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r', // 回车符
    '\n':     'n', // 换行符
    '\t':     't', //制表符匹配
    '\u2028': 'u2028', // 行分隔符
    '\u2029': 'u2029'  // 段落分隔符
};

_.defaults = function(obj){
    var arrs = Array.prototype.slice.call(arguments,1);
    arrs.forEach(function(arr){
        for ( var prop in arr){
            if(arr.hasOwnProperty(prop)){
                obj[prop] = arr[prop];
            }
        }
    });
    return obj;
};  

_.templateSettings = {
    evaluate: /<%([\S\s]+?)%>/g,
    interpolate: /<%=([\S\s]+?)%>/g,
    escape: /<%-([\S\s]+?)%>/g
};

_.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
};

_.template = function(text, data) {

    var settings = _.defaults({}, _.templateSettings);
    var matcher = new RegExp([settings.escape.source,settings.interpolate.source,settings.evaluate.source].join("|") + '|$',"g");
    var index = 0;
    var source = "__p+='";
    var render;

    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {  
      source += text.slice(index, offset).replace(escaper, function(match) { return '\\' + escapes[match]; });
   
      if (escape) {
        source += "'+\n_.escape(" + escape + ")+\n'";
      }
      if (interpolate) {
        source += "'+\n(obj."+ interpolate +")+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      index = offset + match.length;

    });
    source += "';\n";

    source = "var __p='';\n" + source + "return __p;\n";

    render = new Function('obj', source);
  
    if (data){
      return render(data);
    } 
    var template = function(data) {
      return render.call(this, data, _);
    };

    return template;
  };

haitao.prototype = haitao.extend(haitao.prototype,_);

}(this));

