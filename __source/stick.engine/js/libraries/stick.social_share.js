function stick_social_share( ) {
	/////////////////////////////////////////////////////////////////
	//VARAIBLES
	/////////////////////////////////////////////////////////////////
	this.p = this;
	var t=this;
	
	
	/////////////////////////////////////////////////////////////////
	//FUNCTIONS
	/////////////////////////////////////////////////////////////////
	this.shareFBPermissioned = function(imgpath,url) { 
		var t=this;
		FB.login(function(){
  			
			FB.api(
				'/me/feed', 'post', 
				{
					message: '',
					link: base_url + imgpath
				}, function(response) {
					console.log(response);
					 if (response && !response.error) {
						 //alert('success');
					 } else { 
						//alert('fail');
					 }
				});
		}, {scope: 'publish_actions'});
		
	};
	this.shareFB = function(img,url,name,desc,analytics) { 
		var t=this;
		FB.ui({	
			method: 'feed',
			link: url,
			name: name,
			description: desc,
			picture:img
		}, function(response){
			//trace(response);	
		});
	};

}