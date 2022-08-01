
const express = require("express");
const path =require("path");
const app = express();
const hbs =require("hbs");
require("./db/conn.js");
const Register = require("./models/registers");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth.js");
var validator = require('validator');

const port=process.env.PORT || 3000;


const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path ));
app.set('view engine','hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);
app.get("/",(req,res) =>{
    res.render("login");
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});


app.get("/index",auth,(req,res)=>{
//     console.log("from stored cookie"+req.cookies.jwtlogin);
res.render("index")
})
//create a new user in our database
app.post("/",async(req,res) =>{
 try{
  const password = req.body.password;
  const cpassword = req.body.confirmpassword;
  if(password===cpassword){
   
    const registerEmployee = new Register({
        firstname : req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        password:req.body.password,
        confirmpassword:req.body.confirmpassword //change confirmpasswordcodehere
    })

    console.log('the success part' + registerEmployee);
    
    const token = await registerEmployee.generateAuthToken();
    console.log("token from app.js " +token );


    res.cookie("jwt",token,{
        expires:new Date(Date.now() + 70000000000),
        httpOnly:true
    });
    console.log(cookie);
    const registered = await registerEmployee.save();
    console.log('the page part'+ registered);
    // res.status(201).render("login")
    res.send("you are registered successfully" + cookie);

  }else{
      res.render("passwords are not matching")
  }
 }catch(error){
     res.status(400).send(error);
 }
})

app.post("/signup",async(req,res)=>{
   try{ 
       const email=req.body.email;
      const password=req.body.password;

        const useremail = await Register.findOne({email:email});
        const isMatch =  await bcrypt.compare(password,useremail.password);



        const token = await useremail.generateAuthToken();
            console.log("token from app.js " +token );

            res.cookie("jwtlogin",token,{
                expires:new Date(Date.now() + 70000000000),
                httpOnly:true
            });
            console.log("from stored cookie"+req.cookies.jwtlogin);
            console.log(cookie);
       
        
        if(isMatch){
            res.send("your login cookie is" + cookie);
            
            // res.status(201).render("/")
        }else{
            res.send("invalid login details");
        }
} catch (error){
res.status(400).send("invalid login details");
console.log(error);
}
});

// const createToken = async() =>{
//  const token  = await jwt.sign({_id:" "},"mynameiskomalkumarijhaiamastudenatpussgrc", {expiresIn:"10 days"});
//  console.log(token);

//  const userVer = await jwt.verify(token,"mynameiskomalkumarijhaiamastudenatpussgrc")
//  console.log(userVer);
// }

// createToken()
app.listen(port,()=>{
    console.log('server is running on '+port);
})