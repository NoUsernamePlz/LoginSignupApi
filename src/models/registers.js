const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    firstname :{
     type:String,
     minlength:[3,"minimum three letters"],
     maxlength:[30,"exceeds limit"],
     reqiured:true
    },
    lastname :{
        type:String,
        reqiured:true
       },
       email :{
        type:String,
        reqiured:true,
        unique:true
       },
       password :{
        type:String,
        reqiured:true,
        unique:true
       },
       confirmpassword :{
        type:String,
        reqiured:true
        
       },
       tokens:[{
           token:{
               type:String,
               reqiured:true
           }
       }]
    
    
})


//jwt




employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
     const token = jwt.sign({_id:this._id.toString()},"mynameiskomalkumarijhaiamastudenatpussgrc");
     this.tokens = this.tokens.concat({token:token});
     await this.save();
     console.log(token);
     return token;

    } catch(error){
      res.send("error occred" + error);
      console.log("error occred" + error);
    }
} 



employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
       
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = await bcrypt.hash(this.password,10);//change code here confirmpassword = undefined
    }

    next();
})

// to create Collections

const Register = new mongoose.model("Register",employeeSchema);

//to validate joi


module.exports= Register;
// { User, validate }