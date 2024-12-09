const express = require('express')
const app = express()
const session = require("express-session")

app.use(express.urlencoded({extended:false}))
require("./dbconnections/dbconnection")
const adminRouter = require("./routers/admin")
const userRouter = require("./routers/user")
const authRouter = require("./routers/auth")
const env = require('dotenv').config()

app.use(session({
    secret:"Rakesh",
    resave:false,
    saveUninitialized:false
}))
app.use("/admin",adminRouter)
app.use("/auth",authRouter)
app.use(userRouter)
app.use(express.json())

app.use(express.static("public"))
app.set("view engine","ejs")
app.listen(process.env.PORT,()=>{
    console.log(`server run port num ${process.env.PORT}`)
})