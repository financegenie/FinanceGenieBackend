
module.exports = function(app, firebase) {
    app.post('./account/insert_account', (req, res) => {
        firebase.database().ref('users/'+ req.body.userID).set({
            name: req.body.name
        }).catch(function(err) {
            res.send(err)
        })
    })
}
