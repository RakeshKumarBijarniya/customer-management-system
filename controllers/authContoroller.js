const authTable = require("../models/auth")
const bcrpyt =  require("bcrypt")
const mongoose = require("mongoose")
const nodemailer =  require("nodemailer")



// forgot password
exports.forgotForm =(req,res)=>{
  let message = ""
    res.render("auth/forgotemailform.ejs",{message})
}
exports.forgotemailPassword = async(req,res)=>{
    const{email} = req.body
    let message = ""
    const emailCheck = await authTable.findOne({email:email})
    try{
      if(emailCheck===null){
        throw new Error("You have enter Email not matched with any Account Please Enter Correct One!!!")
      }
      let id = emailCheck.id
    const transporter = nodemailer.createTransport({
         host: "smtp.gmail.com",
         port: 587,
         secure: false, 
         auth: {
           user:process.env.EMAILUSERNAME,
           pass:process.env.PASSWORD,
         },
   })
      transporter.sendMail({
      from:process.env.EMAILUSERNAME,
      to:email,
      subject:"Forgot password from mail",
      //text:"Click to below link",
      html:`<a href=http://localhost:5000/auth/forgotPassword/${id}>Click to generate New Password</a>`,
   })
   message = "Forgot link has been sent to Your registered Email Id!!!"
 }catch(e){
    message = e.message
 }
 res.render("auth/forgotemailform.ejs",{message})
 }


 exports.forgotPasswordForm = (req,res)=>{
  let message =""
  res.render("auth/forgotPasswordForm.ejs",{message})
 }
 exports.forgotPasswordData = async(req,res)=>{
  let message = ""
  const {npass,cpass} = req.body
  const id = req.params.id
  try{
    if(npass!== cpass){
      throw new Error("Password Not Matched!!!")
    }
    const bpassword = await bcrpyt.hash(cpass,10)
    await authTable.findByIdAndUpdate(id,{password:bpassword})
    res.render("auth/forgotPasswordSuccess.ejs",{message})
  }catch(error){
       message = error.message
  }
  res.render("auth/forgotPasswordForm.ejs",{message})
 }

 // show create Account
exports.showCreateForm =(req,res)=>{
    let message = ""
    res.render("auth/createAccount.ejs",{message})
 }
exports.createAccount = async(req,res)=>{
    let message = ""  
    try{   
    const{fname,lname,email,password,dob,gender,status} = req.body
    const emailcheck = await authTable.findOne({email:email})
    
    if(!fname&& !lname && !email && !password &&!dob && !gender){
        throw new Error("All fields are complusory!!!")      
    }else if(emailcheck!==null){
        throw new Error("Email already registered with us!!!")
    }
    let bpassword =await bcrpyt.hash(password,10)
    const newAccount = new authTable({firstName:fname,lastName:lname,email:email,password:bpassword,dob:dob,gender:gender,status:status})
    newAccount.save()
    const id = newAccount.id
    const transporter = nodemailer.createTransport({
         host: "smtp.gmail.com",
             port: 587,
             secure: false, // Use `true` for port 465, `false` for all other ports
             auth: {
               user:process.env.EMAILUSERNAME,
               pass:process.env.PASSWORD,
             },
       })    
        console.log("connected to email")
          await  transporter.sendMail({
            from:process.env.EMAILUSERNAME,
            to:email,
            subject:"Verify your Account link here!!!",
            //text:"Click to below link",
            html:`<a href=http://localhost:5000/auth/verifyLink/${id}>Click to Verify Account</a>`,
        })
    console.log("mail sent");
    message = "Succssfully Account has been Created.  Please check your email for Account Verification"
    }
     catch(e){
          message = e.message
     }
     res.render("auth/createAccount.ejs",{message})
}

exports.verifyAccount = async(req,res)=>{
  const id = req.params.id
  await authTable.findByIdAndUpdate(id,{status:"Active"})
  res.render("auth/activeMessage.ejs")
}


// login Check
exports.loginForm = (req,res)=>{
  let message =""
  res.render("auth/login.ejs",{message})
}

