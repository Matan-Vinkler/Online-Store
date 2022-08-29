const express = require('express');
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue } = require("firebase/database");

const firebaseConfig = {
    apiKey: "AIzaSyA-_d9ItRwfu8gkJEfDNOQ4THWuyVAhWnA",
    authDomain: "online-store-7dbdb.firebaseapp.com",
    projectId: "online-store-7dbdb",
    databaseURL: "https://online-store-7dbdb-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "online-store-7dbdb.appspot.com",
    messagingSenderId: "546211568822",
    appId: "1:546211568822:web:4c215f6add6c13466e1a17",
    measurementId: "G-SZJ9E77QW8"
};

const _app_ = initializeApp(firebaseConfig);
const database = getDatabase(_app_);

const loginRegDiv = '<li class="nav-item"><a class="nav-link" href="/login">Log in</a></li><li class="nav-item"><a class="nav-link" href="/signup">Sign up</a></li>';
const logoutDiv = '<li class="nav-item"><a class="nav-link" href="/logout">Log Out</a></li>';
const _cartDiv = '<li class="nav-item"><a class="nav-link" href="/cart">Cart</a></li><li class="nav-item"><a class="nav-link" href="purchases">Purchases</a></li>'
const _adminDiv = '<li class="nav-item"><a class="nav-link" href="/admin">Admin</a></li>';

router.get('/about', function(req, res, next) {
    const uid = req.cookies.UID;

    onValue(ref(database, "users/" + uid), (snapshot) => {
        let logDiv, cartDiv, adminDiv = "";

        if(snapshot.exists()) {
            if(uid == "JRPN9GGBYCeeKigQ1MM0QjLf4pR2") {
                adminDiv = _adminDiv;
            }

            logDiv = logoutDiv;
            cartDiv = _cartDiv;
        }
        else {
            logDiv = loginRegDiv;
            cartDiv = "";
        }

        res.render("about", { logDiv, cartDiv, adminDiv });
    }, { onlyOnce: true });
});

module.exports = router;