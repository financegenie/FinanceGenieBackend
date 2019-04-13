const plaid = require('plaid')

const plaid_settings = require('../../config/Plaid/plaid-setting')

var headers = {
    'Content-Type': 'application/json',

}

var plaidClient = new plaid.Client(plaid_settings.client_id, plaid_settings.secret,
    plaid_settings.public_key, plaid.environments.development, {version:
            '2018-05-22'});


module.exports = function(app, db) {

    app.post('/account/insert_user_details', (req, res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            })
            return
        }


        db.collection('users').doc(req.body.userID).set({
            name: req.body.name
        }).catch(function(err) {
            res.send(err)
        }).then(function() {
            res.send({"Status Code": 200})
        })
    });

    app.post('/account/insert_account', (req, res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            });
            return
        }


        db.collection('accounts').doc(req.body.access_token).get()
            .then(docSnapshot => {
                if (docSnapshot.exists){
                    res.send({
                        "Status Code": 500,
                        "Error Message": "Document Already Exist"
                    })
                }
                else {
                    db.collection('accounts').doc(req.body.accessToken).set({
                        uid : req.body.userID,
                        account_id : req.body.account_id
                    }).catch(error => {
                        res.send(error)
                    }).then(() => {
                        res.send({
                            "Status Code": 200,
                            "account_id": req.body.userID
                        })
                    })
                }
            }).catch(error => {
                res.send(error)
        })
    });

    app.post('/account/get_balance', (req,res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            });
            return
        }

        plaidClient.getBalance(req.body.accessToken, (err, result) => {
            if (!err) {
                res.send(err)
            } else{
                const accounts = result.accounts;
                res.send({
                    "Status code": 200,
                    "account_id": accounts["account_id"],
                    "balance": accounts["balances"],
                    "name": accounts["name"]
                })
            }
        })
    });

    app.post('/account/get_access_token', (req, res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            });
            return
        }

        let PUBLIC_TOKEN = req.body.public_token;
        plaidClient.exchangePublicToken(PUBLIC_TOKEN, function(error,
                                                          tokenResponse) {
            if (error != null) {
                console.log('Could not exchange public_token!' + '\n' +
                    error);
                return res.json({error: error});
            }
            let ACCESS_TOKEN = tokenResponse.access_token;
            let ITEM_ID = tokenResponse.item_id;
            console.log('Access Token: ' + ACCESS_TOKEN);
            console.log('Item ID: ' + ITEM_ID);
            res.send({
                'error': false,
                'Access Token': ACCESS_TOKEN,
            });
        });
    });

    app.get('/account/', (req, res) => {
        console.log(req.body);
        res.send('Welcome to the account testing routes');
    });
};
