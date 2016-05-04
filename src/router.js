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
