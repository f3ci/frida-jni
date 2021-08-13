main()

function main(){
	enumlib();
	var pathlib = "/data/app/pathto/packagename/lib/arm64/libname.so"; //change with your target library path
	var namelib = "yourlib.so"; //target library
	var funclib = "yourfunc"; //library function
	//hookretval(pathlib,namelib,funclib);
}

function enumlib(){
	Interceptor.attach(Module.findExportByName(null, "open"), {
		onEnter: function(args){
			var str = args[0].readUtf8String();
			if( str.includes(".so") ){
				var splitted = str.split("/");
				var libName = splitted[splitted.length-1];
				var module = Process.findModuleByName(libName);
				if(module != null){
					console.log("[*] Module Found : "+JSON.stringify(module))
					var exports = module.enumerateExports();
					for(var j = 0; j<exports.length; j++){
						console.log("\t"+JSON.stringify(exports[j]));
					}
				}
			}
		}
	})
}

//this function is template, modify as you need
function hookretval(pathlib,namelib,funclib){
	Interceptor.attach(Module.findExportByName(null, "open"), {
	onEnter: function(args){
		var str = args[0].readUtf8String();
		if( str == pathlib ){
			var module = Process.findModuleByName(namelib);
			if(module != null){
				console.log("[*] Module Found : "+JSON.stringify(module));
				var myExportAddr = Module.findExportByName(namelib, funclib);
				if( myExportAddr != null){
					console.log("[*] Export addr: "+myExportAddr);
					Interceptor.attach(myExportAddr,{
						onEnter: function(args){
							console.log("[*][*] args[0] value: "+JSON.stringify(args[0]));
							//console.log("[*][*] args[0] as UTF-8: "+Memory.readCString(args[0]));
							},
						onLeave: function(retval){
							console.log("\n[*] Called - onLeave [*][*] returned value: "+retval);
							}
						});
					}
				}
			}
		}
	})
}



