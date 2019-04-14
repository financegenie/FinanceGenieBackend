
const accountIndex = require('./Account/index.js');
// const transactionIndex = require('./Transaction/index.js');

module.exports = function(app, db) {
    // transactionIndex(app, db);
    accountIndex(app, db);
};
