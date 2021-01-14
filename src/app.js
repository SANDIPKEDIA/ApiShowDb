const express = require("express");
require("./db/conn");
const Student = require("./models/students");

const app = express(); // call express
const port = process.env.PORT || 3000; //assign new port number


app.use(express.json());


//when client requesting server response with that parameteres(req,res)
app.post("/students",(req,res) => { //create new student with post method(new student's registration)
    console.log(req.body);
    const user = new Student(req.body);

    user.save().then(() => {
        res.status(201).send(user);
            }).catch((e) =>{
                res.status(400).send(e);
            })
    
    // res.send("Hello from the Other Side........");
})

app.listen(port,() =>{
    console.log(`connection is setup at ${port}`);
})