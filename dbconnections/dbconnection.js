const mongoose = require("mongoose")
require('dotenv').config()

mongoose.connect(`${process.env.DBURL}/${process.env.DBNAME}`).then(()=>{
    console.log("connected to db");
}).catch((error)=>{
    console.log(error.message)
})