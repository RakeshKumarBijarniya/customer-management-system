const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        required:true
    },
    createdDate:{
        type:String,
        required:true,
        default:new Date() 
    }
})

module.exports = mongoose.model('blog',blogSchema)