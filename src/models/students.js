const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");


const studentSchema = new mongoose.Schema({
    Name : {
        type:String,
        required:true,
        minlength:3
    },
    
    email : {
        type:String,
        required:true,
        unique:[true,"Email is already exist"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    
    phone : {
        type:Number,
        required:true,
        min:10,
        unique:true
    },
    address : {
        type:String,
        required:true,
        
    },
    
    Age : {
        type:Number,
        required:true,
        minlength:2
    },
    Roll_No : {
        type:Number,
        required:true,
        unique: true
    },
    College_Name : {
        type:String,
        required:true,
        minlength:3
    },
    tokens:[{
        token: {
            type:String,
            required:true,
        }
    }]


}) 

//generating Token

studentSchema.statics.generateAuthToken = async function(){ 
    try {
        console.log(this._id);
        const token = await jwt.sign({_id:this._id.toString()},"mynameissandipkediadeveloper");
        this.tokens = this.tokens.concat({token:token})//key and value both are same so u can just write here concat({token})
        await this.save();
        return token;

    } catch (e) {
        res.send("errorr"+e)
        console.log("errrooer"+e);
    }


}




//creating a new collection
const Student = new mongoose.model('Student',studentSchema);
module.exports = Student; //export this collection