var plaid = require('plaid');
var plaid_settings = require('./plaid-setting')

var plaidClient = new plaid.Client(plaid_settings.client_id, plaid_settings.secret,
    PLAID_PUBLIC_KEY, plaid.environments.development, {version:
            '2018-05-22'});
