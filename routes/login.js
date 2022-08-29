const express = require('express');
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue } = require("firebase/database");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

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

router.get('/login', function(req, res, next) {
    const uid = req.cookies.UID;

    onValue(ref(database, "users/" + uid), (snapshot) => {
        if(snapshot.exists()) {
            res.redirect("/");
        }
        else {
            res.render("login");
        }
    }, { onlyOnce: true});
});

router.post('/login', (req, res, next) => {
    const { email, password, remember } = req.body;
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;

        onValue(ref(database, "users/" + user.uid), (snapshot) => {
            const data = snapshot.val();
            const uid = snapshot.key;

            let exp = 0;

            if(remember) {
                exp = 10 * 24 * 3600 * 1000; // 10 Days
            }
            else {
                exp = 30 * 60 * 1000; // 30 Minutes
            }

            res.cookie("UID", uid, { maxAge: exp });
            res.redirect("/");
        }, { onlyOnce: true })
    }).catch((error) => {
        console.log(error.message);
        res.status(404);
        res.render("login", { error: '<script> alert("Login Failed. User doesn\'t exist."); </script>' });
    })
})

module.exports = router;