$(document).ready(function(){
	var urlhash = window.location.hash.split('#');
	var url_id = decodeURIComponent(urlhash[1]); //remove %20 to space
	//var getID = url_id.replace(/\s+/g, ''); // remove space
	
	$.getJSON( 'https://test2610-89c37.firebaseio.com/packages.json', function(data) {
		var obj = data[url_id];
		if(obj != null){
			$('#mota').fadeIn(300);
			$(document).attr("title", url_id);
			$('#error').remove();
			$('#Name').html(obj.name);
			$('#yourVersion').html(iOSVersion);
			$('#Version').html(obj.version);
			$('#Compatible').html(obj.compatible);
			$('#Update').html(formatDate);
			$('#Description').html(obj.longdesc);
			$('#changelog').html(obj.changelog);
			
			var screenshot = '';
			for (let i = 0; i < obj.screenshots; i++) {
				screenshot += '<a href="screenshots/'+obj.name+'/'+i+'.jpg"" target="_blank"><img src="screenshots/'+obj.name+'/'+i+'.jpg" class="imgs"></a>';
				$('#screenshots_id').html(screenshot);
			}
			
		}
		else{
			$('#error').html('No description ' + url_id);
			$('#error').append('<br/><br/><a href="index.html">Back Home</a>');
		}
			//format timestamp
			function formatDate(){
				var timestamp = obj.update;
				var newDate = new Date(timestamp);
				let y = newDate.getFullYear();
				let m = newDate.getMonth() + 1;
				let d = newDate.getDate();
				if(d <10){
					d = '0' + d;
				}
				if(m < 10){
					m = '0' + m;
				}
				const updates = d + '/' + m + '/' + y;
				return updates;
			}
	});
	
	//check ios version
	function iOSVersion() {
		var match = (navigator.appVersion).split('OS ');
		if (match.length > 1) {
			return match[1].split(' ')[0].split('_').join('.');
		}
		return false;
	}
	
});
