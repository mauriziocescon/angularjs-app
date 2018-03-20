const fs = require("fs");

// delete db
exports.deleteDb = (path, callback) => {
  if (fs.existsSync(path)) {
    fs.unlink(path, callback);
    return;
  }
  callback();
};

// save db
exports.saveDb = (path, data, callback) => {
  fs.writeFile(path, JSON.stringify(data, null, 2), callback);
};
