const express = require('express');
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set, onValue } = require("firebase/database");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

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
const auth = getAuth(_app_);

router.get('/signup', function(req, res, next) {
    const uid = req.cookies.UID;

    onValue(ref(database, "users/" + uid), (snapshot) => {
        if(snapshot.exists()) {
            res.redirect("/");
        }
        else {
            res.render("signup");
        }
    }, { onlyOnce: true });
});

router.post('/signup', (req, res, next) => {
   const { email, password } = req.body;

   createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        const userInfo = {
            email: email,
            creditID: 0,
            validDate: "",
            ccv: 0,
            cart: [],
            purchases: []
        }

        set(ref(database, "users/" + user.uid), userInfo);

        res.redirect("/login");
   }).catch((error) => {
       console.log(error.message);

       res.status("404");
       res.render("error", error);
   })
});

module.exports = router;