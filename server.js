const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./config/Firebase/financegenie-f595de8d1659.json');

const app = express();
const port = process.env.PORT || 3004

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

require('./App')(app, db);

app.get('/', (req, res) => {
    res.json({"message": "FinanceGenie RESTful API v0.1"})
});

app.listen(port, () => {
    console.log('FinanceGenie API live on ' + port);
})

