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

    app.post('/account/get_balance', (req,res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            });
        }

        plaidClient.getBalance(req.body.accessToken, (err, result) => {
            console.log(result.accounts)
            if (err) {
                res.send(err)
            } else{
                const account = result.accounts.find(x => x.account_id === req.body.accountID);
                res.send({
                    "Status code": 200,
                    "account_id": account["account_id"],
                    "balance": account["balances"],
                    "name": account["name"]
                })
            }
        })
    });

    app.post('/account/insert_account', (req, res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            });
        }

        db.collection('accounts').doc(req.body.accessToken).get()
            .then(docSnapshot => {
                if (docSnapshot.exists){
                    res.send({
                        "Status Code": 500,
                        "Error Message": "Document Already Exist"
                    })
                }
                else {
                    db.collection('accounts').doc(req.body.accessToken).set({
                        userID : req.body.userID,
                        accountID : req.body.accountID,
                        accessToken : req.body.accessToken
                    }).catch(error => {
                        res.send(error)
                    }).then(() => {
                        res.send({
                            "Status Code": 200,
                        })
                    })
                }
            }).catch(error => {
            res.send(error)
        })
    });

    app.post('/account/get_linked', (req, res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            });
        }

        db.collection('accounts').where('userID', '==', req.body.userID).get()
            .then(snapshot => {
                if (snapshot.empty) {

                    res.send({
                        "Status Code": 200,
                        "Account": [],
                        "Message": "No account linked"
                    })
                }
                var accounts = []
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    accounts.push( doc.data());
                });
                res.send({
                    "Status Code": 200,
                    "Account": accounts
                })

            }).catch(error => {
            res.send({
                "Status Code": 500,
                "Error": error
            })
        })
    });

    app.post('/Transaction/get', (req, res) => {
        if (!(req && req.body)) {
            res.send({
                "Status Code": 400,
                "Error Message": "Invalid body"
            });
        }
        console.log(req.body)
        console.log(req)
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

        }).catch(error => {
            res.send(error)
        })
    })


    app.get('/account/', (req, res) => {
        console.log(req.body);
        res.send('Welcome to the account testing routes');
    });
};
