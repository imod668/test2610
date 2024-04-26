//load data-------------
var url = "https://test2610-89c37.firebaseio.com/packages.json";
function loadData(){
	//var url = "data.json";
	$.ajax({
		type: 'GET',
		url: url,
		cache: false,
		crossDomain: true,
		dataType: 'json',
		success: function(data) {
			rt_json = data;
			
			for (var key_section in rt_json) {
				var danhmuc = rt_json[key_section].section;
				
					if(danhmuc==null) {
						danhmuc = "Unknown";
					}
					if(packagesSection[danhmuc] == null) {
						packagesSection[danhmuc] = [];
					}
				packagesSection[danhmuc].push(rt_json[key_section]);
			};
			
			loadSection();
			$('#main').fadeIn(300);
		},
		error: function() {
			$('#main').remove();
			$('body').html("<h4 class='error'>Error loading Data, or not connect internet!</h4>");
		},
	});
}
loadData();
//load Section
var packagesSection = {};
function loadSection(){	
	var sectionContent = "";
	for (var pk_section in packagesSection) {
		var total_section = packagesSection[pk_section].length;
		sectionContent += "<a onclick='detailSection(\""+pk_section+"\")' href='#open'>";
		sectionContent += "<div class='packages-link'>";
		sectionContent += "<img src='icons_section/"+ pk_section +".png' class='icon'/>";
		sectionContent += "<div class='content'>";
		sectionContent += "<strong class='title'>"+ pk_section +"</strong>";
		sectionContent += "<span class='subtitle'>Total: "+ total_section + "</span>";
		sectionContent += "</div></div></a>";
	}
	$('#section').html(sectionContent);
	$('.section').html('All sections:');
}

//load packages Section
function detailSection(sectionName){
	var html_data = "";
	for ( var index in packagesSection[sectionName] ) {
	var item = packagesSection[sectionName][index];
	var urlOpen = 'packages.html#' + item.name;
		html_data += '<a href="'+urlOpen+'" target="_blank"><div class="packages-link"><img src="icons/'+item.icon+'" class="icon"/><div class="content"><strong class="title">'+item.name+'</strong><span class="subtitle">'+item.shortdesc+'</span></div></div></a>';
	}
	// html_data += "<small class='btn back-btn'><a onclick='closeBack()' href='#back'>< Back</a></small>";
		
	$('.title_section').append(sectionName);
	$(document.body).css('overflow', 'hidden');
	$('#detailsection').removeClass('hidden');
	$('#section_category').append(html_data);
	$('.navbar-sub').attr('hidden', false);
	//hide();
}
function closeBack(){
	$('#section_category').empty();
	$('.title_section').empty();
	$('#detailsection').addClass('hidden');
	$(document.body).css('overflow', 'visible');
	
	$('.nav-scroll').attr('hidden', false);
	$('#scrollIMG').attr('hidden', false);
	$('#main').attr('hidden', false);
	$('.footer').attr('hidden', false);
	$('.navbar-sub').attr('hidden', true);
}
function hide(){
	$('.nav-scroll').attr('hidden', true);
	$('#scrollIMG').attr('hidden', true);
	$('#main').attr('hidden', true);
	$('.footer').attr('hidden', true);
	
}
//last Update
var currentPage = 1;
function lastUpdate(){
	$.getJSON(url, function(data) {
		var rt_json = data;
		var arrData = [];
		for (var arr in rt_json) {
			arrData.push(rt_json[arr]);
		};
		//console.log(rt_json);
		var itemPage = 5;
		var countItem = arrData.length;
		if(currentPage * itemPage > countItem){
			$('#loadMore').hide();
		}
		$.each(arrData, function (k, v) {
			//console.log(k);
			if(k >= (currentPage -1) * itemPage && k < currentPage * itemPage) {
				loadmoreUpdate(v.icon, v.name, v.shortdesc);
			}
			
		});
	});
}
lastUpdate();

function loadmoreUpdate(icon, name, shortdesc) {
	var urlOpen = 'packages.html#'+ name;
	var update = '<a href="'+urlOpen+'" target="_blank"><div class="packages-link"><img src="icons/'+icon+'" class="icon"><div class="content"><strong class="title">'+name+'</strong><span class="subtitle">'+shortdesc+'</span></div></div></a>';
	$('#updates').append(update);
}

$(function() {
	$('#loadMore').click(function() {
		currentPage++;
		lastUpdate();
	});
});

//link menu click active
// $(".menu a").click(function() {
	// if ($(".menu a").removeClass("selected")) {
		// $(this).removeClass("selected");
	// }
	// $(this).addClass("selected");
// });
