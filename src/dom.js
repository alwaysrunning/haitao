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