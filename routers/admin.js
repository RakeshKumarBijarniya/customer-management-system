const router = require("express").Router()
const authC = require("../controllers/authContoroller")
const blogC = require("../controllers/blogController")
const loginCheck = require("../middleware/loginCheck")

router.get("/",loginCheck,(req,res)=>{
    const username = req.session.username
    res.render("admin/dashboard.ejs",{username})
})

router.get("/changestatus/:status/:id",authC.statusChange)

router.get('/usermanagement/:mess',loginCheck,authC.usersData)

module.exports = router