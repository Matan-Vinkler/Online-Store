const express = require('express');
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue, set } = require("firebase/database");

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

const cartIncludes = (cart, itemId) => {
    let amount = 0;
    for(let i = 0; i < cart.length; i++) {
        if(itemId == cart[i]) {
            amount++;
        }
    }

    return amount;
}

router.get('/checkout', function(req, res, next) {
    const uid = req.cookies.UID;

    onValue(ref(database, "users/" + uid), (snapshot) => {
        if(snapshot.exists()) {
            let adminDiv = "";
            const admin = snapshot.val().admin;
            if(admin) {
                adminDiv = '<li class="nav-item"><a class="nav-link" href="/admin">Admin</a></li>';
            }

            const cart = snapshot.val().cart;
            const creditId = snapshot.val().creditID;
            const validDate = snapshot.val().validDate;
            const ccv = snapshot.val().ccv;

            if(!cart) {
                res.render("/");
            }

            onValue(ref(database, "products/"), (snapshot1) => {
                let totalPrice = 0;

                for(let item_ in snapshot1.val()) {
                    let amount = cartIncludes(cart, item_);
                    if(amount != 0) {
                        let item = snapshot1.val()[item_];
                        totalPrice += item.price * amount;
                    }
                }

                res.render("checkout", { totalPrice, creditId, validDate, ccv, adminDiv });
            }, { onlyOnce: true })
        }
        else {
            res.redirect("/");
        }
    }, { onlyOnce: true });
});

router.post("/checkout", (req, res, next) => {
    const totalPrice = req.body.totalPrice;
    const creditId = req.body.creditId;
    const validDate = req.body.validDate;
    const ccv = req.body.ccv;
    const uid = req.cookies.UID;

    onValue(ref(database, "users/" + uid), (snapshot) => {
        if(snapshot.exists()) {
            let user = snapshot.val();

            user.creditID = creditId;
            user.validDate = validDate;
            user.ccv = ccv;
            user.purchases = user.cart;
            user.cart = [];

            set(ref(database, "users/" + uid), user);
        }

        res.redirect("/");
    }, { onlyOnce: true });
})

module.exports = router;