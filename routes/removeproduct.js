const express = require('express');
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue } = require("firebase/database");

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

router.post("/removeproduct", (req, res, next) => {
   const productId = req.body.productId;
   const uid = req.cookies.UID;
   onValue(ref(database, "users/" + uid), (snapshot) => {
       if(snapshot.exists() && uid == "JRPN9GGBYCeeKigQ1MM0QjLf4pR2") {
           set(ref(database, "products/" + productId), null);
       }
       res.redirect("/");
    });
});

module.exports = router;