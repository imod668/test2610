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
var db = firebase.firestore();
var ref = db.collection("packages");
let size;

//Read data from cloud firestore
let lastDoc = null;
const lastupdate = async () => {
	// const ref = db.collection("packages")
				// .orderBy('name')
	 		// 	.startAfter(lastDoc )
	 		// 	.limit('5');
	const packagesData = ref.orderBy('name').startAfter(lastDoc).limit('5');
	const data = await packagesData.get();
	let _size = await firebase.firestore().collection("packages").get();
    size = _size.size;
    console.log(size);
	//output docs
	let html = '';
	data.docs.forEach(doc => {
		const item = doc.data();
		
		var urlOpen = 'packages.html#'+ item.name;
		html += `
				<a href="${urlOpen}" target="_blank">
				    <div class="packages-link">
					    <img src="icons/${item.icon}" class="icon">
					    <div class="content">
					    <strong class="title">${item.name}</strong>
					    <span class="subtitle">${item.shortdesc}</span>
					    </div>
				    </div>
			    </a>
				`
	});

	$('#main').fadeIn(300);
	$('#updates').append(html);

	//more lastDoc
	lastDoc = data.docs[data.docs.length - 1];
	//console.log(data.docs.length);
	
}

const moreupdate = () => {
	lastupdate();
}
//load more
$('#loadMore').click(function() {
	moreupdate();
});


$( window ).on("load", function() {
    lastupdate();

});