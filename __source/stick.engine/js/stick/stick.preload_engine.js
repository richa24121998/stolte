$(document).ready(function() {
	var stick_preload_engine = {
				
		init:function () { 
			var self = this;
			$(document).on( "stick-tell-preload-engine-begin", self.preloadBeforeBegin);
		},//init
		
		preloadBeforeBegin:function() { 
			trace('engine preloadBeforeBegin');
			
			//http://www.createjs.com/docs/preloadjs/modules/PreloadJS.html
			//stick_preload_engine.queue.installPlugin(createjs.Sound);
			
			stick_preload_engine.before_queue.on("complete", stick_preload_engine.preloadBegin);
			stick_preload_engine.before_queue.setMaxConnections(10);
			
			var preload_arr = Array();
			preload_arr.pushArray(stick_config.global_preloadassets_before_start); //global assets
			trace(preload_arr);
			if (preload_arr.length>0) { 
				stick_preload_engine.before_queue.loadManifest(preload_arr, true, stick_config.subfolder);
			} else { 
				stick_preload_engine.preloadBegin();
			}
			
			
		},
		
		preloadBegin:function() { 
			trace('engine preloadBegin');
			
			$.event.trigger({
				type: "stick-preload-begin",
				param1: ""
			});
			
			// http://www.createjs.com/docs/preloadjs/modules/PreloadJS.html
			//stick_preload_engine.queue.installPlugin(createjs.Sound);
			
			stick_preload_engine.queue.on("complete", stick_preload_engine.preloadComplete);
			stick_preload_engine.queue.on("progress", stick_preload_engine.preloadProgress);
			stick_preload_engine.queue.on("error", stick_preload_engine.preloadError);
			stick_preload_engine.queue.setMaxConnections(10);
			
			var preload_arr = Array();
			
			preload_arr.pushArray(stick_config.global_preloadassets_all); //global assets
			preload_arr.pushArray(page_obj.preloadassets_all); //per page
			
			var site_mode = scGetSiteMode();
			if (site_mode==="large") { 
				preload_arr.pushArray(stick_config.global_preloadassets_large); //global assets
				preload_arr.pushArray(page_obj.preloadassets_large); //per page
			} else { 
				preload_arr.pushArray(stick_config.global_preloadassets_tiny); //global assets
				preload_arr.pushArray(page_obj.preloadassets_tiny); //per page
			}
			trace(preload_arr);
			stick_preload_engine.queue.loadManifest(preload_arr, true, stick_config.subfolder);
			
			
		},
		
		preloadProgress:function(e) { 
			//trace('engine preloadProgress');
			//trace(e);
			$.event.trigger({
				type: "stick-preload-progress",
				pct: stick_preload_engine.queue.progress
			});
		},
		
		preloadComplete:function(e) { 
			//trace('engine preloadComplete');
			//trace(e);
			$.event.trigger({
				type: "stick-preload-complete",
				param1: ""
			});
		},
		
		preloadError:function(e) { 
			trace('engine preloadError');
			trace(e);
			$.event.trigger({
				type: "stick-preload-error",
				e: e
			});
		}	
				
				
	}//obj
	stick_preload_engine.before_queue = new createjs.LoadQueue();
	stick_preload_engine.queue = new createjs.LoadQueue();
	stick_preload_engine.init();
	
});