exports.loginCheck = async(req,res)=>{
  let message =""
  const {username,password} = req.body
  const loginCheck =  await authTable.findOne({email:username})
  try{
      if(!username && !password){
          throw new Error("All Fields Are Compulsory!!!")
      }
      if(loginCheck==null){
        throw new Error("Username is Not Registered Please Enter Valid Username")
      }
     let passwordCompare =await bcrpyt.compare(password,loginCheck.password)
      if(!passwordCompare){
        throw new Error("Username Password incorrect!!!")
      }
      if(loginCheck.status=="Suspended"){
        throw new Error("Your Account is Suspended !!! Please Check Your Email For Activation link!!!")
      }
      
      req.session.username = username
      req.session.isAuth = true
      req.session.userid = loginCheck.id
      req.session.sub = loginCheck.subscription
      
      if(loginCheck.role==="users"){
        res.redirect("/")
      }
      else{
        res.redirect("/admin")
      }
      
  }catch(error){
     message = error.message
     res.render("auth/login.ejs",{message})
  }
}


/// logout 
exports.logout =  (req,res)=>{
  req.session.destroy()
  res.redirect("/auth")
}

// loginCheck 
exports.login = async(req,res)=>{
  const user = req.session.username
  const usernameSplit = user.split('@')
  const username = usernameSplit[0]
  const data = await authTable.findOne({email:user})
 
  res.render("home.ejs",{username,data})
}

// changePassword 

exports.changePasswordForm = (req,res)=>{
 let message = ""
  const user = req.session.username
  const usernameSplit = user.split('@')
  const username = usernameSplit[0]
  res.render("changePassoword.ejs",{username,message})
}

exports.changePasswordData = async(req,res)=>{
  const {currentPassword,newPassword,confirmPassword} = req.body
  
 let message = ""
  const user = req.session.username
  const usernameSplit = user.split('@')
  const username = usernameSplit[0]

  try{
    const userData = await authTable.findOne({email:user})
    const cpass = userData.password
    const comprisonPassword = await bcrpyt.compare(currentPassword,cpass)

    if(!currentPassword || !newPassword || !confirmPassword){
      throw new Error("Fields Should not be blank!!!!")
    }
    else if(!comprisonPassword){
      throw new Error("Current Password not Matched!!!")
    }
     else if(newPassword !== confirmPassword){
      throw new Error("New Password, Confirm Password not Matched!!!")
    }
    const updatedPassword = await bcrpyt.hash(newPassword,10)
    const id  =  req.session.userid

    await authTable.findByIdAndUpdate(id,{password:updatedPassword})
     message = "Successfully Password has been Changed!!!"
     req.session.destroy()

  }catch(e){
     message=e.message
  }
  res.render("changePassoword.ejs",{username,message})
}

// update Profile 

exports.updateProfileForm = async(req,res)=>{

  let message = req.params.message
  let image = req.params.image
  const user = req.session.username
  const usernameSplit = user.split('@')
  const username = usernameSplit[0]
  const data = await authTable.findOne({email:user})
  res.render("updateProfile.ejs",{username,data,message,image})
   
}

exports.updateProfile = async(req,res)=>{
  const {firstName,lastName,gender} = req.body
  let mess = ""
  const image = req.file
  const user = req.session.username
  const usernameSplit = user.split('@')
  const username = usernameSplit[0]
  const id = req.session.userid
  // res.render("updateProfile.ejs",{username})
  
  
  try{
     await authTable.findByIdAndUpdate(id,{firstName:firstName,lastName:lastName,gender:gender,image:image})
     mess = "Successfully Profile has beeen Updated!!"
    
  }
  catch(e){
    mess = e.message
  }
  res.redirect("/")
 // res.redirect(`/updateProfile/${mess}/${image}`)
}

// admin data 

 exports.usersData =  async(req,res)=>{
  const username = req.session.username
  const message= req.params.mess
  const data = await authTable.find().sort({createdDate:-1})

  res.render("admin/userManagement.ejs",{username,data,message})
}

// admin status change

 exports.statusChange = async(req,res)=>{
  const status = req.params.status
  const id = req.params.id
  let updatestatus = null
  let message = ""
  if(status === "Active"){
    updatestatus = "Suspended"
  }
  else{
    updatestatus = "Active"
  }
  try{
    if(!mongoose.isValidObjectId){
        throw new Error("Invalid Id")
    }
    await authTable.findByIdAndUpdate(id,{status:updatestatus})
    message = "SuccessFully Status Has Been Updated"
  }
  catch(e){
     message = e.message
  }
  res.redirect(`/admin/usermanagement/${message}`)
}