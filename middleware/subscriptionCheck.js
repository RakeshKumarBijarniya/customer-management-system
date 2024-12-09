const subscription = (req,res,next)=>{
    if(req.session.sub!=="free"){
        console.log(req.session.sub);
        next()
    }
    else{
        console.log(req.session.sub);
        res.render("subscription.ejs")

    }
}

module.exports = subscription