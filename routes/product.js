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
const _cartDiv = '<li class="nav-item"><a class="nav-link" href="/cart">Cart</a></li> <li class="nav-item"><a class="nav-link" href="purchases">Purchases</a></li>';

router.get('/product', function(req, res, next) {
    const uid = req.cookies.UID;
    const productId = req.query.id;

    onValue(ref(database, "users/" + uid), (snapshot) => {
        let logDiv, cartDiv, adminDiv = "", removeDiv = "";
        let btn_dis = "";

        if(snapshot.exists()) {
            const admin = snapshot.val().admin;
            if(admin) {
                adminDiv = '<li class="nav-item"><a class="nav-link" href="/admin">Admin</a></li>';
            }

            logDiv = logoutDiv;
            cartDiv = _cartDiv;
        }
        else {
            logDiv = loginRegDiv;
            cartDiv = "";
            btn_dis = 'disabled="disabled"';
        }

        onValue(ref(database, "products/" + productId), (snapshot1) => {
            let product = snapshot1.val();

            let title = product.title;
            let price = product.price;
            let description = product.description;
            let imgBitmap = product.image;

            if (uid == "JRPN9GGBYCeeKigQ1MM0QjLf4pR2") {
                removeDiv = `<p><div class="button"><form action="/removeproduct" method="post"><input type="hidden" name="productId" value="${productId}"><button type="submit">REMOVE</button></form></div></p>`;
            }

            res.render("product", { logDiv, cartDiv, imgBitmap, title, price, description, productId, btn_dis, adminDiv, removeDiv });
        }, { onlyOnce: true });
    }, { onlyOnce: true });
});

module.exports = router;