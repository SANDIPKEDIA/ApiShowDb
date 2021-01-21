const express = require("express");
require("./db/conn");
const Student = require("./models/students");
const upload = require('express-fileupload')
const jwt = require("jsonwebtoken");

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

//find individual Student-details using student id

app.get("/students/:id",async(req,res) => {
    try {
       const _id = req.params.id;//The req.params property is an object containing properties mapped to the named route “parameters”. For example, if you have the route /student/:id, then the “id” property is available as req.params.id. This object defaults to {}.
       const studentData = await Student.findById(_id);//Finds a single document by its _id field. findById(id) is almost* equivalent to findOne({ _id: id }). If you want to query by a document's _id, use findById() instead of findOne().
       //this if-else statement is optional(if you not use async-await method you can use it for showing user to invalid )
       if(!studentData){
           return res.status(404).send();
       }else{
        res.send(studentData)
       }     
    } catch (e) {
        res.status(404).send("Please enter a Valid Id")
        // res.status(404).send(e);
    }
})

//update  Student Details 

app.patch("/students/:id",async(req,res) => {
   try {
    const _id = req.params.id;
    const updateStudents = await Student.findByIdAndUpdate(_id, req.body,{
        new : true,
        multi : true
    });
    res.send(updateStudents);
    // console.log(upadteStudents);
   }catch(e){
       req.status(500).send(e);
       
   }
})
   
//Delete Student details
app.delete("/students/:id",async(req,res) => {
    try {
        // const id = req.params.id //we can also skip this line by write in findByIdAndDelete(req.params.id);
        const deleteStudent = await Student.findByIdAndDelete(req.params.id);
        if(!deleteStudent){
            return res.status(404).send();
        }else{
         res.send(deleteStudent)
        }    
    } catch(e) {
        res.status(404).send("User Not Found");
             }
})

//Search Api with Name

app.get("/students/search/:Name",async(req,res) => {
    try {
        const searchQuery = req.params.Name
        const searchStudent = await Student.find({ Name:{ $regex:searchQuery,$options: '$i'  } })    
        res.send(searchStudent)  
    } catch (e) {
        res.status(404).send(e) 
    }
    })

//Jwt token

//basic part:create a jwt token of id
// const createToken = function async(){
//     const token = jwt.sign({_id:'6001a6980dc9fc1ebcaecf25'},"mynameissandipkediadeveloper");
//     console.log("token is: "+token);  
//     const StudentVer = jwt.verify(token,"mynameissandipkediadeveloper")
//     console.log(StudentVer); 
// }
// createToken();


//create jwt token for given any id in url

//   app.get("/students/token/:id",async(req,res) => {
//     try {
//         const _id = req.params.id
//         const studentDataS = await Student.findById(_id);
//         const token = await jwt.sign({studentDataS},"mynameissandipkediadeveloper");
//         const StudentVer = await jwt.verify(token,"mynameissandipkediadeveloper")
//         res.send("token is: "+token);
//         console.log(StudentVer);
//     } catch (e){
//         res.send("Please Check your Id/Secret Key")
//     }
// })

app.post("/students/token/:id",async(req,res)=>{
    try {
        
        const _id = req.params.id    
        console.log(_id);
        const token = await Student.generateAuthToken();
        console.log(token);
        const reg = await Student.save();
    } catch (e) {
        res.send(e)
    }
})
 








//upload file
app.use(upload())
app.get('/',(req,res)=>{
    res.sendFile(__dirname+ '/fileupload.html')//sending the file with help of __dirname
   // __dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file.
})
app.post('/',(req,res)=>{
if(req.files){
    console.log(req.files)
    var file = req.files.file
    var filename= file.name
    console.log(filename);
    file.mv('./src/uploads/'+filename, function (err) {
        if(err){
            res.send(err)
        }else{
            res.send("File Uploaded Succesfull!")
        }
     })
   }
})


app.listen(port,() =>{
    console.log(`connection is setup at ${port}`);
})



//references for status code
//https://www.restapitutorial.com/httpstatuscodes.html
//references for some methods or functions:
//https://mongoosejs.com/docs/queries.html
//https://mongoosejs.com/docs/api/query.html#query_Query-sort
//https://docs.mongodb.com/manual/reference/operator/query/regex/
//https://jwt.io/