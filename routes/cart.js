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

const cartIncludes = (cart, itemId) => {
    let amount = 0;
    for(let i = 0; i < cart.length; i++) {
        if(itemId == cart[i]) {
            amount++;
        }
    }

    return amount;
}

router.get('/cart', function(req, res, next) {
    const uid = req.cookies.UID;

    onValue(ref(database, "users/" + uid), (snapshot) => {
        if(snapshot.exists()) {
            let adminDiv = "";
            if(uid == "JRPN9GGBYCeeKigQ1MM0QjLf4pR2") {
                adminDiv = '<li class="nav-item"><a class="nav-link" href="/admin">Admin</a></li>';
            }

            let titleList = "", priceList = "", amountList = "", removeList = "";
            let totalPrice = 0;

            let cart = snapshot.val().cart;
            if(!cart) cart = [];

            onValue(ref(database, "products/"), (snapshots) => {
                for(let item_ in snapshots.val()) {
                    let amount = cartIncludes(cart, item_);
                    if(amount != 0) {
                        let item = snapshots.val()[item_];

                        let title = item.title;
                        let price = item.price * amount;

                        titleList += `<div class="cart_item_text">${title}</div>`;
                        priceList += `<div class="cart_item_text">${price}$</div>`;
                        amountList += `<div class="cart_item_text">${amount}</div>`;
                        removeList += `<div class="cart_item_text"><form action="cart" method="post"><input type="hidden" name="productId" value="${item_}"><input type="hidden" name="remove" value="true"><button type="submit"><img src="images/minus.png" style="width: 20px; height: 20px;"/></button></form></div>`

                        totalPrice += price;
                    }
                }

                res.render("cart", { titleList, amountList, priceList, totalPrice, removeList, adminDiv });
            }, { onlyOnce: true });
        }
        else {
            res.redirect("/");
        }
    }, { onlyOnce: true });
});

router.post("/cart", (req, res, next) => {
    const uid = req.cookies.UID;
    const itemId = req.body.productId;

    console.log(req.cookies);

    onValue(ref(database, "users/" + uid + "/cart"), (snapshot) => {
        let cart = snapshot.val();
        if(!cart) cart = [];

        if(req.body.remove) {
            cart.splice(cart.indexOf(itemId), 1);
        }
        else {
            cart.push(itemId);
        }

        set(ref(database, "users/" + uid + "/cart"), cart);
        res.redirect("cart");
    }, { onlyOnce: true });
});

module.exports = router;