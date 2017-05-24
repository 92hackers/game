var path = require('path');
module.exports = {
  entry: "./src/js/entry.js",
  watch: true,
  output: {
    path: __dirname,
    filename: "build/bundle.js"
  },
  resolve: {

  }
};
