const mongoose = require("mongoose");
const validator = require("validator");

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

}) 

//creating a new collection
const Student = new mongoose.model('Student',studentSchema);
module.exports = Student; //export this collection