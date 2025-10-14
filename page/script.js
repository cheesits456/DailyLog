const fs = require("fs");
const path = require("path");

const os = require("os");

let page = "";

process.chdir(__dirname);

// Set variable for diary entry directory and create the folder if it doesn't exist
const entryDirectory = path.join(os.homedir(), "Documents", "DailyLog");
if (!fs.existsSync(entryDirectory)) fs.mkdir(entryDirectory, null, () => { });

showHome();



function createNew() {
	const ids = [
		"entry-title",
		"entry-content"
	];

	let skip = false;
	for (const id of ids) {
		let element = document.getElementById(id);
		if (!element.value) {
			element.classList.add("input-red");
			skip = true;
		} else {
			element.classList.remove("input-red");
		};
	};
	if (skip) return;

	const date = document.getElementById("entry-date").value;
	const time = document.getElementById("entry-time").value;
	const entryDate = date ? new Date(`${date} ${time}`) : new Date();

	// Build date variables
	const year = `${entryDate.getFullYear()}`;

	const monthNumber = `${entryDate.getMonth() + 1}`;
	let month = monthNumber;
	if (monthNumber.length === 1) month = `0${monthNumber}`;
	let monthString;
	switch (month) {
		case "01": monthString = "Jan"; break;
		case "02": monthString = "Feb"; break;
		case "03": monthString = "Mar"; break;
		case "04": monthString = "Apr"; break;
		case "05": monthString = "May"; break;
		case "06": monthString = "Jun"; break;
		case "07": monthString = "Jul"; break;
		case "08": monthString = "Aug"; break;
		case "09": monthString = "Sep"; break;
		case "10": monthString = "Oct"; break;
		case "11": monthString = "Nov"; break;
		case "12": monthString = "Dec"; break;
	};

	const dayNumber = `${entryDate.getDate()}`;
	let day = dayNumber;
	if (dayNumber.length === 1) day = `0${dayNumber}`;

	const hourNumber = `${entryDate.getHours()}`;
	let hour = hourNumber;
	if (hourNumber.length === 1) hour = `0${hourNumber}`;

	const minuteNumber = `${entryDate.getMinutes()}`;
	let minute = minuteNumber;
	if (minuteNumber.length === 1) minute = `0${minuteNumber}`;

	const secondNumber = `${entryDate.getSeconds()}`;
	let second = secondNumber;
	if (secondNumber.length === 1) second = `0${secondNumber}`;

	// Build entry data object
	const data = {
		date: `${monthString} ${dayNumber}, ${year} at ${hour}:${minute}:${second}`,
		title: document.getElementById("entry-title").value.trim(),
		content: document.getElementById("entry-content").value.trim().replace(/\n/g, "<br>")
	};

	// Set filepath variables and save file
	const filePath = path.join(entryDirectory, year, month, day);
	const fileName = `${hour}:${minute}:${second}.entry`;

	fs.mkdirSync(filePath, { recursive: true });
	fs.writeFileSync(path.join(filePath, fileName), JSON.stringify(data, null, "\t"));

	// Show "saved" dialog and go back to main screen
	$("#saved-modal").modal("toggle");
	showHome();
};



function editEntry(entryPath) {
	const splitPath = entryPath.split("/");

	const year = splitPath[0];
	const month = splitPath[1];
	const day = splitPath[2];
	const entry = splitPath[3];
	const entryData = JSON.parse(fs.readFileSync(path.join(entryDirectory, year, month, day, entry)));

	showNew(entryData);
};



function showAll() {
	page = "all";
	document.getElementById("nav-button-home").classList.remove("active");
	document.getElementById("nav-button-new").classList.remove("active");

	document.getElementById("nav-button-all").classList.add("active");
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant",
	});

	let mainHtml = "";

	for (const year of fs.readdirSync(entryDirectory)) {
		for (const month of fs.readdirSync(path.join(entryDirectory, year).replace(/\\/g, "\\\\"))) {
			for (const day of fs.readdirSync(path.join(entryDirectory, year, month).replace(/\\/g, "\\\\"))) {
				for (const entry of fs.readdirSync(path.join(entryDirectory, year, month, day).replace(/\\/g, "\\\\"))) {
					let entryData = JSON.parse(fs.readFileSync(path.join(entryDirectory, year, month, day, entry).replace(/\\/g, "\\\\")));
					mainHtml += `
						<div class="container margin-top">
							<div class="row">
								<div class="col-md-12">
									<h1>${entryData.title}</h1>
									<h6>${entryData.date}</h6>
								</div>
							</div>
							<br>
							<div class="row">
								<div class="col-md-12">
									<p>${entryData.content}</p>
								</div>
							</div>
						</div>
						<br><br>
					`;
				};
			};
		};
	};

	document.getElementById("main").innerHTML = mainHtml;
};



