const express = require("express");
require("./db/conn");
const Student = require("./models/students");

const app = express(); // call express
const port = process.env.PORT || 3000; //assign new port number


app.use(express.json());


//when client requesting server response with that parameteres(req,res)
// app.post("/students",(req,res) => { //create new student with post method(new student's registration)
//     console.log(req.body);
//     const user = new Student(req.body);

//     user.save().then(() =>{
//         res.send(user);
//             }).catch((e) =>{
//                 res.send(e);
//             })
    
//     // res.send("Hello from the Other Side........");
// })

//Another way to creation
//Used async await
app.post("/students",async(req,res) => {
    try {
        const user = new Student(req.body);
        const createUser = await user.save();
        res.status(201).send(createUser);
    } catch (e) {
        res.status(400).send(e);
    }
})



//read the data by get method
app.get("/students",async(req,res) => {
    try {
       const studentsData = await Student.find();
       res.send(studentsData)
        
    } catch (e) {
        res.send(e);
    }
})




app.listen(port,() =>{
    console.log(`connection is setup at ${port}`);
})
