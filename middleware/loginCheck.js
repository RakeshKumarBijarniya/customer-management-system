const loginCheck = (req,res,next) =>{
if(req.session.isAuth!=="free"){
    next()
    
}
else{
    res.redirect("/auth")
}
}

module.exports = loginCheck