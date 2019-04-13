const express = require('express')
const bodyParser = require('body-parser')
const firebase = require('firebase/app')
const firebaseSettings = require('./config/firebase')

require('firebase/auth')
require('firebase/database')

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

firebase.initializeApp(firebaseSettings.firebaseConfig)

app.get('/', (req, res) => {
    res.json({"message": "FinanceGenie RESTful API v0.1"})
});

app.listen(port, () => {
    console.log('FinanceGenie API live on ' + port);
})
