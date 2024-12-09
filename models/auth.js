const mongoose = require("mongoose")

const authSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    gender:{
         type:String,
         required:true
    },
    createdDate:{
        type:Date,
        default:new Date(),
        required:true
    },
    status:{
        type:String,
        default:"Suspended",
        required:true
    },
    role:{
        type:String,
        default:"users",
        required:true
    },
    subscription:{
        type:String,
        default:"free",
        required:true
    }
})


module.exports =  mongoose.model('auth',authSchema)