var path = require("path"),
	fs = require('fs'),
	jade = require("jade");

var renderFileList = function (dir, files) {
	console.log("files = " + files);

	var jadePath = path.join(process.cwd(), "view", "files.jade");
	var html = jade.renderFile(jadePath, {"dir": dir, "files": files});
	console.log("html = " + html);

	return html;
}

var renderUploadForm = function () {
	return fs.readFileSync("view/upload.html", {"encoding": "utf8"});
}

view = {}
view.renderFileList = renderFileList;
view.renderUploadForm = renderUploadForm;
module.exports = view;