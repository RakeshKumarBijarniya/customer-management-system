const router = require("express").Router()
const upload = require("../middleware/multer")
const blogC = require("../controllers/blogController")
const authC = require("../controllers/authContoroller")
const loginCheck = require("../middleware/loginCheck")
const subscriptionCheck = require("../middleware/subscriptionCheck")

router.get("/",loginCheck,authC.login)
router.get('/logout',authC.logout)

router.get("/changePassword",loginCheck,authC.changePasswordForm)
router.post("/changePassword",loginCheck,authC.changePasswordData)


router.get("/updateProfile/:message/",loginCheck,subscriptionCheck,authC.updateProfileForm)
router.post("/updateProfile/:message/",loginCheck,subscriptionCheck,authC.updateProfile)

router.get("/blogManagement",loginCheck,subscriptionCheck,blogC.blogsManagement)

router.get('/blogCreate',loginCheck,subscriptionCheck,blogC.blogForm)
router.post('/blogCreate',loginCheck,subscriptionCheck,blogC.createBlog)

router.get("/updateBlog/:id",loginCheck,subscriptionCheck,blogC.updateBlogForm)
router.post("/updateBlog/:id",loginCheck,subscriptionCheck,blogC.updateBlogData)

router.get("/deleteBlog/:id",loginCheck,blogC.deleteBLog)
module.exports = router