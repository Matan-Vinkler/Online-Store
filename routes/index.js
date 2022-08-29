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
const _adminDiv = '<li class="nav-item"><a class="nav-link" href="/admin">Admin</a></li>';

router.get('/', function(req, res, next) {
  const uid = req.cookies.UID;
  const search = req.query.search;

  onValue(ref(database, "users/" + uid), (snapshot) => {
    let logDiv, cartDiv, adminDiv = "";
    let btn_dis = "";

    if(snapshot.exists()) {
      const admin = snapshot.val().admin;
      if(admin) {
        adminDiv = _adminDiv;
      }

      logDiv = logoutDiv;
      cartDiv = _cartDiv;
    }
    else {
      logDiv = loginRegDiv;
      cartDiv = "";
      btn_dis = 'disabled="disabled"';
    }

    let productsDiv = "";

    onValue(ref(database, "products"), (snapshots) => {
      snapshots.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();

        let title = childData.title;
        let description = childData.description;
        let price = childData.price;
        let imgBitmap = childData.image;
        let id = childKey;

        if(!search || search == "" || title.toLowerCase().startsWith(search.toLowerCase()) || description.toLowerCase().startsWith(search.toLowerCase())) {
          productsDiv += `<div class="outer"><div class="content animated fadeInLeft"><a href="product?id=${id}"><h4>${title}</h4><p id="desc">${description}</p><a>${price}$</a><div class="button"><form action="/cart" method="post"><input type="hidden" name="productId" value="${id}"><button type="submit" ${btn_dis}>ADD TO CART</button></form></div><img src="data:image/bmp;base64,${imgBitmap}" width="100px" class="animated fadeInRight"></div></div>`;
        }
      });

      res.render("index", { logDiv, cartDiv, productsDiv, adminDiv });
    }, { onlyOnce: true });
  }, { onlyOnce: true });
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("UID");
  res.redirect("/");
});

module.exports = router;