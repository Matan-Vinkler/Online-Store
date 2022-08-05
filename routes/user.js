const express = require('express');
const router = express.Router();

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue, set, push } = require("firebase/database");

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

const includes = (cart, itemId) => {
    let amount = 0;
    for(let i = 0; i < cart.length; i++) {
        if(itemId == cart[i]) {
            amount++;
        }
    }

    return amount;
}

router.get("/user", (req, res, next) => {
    const uid = req.cookies.UID;
    const requestedUID = req.query.id;

    onValue(ref(database, "users/" + requestedUID), (snapshot) => {
        if(snapshot.exists() && uid == "JRPN9GGBYCeeKigQ1MM0QjLf4pR2") {
            let titleList = "", priceList = "", amountList = "";
            let titleList2 = "", priceList2 = "", amountList2 = "";
            let totalPrice = 0;

            let email = snapshot.val().email;
            let creditID = snapshot.val().creditID;
            let validDate = snapshot.val().validDate;
            let ccv = snapshot.val().ccv;

            let cart = snapshot.val().cart;
            let purchases = snapshot.val().purchases;

            if(!cart) cart = [];
            if(!purchases) purchases = [];

            onValue(ref(database, "products/"), (snapshots) => {
                for(let item_ in snapshots.val()) {
                    let amount = includes(cart, item_);
                    if(amount != 0) {
                        let item = snapshots.val()[item_];

                        let title = item.title;
                        let price = item.price * amount;

                        titleList += `<div class="cart_item_text">${title}</div>`;
                        priceList += `<div class="cart_item_text">${price}$</div>`;
                        amountList += `<div class="cart_item_text">${amount}</div>`;

                        totalPrice += price;
                    }

                    let amount2 = includes(purchases, item_);
                    if(amount2 != 0) {
                        let item = snapshots.val()[item_];

                        let title = item.title;
                        let price = item.price * amount2;

                        titleList2 += `<div class="cart_item_text">${title}</div>`;
                        priceList2 += `<div class="cart_item_text">${price}$</div>`;
                        amountList2 += `<div class="cart_item_text">${amount2}</div>`;
                    }
                }

                res.render("user", {email, creditID, validDate, ccv, titleList, amountList, priceList, totalPrice, titleList2, amountList2, priceList2});
            }, { onlyOnce: true });
        }
        else {
            res.redirect("/");
        }
    }, { onlyOnce: true });
});

module.exports = router;