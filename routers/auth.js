const router = require("express").Router()
const authC = require("../controllers/authContoroller")
const nodemailer = require("nodemailer");
const blogC = require("../controllers/blogController")
require('dotenv').config()
const upload = require("../middleware/multer")


//login 
router.get("/",authC.loginForm)
router.post("/",authC.loginCheck)


//forgotemailpassword
router.get('/forgotemailpassword',authC.forgotForm)
router.post('/forgotemailpassword',authC.forgotemailPassword)
router.get("/forgotPassword/:id",authC.forgotPasswordForm)
router.post("/forgotPassword/:id",authC.forgotPasswordData)


//create account
router.get("/createAccount",authC.showCreateForm)
router.post("/createAccount",authC.createAccount)

//verify account
router.get("/verifyLink/:id",authC.verifyAccount)

module.exports = router