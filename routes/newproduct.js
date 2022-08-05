const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { v4: uuid } = require("uuid");

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

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "./public/images");
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({storage: storage });

router.get("/newproduct", (req, res, next) => {
   const uid = req.cookies.UID;
   onValue(ref(database, "users/" + uid), (snapshot) => {
      if(snapshot.exists() && uid == "JRPN9GGBYCeeKigQ1MM0QjLf4pR2") {
         res.render("newproduct");
      }
      else {
         res.redirect("/");
      }
   });
});

router.post("/newproduct", upload.single("image"), async function (req, res) {
   const imgPath = req.file.path;

   const title = req.body.title;
   const price = req.body.price;
   const description = req.body.description;
   const imgData = fs.readFileSync(imgPath, {encoding: "base64"});

   fs.unlinkSync(imgPath);

   const uid = req.cookies.UID;
   onValue(ref(database, "users/" + uid), (snapshot) => {
      if(snapshot.exists() && uid == "JRPN9GGBYCeeKigQ1MM0QjLf4pR2") {
         set(ref(database, "products/" + uuid()), {
            title: title,
            price: price,
            description: description,
            image: imgData
         });
      }
      res.redirect("/");
   });
});

module.exports = router;