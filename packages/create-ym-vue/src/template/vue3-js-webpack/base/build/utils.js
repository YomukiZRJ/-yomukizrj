const path = require("path");
exports.rootPath = function rootPath(str) {
	return path.resolve(__dirname, `../${str}`);
};
