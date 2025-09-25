const fs = require("fs");
const path = require("path");

const os = require("os");

let page = "";

process.chdir(__dirname);

// Set variable for diary entry directory and create the folder if it doesn't exist
const entryDirectory = path.join(os.homedir(), "Documents", "DailyLog");
if (!fs.existsSync(entryDirectory)) fs.mkdir(entryDirectory, null, () => { });

showHome();




function showHome() {
	page = "home";
	document.getElementById("nav-button-new").classList.remove("active");

	document.getElementById("nav-button-home").classList.add("active");

	// Loop through all subdirectories of main entry directory to build an array of entries
	let entries = [];
	for (const year of fs.readdirSync(entryDirectory)) {
		for (const month of fs.readdirSync(path.join(entryDirectory, year).replace(/\\/g, "\\\\"))) {
			for (const day of fs.readdirSync(path.join(entryDirectory, year, month).replace(/\\/g, "\\\\"))) {
				for (const entry of fs.readdirSync(path.join(entryDirectory, year, month, day).replace(/\\/g, "\\\\"))) {
					entries.push(JSON.parse(fs.readFileSync(path.join(entryDirectory, year, month, day, entry).replace(/\\/g, "\\\\"))));
				};
			};
		};
	};

	console.log(entries);
	

	let mainHtml = `
		<div class="container">
			<div class="row">
				<div class="col-md-4">
	`;

	mainHtml += `<h1>Test</h1>`;


	mainHtml += `
				</div>
			</div>
		</div>
	`;

	document.getElementById("main").innerHTML = mainHtml;

};



function showNew() {
	page = "new";
	document.getElementById("nav-button-home").classList.remove("active");
	
	document.getElementById("nav-button-new").classList.add("active");

	document.getElementById("main").innerHTML = "";
};