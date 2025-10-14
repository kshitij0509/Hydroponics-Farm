const express = require('express');
const router = express.Router();


const{ homepage,cropadded,newcrop} = require('../controllers/home');
const{showCropAndReadings,editreading,updatereading,deletereading} = require('../controllers/showcrop')
const{showCropAndReadingsInflux} = require('../controllers/showcropInflux')
const{deletecrop,editcrop,updatecrop} = require("../controllers/rmcrop");
const{readingform,cropreading} = require("../controllers/addcropreading");



router.get("/",homepage);
router.get("/newcrop",newcrop);
router.get("/editreading/:id",editreading);
router.get("/:id",showCropAndReadings);
router.get("/influx/:id",showCropAndReadingsInflux);
router.get("/cropreading/:id",readingform);


router.get("/edit/:id",editcrop);
router.post("/cropadded",cropadded);
router.post("/save/cropreading",cropreading)

router.put('/edit/:id',updatecrop)
router.put('/editreading/:id',updatereading)
router.delete("/delete/:id",deletecrop);
router.delete("/deletereading/:id",deletereading)



module.exports = router;