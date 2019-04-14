const plaid = require('plaid')

const plaid_settings = require('../../config/Plaid/plaid-setting')
let plaidClient = new plaid.Client(plaid_settings.client_id, plaid_settings.secret,
    plaid_settings.public_key, plaid.environments.development, {version:
            '2018-05-22'});

module.exports = function(app, db) {

    app.post('/Transaction/get', (req, res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            });
        }
        plaidClient.getTransactions(req.body.accessToken, req.body.startDate, req.body.endDate, (err, result) => {
            // Handle err

            if (err){
                res.send(err)

            }
            if (result != null) {
                const transactionList = result.transactions.filter(x => x.account_id === req.body.accountID);
                res.send(transactionList)
            } else{
                res.send({
                    "Status Code": 500,
                    "Message": "No linked accounts"
                })
            }
            console.log(result)

        });
    })
}
