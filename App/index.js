
const accountIndex = require('./Account/index.js');
const locationIndex = require('./Location/index.js');

module.exports = function(app, db) {
    //locationIndex(app, firebase);
    accountIndex(app, db);
};
