var path = require('path');

var root = path.resolve(path.join(__dirname, '..'));

exports.getCodeLocation = function(lineDelta) {

  var stack = new Error().stack,
      parts = stack.split(/\n/)[2].replace(/^\s*at\s*/, '').split(/:/);

  return path.relative(root, parts[0]) + ' at line ' + (parseInt(parts[1], 10) + (lineDelta || 0));
};
