var firebaseConfig = {
	apiKey: "AIzaSyBu1SMDnS_M5R7RX0gQn-qCLPejMGdk_K4",
	authDomain: "test2610-89c37.firebaseapp.com",
	databaseURL: "https://test2610-89c37.firebaseio.com",
	projectId: "test2610-89c37",
	storageBucket: "test2610-89c37.appspot.com",
	messagingSenderId: "1040523299684",
	appId: "1:1040523299684:web:a1066d17b734b3a1174871",
	measurementId: "G-SWBE971KYK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
var database = firebase.database().ref('packages');
function getdata(){
	database.once("value").then(function(snapshot) {
	snap = snapshot.val();
	loadSection(snap);
	latsUpdate(snap);
	});
}
//load Section
var packagesSection = {};
function loadSection(snap){	
	//push section to array
	for (var key_section in snap) {
			var danhmuc = snap[key_section].section;
			if(danhmuc==null) {
				danhmuc = "Unknown";
			}
			if(packagesSection[danhmuc] == null) {
				packagesSection[danhmuc] = [];
			}
		packagesSection[danhmuc].push(snap[key_section]);
	};
	//loop section
	let totalPKGS = Object.keys(snap).length;
	let html_data = "";
	for (var pk_section in packagesSection) {
		var total_section = packagesSection[pk_section].length;
		html_data += "<a onclick='detailSection(\""+pk_section+"\")' type='button'>"+
					 "<div class='packages-link'>"+
					 "<img src='icons_section/"+encodeURI(pk_section)+".png' onerror=\"this.src='icons_section/Unknown.png'\" class='icon' alt='icon'/>"+
					 "<div class='content'>"+
					 "<strong class='title'>"+pk_section+"</strong>"+
					 "<span class='subtitle'>Total: "+total_section+"</span>"+
					 "</div></div></a>";
	}
	$("#section").html(html_data);
	$(".section").html("All_Packages: " + totalPKGS);
}
//load detailSection
function detailSection(sectionName) {
	let html_data = "";
	for (var index in packagesSection[sectionName] ) {
		let item = packagesSection[sectionName][index];
		//let urlOpen = 'packages.html#' + item.name;
		let urlOpen = 'packages.html?id=' + item.name;
		html_data += '<a href="'+urlOpen+'" target="_blank">'+
					 '<div class="packages-link">'+
					 '<img src="icons/'+item.icon+'" class="icon" alt="icon"/>'+
					 '<div class="content">'+
					 '<strong class="title">'+item.name+'</strong>'+
					 '<span class="subtitle">'+item.shortdesc+'</span>'+
					 '</div></div></a>';
	}	
	$('#modal').removeClass('hidden');
	$('#section_category').html(html_data);
	$('.title_section').html(sectionName);
	$(document.body).css('overflow-y', 'hidden');
	$('#root').addClass('hide');
}
function closeBack(){
	$(document.body).css('overflow-y', 'visible');
	$('#root').removeClass('hide');
	$('#modal').addClass('hidden');
	$('#section_category').html("");
}
//window load
$( window ).on("load", function() {
	getdata();
	addRepo();
	scrollImgs();
	footer();
});

//lastUpdate------------
let snapArray = [];
function latsUpdate(snap){
	for (var item in snap) {
		snapArray.push(snap[item]);
	};
	snapArray.sort((function (a, b) { return new Date(b.update) - new Date(a.update) }));//sort lastupdate
	
	let PerPage = 5;
	let curr = 1;
	let page_count = Math.ceil(snapArray.length / PerPage);
	let html_update = '';
	$.each(snapArray.slice(0,PerPage), function (k, v) {
			//var urlOpen = 'packages.html#'+ v.name;
			var urlOpen = 'packages.html?id='+ v.name;
			html_update += '<a href="'+urlOpen+'" target="_blank"><div class="packages-link">'+
				           '<img src="icons/'+v.icon+'" class="icon" alt="icon"><div class="content">'+
				           '<strong class="title">'+v.name+'</strong>'+
						   '<span class="subtitle">'+v.shortdesc+'</span>'+
				           '</div></div></a>';
		});
		$('#updates').append(html_update);
		$("#prev").prop("disabled", true);
		$('#pages').html(curr + ' of ' + page_count +' pages');
		 
	function changeData(index) {
		let showData = snapArray.slice((index-1)*PerPage,index*PerPage);
		$('#updates').html("");
		let html_update = '';
		$.each(showData, function (k, v){
				//var urlOpen = 'packages.html#'+ v.name;
				var urlOpen = 'packages.html?id='+ v.name;
				html_update += '<a href="'+urlOpen+'" target="_blank"><div class="packages-link">'+
							   '<img src="icons/'+v.icon+'" class="icon" alt="icon"><div class="content">'+
							   '<strong class="title">'+v.name+'</strong>'+
							   '<span class="subtitle">'+v.shortdesc+'</span>'+
							   '</div></div></a>';
		})
		$('#updates').html(html_update);
		curr = index;
		
		if(curr == page_count){
			$("#next").prop("disabled", true);
		}else{
			$("#next").prop("disabled", false);
		};
		if(curr == 1){
			$("#prev").prop("disabled", true);
		}else{
			$("#prev").prop("disabled", false);
		};
	};
	
	$("#next").on("click", function (){
		changeData(curr+1);
		$('#pages').html(curr + ' of ' + page_count +' pages');
	});
	
	$("#prev").on("click", function (){
		changeData(curr-1);
		$('#pages').html(curr + ' of ' + page_count +' pages');
	});

};
//end lastupdate

//------------description-----------
function description(snap){
	//var urlhash = window.location.hash.split('#');// use hash split #
	//var url_id = decodeURIComponent(urlhash[1]); // use hash split #
	var url_id = window.location.href.split('packages.html?id=')[1];
	//console.log(urlhash);
	//console.log(url_id);
	database.once("value")
	.then(function(snapshot) {
		const snap = snapshot.val();
		const obj = snap[url_id];

		if(obj != null) {
			$('#mota').fadeIn(100);
			$("#error").remove();
			$(document).attr("title", url_id);
			$("#get").attr("href", "cydia://package/" + obj.identifier);
			$('.icon-container').html("<img src='icons_section/"+obj.section+".png' onerror=\"this.src='icons_section/Unknown.png'\" alt='icon'>");
			$('#Name').html(obj.name);
			if(obj.section != null){
				$('#Section').html(obj.section);
			}else{
				$('#Section').html("Unknown");
			}
			$('#yourVersion').html(iOSVersion);
			$('#Compatible').html(obj.compatible);
			$('#Version').html(obj.version);
			$('#Description').html(obj.longdesc);
			$('#Update').html(formatDate());
			$('#changelog').html(obj.changelog);
			$('#video_id').html(obj.video);
			
			var screenshot = "";
			for (let i = 0; i < obj.screenshots; i++) {
				screenshot += '<a href="screenshots/'+obj.name+'/'+i+'.jpg" >'+
							  '<img src="screenshots/'+obj.name+'/'+i+'.jpg" class="imgs" alt="icon">'+
							  '</a>';
			};
			$('#screenshots_id').html(screenshot);
			//lightbox use baguetteBox.js
			baguetteBox.run('#screenshots_id', {
				animation: 'slideIn',
				buttons: true,
				noScrollbars: false,
				overlayBackgroundColor: 'rgba(0,0,0,0.6)'
			});
		}
		else{
			$(document.body).html('<h1 id="error" class="error">Not Found _ '+url_id+'<br/><br/><a id="backHome" href="#">Back Home</a></h1>');
			$("#backHome").on('click',function(){
				window.location = "index.html";
			});
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
	
}

//add repo 
function addRepo(){
	const urlRepo = {
	Cydia: "cydia://url/https://cydia.saurik.com/api/share#?source=https://resourceios.github.io/",
	Sileo: "sileo://source/https://resourceios.github.io/",
	Zebra: "zbra://sources/add/https://resourceios.github.io/",
	Installer: "installer://add/repo=https://resourceios.github.io/"
	};
	for(var i in urlRepo){
		$('#repoUrl').append('<a class="repo" href="'+urlRepo[i]+'"><img src="assets/'+i+'.png"><span>'+i+'</span></a>');
	};
};
//scrollIMG
function scrollImgs(){
	firebase.database().ref('imgs-db')
		.once("value")
		.then(function(snapshot) {
			const snap = snapshot.val();
			for (var arr in snap) {
				let item = snap[arr];
				if(item.active == true){
					//$('#ul-imgs').append('<li><a href="'+item.link+'" target="_blank"><div class="foto"><img src="'+item.image+'" alt="img"></div><div><p>'+item.mota+'</p></div></a></li>');
					//use template literals
					$('#ul-imgs').append(`
					  <li>
						<a href="${item.link}" target="_blank">
						  <div class="foto">
							<img src="${item.image}" alt="img">
						  </div>
						  <div>
							<p>${item.mota}</p>
						  </div>
						</a>
					  </li>
					`);
				}
			}
	});
}
//footer
function footer(){
	var footer_html = '<div class="footer_social">'+
			'<a href="https://twitter.com/th6688" target="_blank">Twitter</a>'+
			'<a href="https://facebook.com/" target="_blank">Facebook</a>'+
			'<a id="about" type="button">About</a>'+
			'</div>'+
			'<p class="footer_text">Copyright Mrthuan &copy; '+new Date().getFullYear()+'</p>';
	$('.footer').html(footer_html);
	$('#about').click(function(){
		alert("hihi");
	})
}
//check ios version
function iOSVersion() {
	var match = (navigator.appVersion).split('OS ');
	if (match.length > 1) {
		const os = match[1].split(' ')[0].split('_').join('.');
		return os;
	}
	return 'Unknown';
}