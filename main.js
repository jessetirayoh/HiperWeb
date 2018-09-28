// Test purposes to check if jquery is running
$(document).ready(function() {
	$("#hide").click(function() {
		$("h1").hide();
	});
});

$(document).ready(function() {
	$("#show").click(function() {
		$("h1").show();
	});
});

// Temporary clear button
// $("button").click(function () {
//     $("div").empty();
// });

// Sends the XMLCommand to HiperService
// function loadXMLCommand() {

//     var header = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><Commands>";
//     var openCmd = "<command type=\"open\"><name>Toyota 47.jpg.tif</name><id>image1</id></command>";
//     var footer = "</Commands>";
//     var xhttp = new XMLHttpRequest();

//     xhttp.addEventListener("readystatechange", function () {
//         if (this.readyState === 4) {
//             console.log(this.responseText);
//         }
//     });

//     xhttp.open("POST", "http://10.1.0.138:8000/xmlcommand", true);
//     xhttp.send(header + openCmd + footer);
// }

// var dropLoc = document.getElementById("dropLocation");

// Allows the image/object to be draggable
function drag(evt) {
	evt.dataTransfer.setData("key", evt.target.id);
	console.log("it's dragging...");
}

// Allows the area to receive the dragged object
function allowDrop(evt) {
	evt.preventDefault();
	console.log("item being dragged to valid location...");
}

// Creates a new copy so when it is dragged, image does not disappear
function drop(evt) {
	var data = evt.dataTransfer.getData("key");
	evt.preventDefault();
	var nodeCopy = document.getElementById(data).cloneNode(true);
	nodeCopy.id = "newId"; /* We cannot use the same ID */
	evt.target.appendChild(nodeCopy);
	console.log("Item dropped");

	// Calls the Hiperservice comamand to display file on the  wall
	var header = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><Commands>';
	var openCmd = '<command type="open"><name>Toyota 47.jpg.tif</name><id>image1</id></command>';
	var footer = "</Commands>";
	var xhttp = new XMLHttpRequest();

	xhttp.addEventListener("readystatechange", function() {
		if (this.readyState === 4) {
			console.log(this.responseText);
		}
	});

	xhttp.open("POST", "http://10.1.0.138:8000/xmlcommand", true);
	xhttp.send(header + openCmd + footer);
}

// Clears both walls in the video wall and the HiperWeb
function clearWall() {
	document.getElementById("dropLocation").innerHTML = "";

	var settings = {
		async: true,
		crossDomain: true,
		url: "http://localhost:8000/clearall",
		method: "GET"
	};

	$.ajax(settings).done(function(response) {
		console.log(response);
	});
}

// Prints out XML in the console by calling the xmllist command from HiperService
function printList() {
	var data = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<Commands>\n\t<action type="list">\n\t\n\t</action>\n</Commands>';

	var xhr = new XMLHttpRequest();

	// var nameXML = document.getElementById("name").value;

	xhr.addEventListener("readystatechange", function() {
		if (this.readyState === 4 && this.status === 200) {
			console.log(this.response);
			getNameXML(this.responseText);

			// Prints the formatted XML
			// xml_raw = this.response;

			// xml_formatted = formatXml(xml_raw);

			// xml_escaped = xml_formatted
			// 	.replace(/&/g, "&amp;")
			// 	.replace(/</g, "&lt;")
			// 	.replace(/>/g, "&gt;")
			// 	.replace(/ /g, "&nbsp;")
			// 	.replace(/\n/g, "<br />");

			// var mydiv = document.createElement("div");
			// mydiv.setAttribute("id", "xmlDiv");

			// mydiv.innerHTML = xml_escaped;

			// document.body.appendChild(mydiv);
		}
	});

	xhr.open("POST", "http://localhost:8000/xmlcommand");
	xhr.overrideMimeType("text/xml");
	xhr.send(data);
}

function formatXml(xml) {
	var formatted = "";
	var reg = /(>)(<)(\/*)/g;
	xml = xml.replace(reg, "$1\r\n$2$3");
	var pad = 0;
	jQuery.each(xml.split("\r\n"), function(index, node) {
		var indent = 0;
		if (node.match(/.+<\/\w[^>]*>$/)) {
			indent = 0;
		} else if (node.match(/^<\/\w/)) {
			if (pad != 0) {
				pad -= 1;
			}
		} else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
			indent = 1;
		} else {
			indent = 0;
		}

		var padding = "";
		for (var i = 0; i < pad; i++) {
			padding += "  ";
		}

		formatted += padding + node + "\r\n";
		pad += indent;
	});

	return formatted;
}

function getNameXML(xml, name) {
	var x, i, xmlDoc, nametxt, areEqual;
	xmlDoc = xml.responseXML;
	nametxt = name;
	console.log("HERE \n" + xmlDoc);

	x = xmlDoc.getElementByTagName("name")[0];

	console.log("Something: " + x[0]);

	for (i = 0; i < x.length; i++) {
		if ((areEqual = xmlDoc.getElementsByTagName("name")[0].innerHTML.toUpperCase() === nametxt.toUpperCase())) {
			document.getElementById("demo").value = x[i];
		}
	}

	// var xmlDoc = xml_raw.responseXML;
	// var x = xmlDoc.getElementsByTagName("name")[0];
	// var y = x.childNodes[0];
	// for (var i = 0; i < x.length; i++) {
	// 	txt += x[i].childNodes[0].nodeValue + "<br>";
	// }
	// document.getElementById("demo").innerHTML = txt;
	// document.getElementById("demo") = y.nodeValue;
}

function previewImage() {
	var data =
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<Commands>\n\t<command type="preview"> \n\t\t<name>Toyota 46.jpg.tif</name> \n\t</command> \n</Commands>';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8000/xmlcommand");
	xhr.responseType = "blob";

	xhr.addEventListener("readystatechange", function() {
		if (this.readyState === 4) {
			console.log(this.response);

			// Creates file into a blob
			var blob = new Blob([this.response], { type: "image/png" });
			var url = URL.createObjectURL(blob);
			var myimg = new Image();
			myimg.src = url;
			document.body.appendChild(myimg);
		}
	});

	xhr.send(data);
}
