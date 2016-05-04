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