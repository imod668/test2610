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
firebase.analytics();
var fireStore = firebase.firestore();


const loadBTN = document.querySelector("#loadMore");
let currentTitle;
let currentId;
let currentContent;
let oldPostCover;
let lastVisible;
let postsArray = [];
let size;
let postsSize;

const getPackages = async() => {
	let docs;
	let dataPackages = fireStore.collection("packages").orderBy("name").limit(5);
	let _size = await firebase.firestore().collection("packages").get();
    size = _size.size;

	await dataPackages.get().then((Snapshots) => {
        docs = Snapshots;
        lastVisible = Snapshots.docs[Snapshots.docs.length-1];
        //console.log("last", lastVisible);
    });

    docs["docs"].forEach(doc => {
        postsArray.push({"id": doc.id, "data": doc.data()});

    });
    
    if(postsArray.length > 0 ){
       $('#loadMore').show();
    }else{
       $('#loadMore').hide();
    }

    await createChildren(postsArray);
    postsSize = $("#updates > a").length;
}

//start load more
const loadMore = async() => {
	let docs;
	let dataPackages = fireStore.collection("packages").orderBy("name")
	.startAfter(lastVisible).limit(5);

	await dataPackages.get().then((Snapshots) => {
        docs = Snapshots;
        lastVisible = Snapshots.docs[Snapshots.docs.length-1];
        
    });

    docs["docs"].forEach((item, i) => {
    	let html = '';
		let urlOpen = 'packages.html#'+ item.data().name;
			html += `
				<a href="${urlOpen}" target="_blank">
				    <div class="packages-link">
					    <img src="icons/${item.data().icon}" class="icon">
					    <div class="content">
					    <strong class="title">${item.data().name}</strong>
					    <span class="subtitle">${item.data().shortdesc}</span>
					    </div>
				    </div>
			    </a>`;
		$('#updates').append(html);
    	postsSize ++;
    });

    if(postsSize >= size){
        $('#loadMore').hide();
    }
}

if(loadBTN != null){
    loadBTN.addEventListener("click", () => {
        loadMore();
    });
}

//update limit
const createChildren = async(arr) => {
	if(updates != null){
		arr.map( item => {
		//console.log(item);
			let html = '';
			let urlOpen = 'packages.html#'+ item.data.name;
			html += `
				<a href="${urlOpen}" class="links" target="_blank">
				    <div class="packages-link">
					    <img src="icons/${item.data.icon}" class="icon">
					    <div class="content">
					    <strong class="title">${item.data.name}</strong>
					    <span class="subtitle">${item.data.shortdesc}</span>
					    </div>
				    </div>
			    </a>`;
			$('#updates').append(html);
		});
	}
}

//section

const loadSection = async() => {
	let docs;
	let dataPackages = fireStore.collection("packages");
    let packagesSection = [];
	await dataPackages.get().then((Snapshots) => {
        docs = Snapshots;
    });
    
    //docs["docs"].forEach(doc => {
        //packagesSection.push({"id": doc.id, "data": doc.data()});
     //    const product = doc.data()
    	// product.id = doc.id
        //packagesSection.push(doc.data().section);
       //var abc = JSON.stringify(packagesSection);

    // })
    
    await detailSection(docs);
     // console.log(packagesSection);
}

const detailSection = async(docs) => {
	let html = "";
	docs.forEach(doc => {
		var id = doc.id;
		var item = doc.data();

		html += `<a onclick='detailSection' href='#open'>
		<div class='packages-link'>
		<img src='icons_section/${item.section}.png' class='icon'/>
		<div class='content'>
		<strong class='title'>${item.section}</strong>
		<span class='subtitle'>14</span>
		</div></div></a>`;
		
	})

	$('#section').append(html);
        
}

//window load
document.addEventListener("DOMContentLoaded", (e) => {
    getPackages();
    $('#main').fadeIn(500);
    loadSection();


});