function showEntry(entryPath) {
	page = "entry";
	document.getElementById("nav-button-all").classList.remove("active");
	document.getElementById("nav-button-home").classList.remove("active");
	document.getElementById("nav-button-new").classList.remove("active");
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant",
	});

	const splitPath = entryPath.split("/");

	const year = splitPath[0];
	const month = splitPath[1];
	const day = splitPath[2];
	const entry = splitPath[3];
	const entryData = JSON.parse(fs.readFileSync(path.join(entryDirectory, year, month, day, entry)));

	const mainHtml = `
		<div class="container margin-top">
			<div class="row">
				<div class="col-md-12">
					<h1 class="entry-title">${entryData.title} <span class="button edit-button" onclick="editEntry('${entryPath}')">Edit</span></h1>
					<h6>${entryData.date}</h6>
				</div>
			</div>
			<br>
			<div class="row">
				<div class="col-md-12">
					<p>${entryData.content}</p>
				</div>
			</div>
		</div>
	`;

	document.getElementById("main").innerHTML = mainHtml;
};



function showHome() {
	page = "home";
	document.getElementById("nav-button-all").classList.remove("active");
	document.getElementById("nav-button-new").classList.remove("active");

	document.getElementById("nav-button-home").classList.add("active");
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant",
	});

	// Loop through all subdirectories of main entry directory to build an array of entries
	let entries = [];
	for (const year of fs.readdirSync(entryDirectory)) {
		for (const month of fs.readdirSync(path.join(entryDirectory, year).replace(/\\/g, "\\\\"))) {
			for (const day of fs.readdirSync(path.join(entryDirectory, year, month).replace(/\\/g, "\\\\"))) {
				for (const entry of fs.readdirSync(path.join(entryDirectory, year, month, day).replace(/\\/g, "\\\\"))) {
					let data = JSON.parse(fs.readFileSync(path.join(entryDirectory, year, month, day, entry).replace(/\\/g, "\\\\")));
					data.path = `${year}/${month}/${day}/${entry}`;
					entries.push(data);
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
		let substring = `${entry.content}`.replace(/<br>/g, " ").substring(0, 104);
		mainHtml += `
			<div class="col-md-4 margin-bottom">
				<div class="card hover-pointer" onclick="showEntry('${entry.path}')">
					<div class="card-header">
						<h5>${entry.title}</h5>
					</div>
					<div class="card-body">${substring}${entry.content.length > 104 ? " . . ." : ""}</div>
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



function showNew(entryData) {
	page = "new";
	document.getElementById("nav-button-all").classList.remove("active");
	document.getElementById("nav-button-home").classList.remove("active");

	if (!entryData) document.getElementById("nav-button-new").classList.add("active");
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: "instant",
	});

	let entryDate = "";
	let entryTime = "";
	if (entryData) {
		let entryMonthText = entryData.date.split(" ")[0];
		let entryMonth = "";
		switch (entryMonthText) {
			case "Jan": entryMonth = "01"; break;
			case "Feb": entryMonth = "02"; break;
			case "Mar": entryMonth = "03"; break;
			case "Apr": entryMonth = "04"; break;
			case "May": entryMonth = "05"; break;
			case "Jun": entryMonth = "06"; break;
			case "Jul": entryMonth = "07"; break;
			case "Aug": entryMonth = "08"; break;
			case "Sep": entryMonth = "09"; break;
			case "Oct": entryMonth = "10"; break;
			case "Nov": entryMonth = "11"; break;
			case "Dec": entryMonth = "12"; break;
		};
		let entryDay = entryData.date.split(" ")[1].split(",")[0];
		if (entryDay.length === 1) entryDay = `0${entryDay}`;
		let entryYear = entryData.date.split(" ")[2];
		entryDate = `${entryYear}-${entryMonth}-${entryDay}`;

		let entryHour = entryData.date.split(" ")[4].split(":")[0];
		let entryMinute = entryData.date.split(" ")[4].split(":")[1];
		entryTime = `${entryHour}:${entryMinute}`;
	}

	document.getElementById("main").innerHTML = `
		<div class="container margin-top">
			<div class="row">
				<div class="col-md-6">
					<input id="entry-title" class="form-control" type="text" placeholder="Title"${entryData ? ` value="${entryData.title}"` : ""}>
				</div>
				<div class="col-md-4">
					<div class="row">
						<div class="col">
							<input id="entry-date" class="form-control" type="date"${entryData ? ` value="${entryDate}" disabled` : ""}>
						</div>
						<div class="col">
							<input id="entry-time" class="form-control" type="time"${entryData ? ` value="${entryTime}" disabled` : ""}>
						</div>
					</div>
					<div class="row">
						<div class="form-text text-center">Optional, defaults to current date and time</div>
					</div>
				</div>
				<div class="col-md-2">
					<div class="button text-center" onclick="createNew()">Save</div>
				</div>
			</div>
			<form>
				<div class="grow-wrap">
					<textarea id="entry-content" class="form-control margin-top" placeholder="Start typing here...">${entryData ? entryData.content.replace(/<br>/g, "\n") : ""}</textarea>
				</div>
			</form>
		</div>
	`;
};