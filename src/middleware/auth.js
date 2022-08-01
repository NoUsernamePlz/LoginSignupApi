const jwt = require("jsonwebtoken");
const Register = require("../models/registers");
const Joi = require("joi");

const auth = async (req,res,next)=>{
   try{

  const token = req.cookies.jwtlogin;
  const verifyUser = jwt.verify(token,"mynameiskomalkumarijhaiamastudenatpussgrc");
     console.log(verifyUser);
     const user = await Register.findOne({_id:verifyUser._id});
     console.log(user);
     next();
  
}catch(error){
     res.status(401).send(error);
    
   } 
}


module.exports = auth;