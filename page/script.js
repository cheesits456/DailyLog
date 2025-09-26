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
	// Entries array is built in alphabetical order so oldest entries will be first, reverse array so newest comes first
	entries.reverse();


	let mainHtml = `
	<div class="container">
	<div class="row">
	`;

	for (const entry of entries) {
		let substring = `${entry.content}`.replace(/<br>/g, " ").substring(0, 114);
		mainHtml += `
			<div class="col-md-4">
				<div class="card margin-top hover-pointer">
					<div class="card-header">
						<h5>${entry.title}</h5>
					</div>
					<div class="card-body">${substring}${entry.content.length > 114 ? " . . ." : ""}</div>
					<div class="card-footer text-body-secondary">${entry.date}</div>
				</div>
			</div>
		`
	};

	mainHtml += `
			</div>
		</div>
	`;

	document.getElementById("main").innerHTML = mainHtml;

};



function showNew() {
	page = "new";
	document.getElementById("nav-button-home").classList.remove("active");

	document.getElementById("nav-button-new").classList.add("active");

	document.getElementById("main").innerHTML = `
		<div class="container margin-top">
			<div class="row">
				<div class="col-md-10">
					<form>
						<input id="entry-title" class="form-control" type="text" placeholder="Title">
					</form>
				</div>
				<div class="col-md-2">
					<div class="button text-center">Save</div>
				</div>
			</div>
			<form action="#0">
				<div class="grow-wrap">
					<textarea id="entry-content" class="form-control margin-top" placeholder="Start typing here..."
						onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
				</div>
			</form>
		</div>
	`;
};