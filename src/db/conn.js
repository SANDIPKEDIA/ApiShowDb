const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/students-api",{ // basically this method (connect) return promise(either connected or not) 
    useCreateIndex:true, // for properly connection, no deplication warning  on database
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {                 
    console.log("Connection is successfull");
}).catch((e) =>{
    console.log("Connection Failed");

})