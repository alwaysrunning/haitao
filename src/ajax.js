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
