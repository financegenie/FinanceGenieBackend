
module.exports = function(app, db) {

    app.post('/account/insert_user_details', (req, res) => {
        db.collection('users').doc(req.body.userID).set({
            name: req.body.name
        }).catch(function(err) {
            res.send(err)
        }).then(function() {
            res.send({"Status Code": 200})
        })
    });

    app.post('/account/insert_acount', (req, res) => {
        db.collection('account').doc(req.body.accountID).set({
            uid: req.body.uid
        }).catch(function(err) {
            res.send(err)
        }).then(function () {
            res.send({"Status Code": 200})
        })
    })

    app.get('/account/', (req, res) => {
        console.log(req.body);
        res.send('Welcome to the account testing routes');
    })
}
