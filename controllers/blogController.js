const blogTable = require("../models/blog")

exports.blogsManagement = async(req,res)=>{
    const username = req.session.username
    const data = await blogTable.find({createdBy:username})
    res.render("blogManagement.ejs",{username,data})
}
exports.blogForm = (req,res)=>{
    let message = ""
    const username = req.session.username
   
    res.render("blogForm.ejs",{username,message})
}
exports.createBlog = (req,res)=>{
   const {title,desc} = req.body
   let message =""
   const username = req.session.username
   try{
    if(!title || ! desc){
        throw new Error("All Fields are Mandatory!!!")
    }
    message = "Successfully Blog Has Been Created!!!"
   const newBlog = new blogTable({title:title,desc:desc,createdBy:username})
   newBlog.save()
   }catch(error){
           message = error.message
   }
   res.render("blogForm.ejs",{username,message})
}


exports.updateBlogForm = async(req,res)=>{
    const id= req.params.id
    let message = ""
    const username = req.session.username
    const data = await blogTable.findById(id)
    res.render('updateBlogForm.ejs',{username,data,message})
}

exports.updateBlogData = async(req,res)=>{
    const id= req.params.id
    let message = ""
    const username = req.session.username
    const {utitle,udesc} = req.body
    await blogTable.findByIdAndUpdate(id,{title:utitle,desc:udesc})
    message = "Blog Update Successfully"
    const data = await blogTable.findById(id)
    res.render('updateBlogForm.ejs',{username,data,message})
}

exports.deleteBLog = async(req,res) =>{
  const id = req.params.id
  await blogTable.findByIdAndDelete(id)
  res.redirect("/blogManagement")
}