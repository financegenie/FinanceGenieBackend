
const accountIndex = require('./Account/index.js');
const locationIndex = require('./Location/index.js');

module.exports = function(app, firebase) {
    //locationIndex(app, firebase);
    accountIndex(app, firebase);
};
