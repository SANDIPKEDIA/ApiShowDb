const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/students-api",{ // created a dbasically this method (connect) return promise(either connected or not) 
    useCreateIndex:true, // for properly connection,no  DeprecationWarning warning  on database
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify : false
}).then(() => {                 
    console.log("Connection is successfull");
}).catch((e) =>{
    console.log("Connection Failed");

})