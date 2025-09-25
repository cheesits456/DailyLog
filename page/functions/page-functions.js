function showHome() {
	page = "home";
	document.getElementById("nav-button-new").classList.remove("active");

	document.getElementById("nav-button-home").classList.add("active");
};



function showNew() {
	page = "new";
	document.getElementById("nav-button-home").classList.remove("active");
	
	document.getElementById("nav-button-new").classList.add("active");
};