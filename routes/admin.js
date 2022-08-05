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

router.get('/admin', function(req, res, next) {
    const uid = req.cookies.UID;
    const searchVal = req.query.search;

    onValue(ref(database, "users/" + uid), (snapshot) => {
        if(snapshot.exists() && uid == "JRPN9GGBYCeeKigQ1MM0QjLf4pR2") {
            onValue(ref(database, "users"), (snapshots) => {
                let userList = "";

                snapshots.forEach((childSnapshot) => {
                   const currentUser = childSnapshot.val();
                   const currentUserID = childSnapshot.key;

                   if(!searchVal || searchVal == "" || currentUser.email.startsWith(searchVal)) {
                       userList += `<div id="userCard" class="card"><div class="container"><h4><b>${currentUser.email}</b></h4><p>Credit Information: ${currentUser.creditID}, ${currentUser.validDate}, ${currentUser.ccv}</p><p><a href="/user?id=${currentUserID}">View User</a></p></div></div>`;
                   }
                });

                res.render("admin", {userList});
            });
        }
        else {
            res.redirect("/");
        }
    }, { onlyOnce: true });
});

module.exports = router;