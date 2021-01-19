const express = require("express");
require("./db/conn");
const Student = require("./models/students");
const upload = require('express-fileupload')

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

//search individual Student-details using student id

app.get("/students/:id",async(req,res) => {
    try {
       const _id = req.params.id;//The req.params property is an object containing properties mapped to the named route “parameters”. For example, if you have the route /student/:id, then the “id” property is available as req.params.id. This object defaults to {}.
       const studentData = await Student.findById(_id);//Finds a single document by its _id field. findById(id) is almost* equivalent to findOne({ _id: id }). If you want to query by a document's _id, use findById() instead of findOne().
       if(!studentData){
           return res.status(404).send();
       }else{
        res.send(studentData)
       }    
        
    } catch (e) {
        res.status(500).send(e);
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
   
//Deelete Student details

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
        req.status(500).send(e);
             }
})

//sort Student Details
// app.get("/students/",auth,async(req,res) => {
//     try{
//     const sortStudents = await Student.sort();
//     res.send(sortStudents);
//     }
//     catch(e){
//         req.status(500).send(e); 
//     }
// });

// app.get("/students/",async(req,res) => {
   
//     try {
//         await req.user.populate({
//             path:'students',
            
//             options:{
//                 limit:parseInt(req.query.limit),
//                 skip:parseInt(req.query.skip)
//             }
//         }).execPopulate();
//         res.status(201).send(req.user.students)
//     } catch (e) {
//         req.status(500).send(e); 
//     }

// })

// app.get("/students/",async(req,res) => {
//     try {
//         const { page = 1, limit = 10 } = req.query;
//         const std = await Student.find()
//         .limit(limit * 1 )
//         .skip((page-1)*limit);
//         console.log(std)
//     } catch (e) {
//         req.status(500).send(e); 
//     }
// });


// app.get("/students/",async(req,res) => {
//     try {
//         const user = new Student(req.query);
//         const sortStudents = await user.sort({ field: 'desc', test: 1 });
//         res.status(201).send(sortStudents);
//         console.log(sortStudents);
//     } catch (e) {
//         res.status(400).send(e);
//     }
// })


//search
// app.get("/students/",async(req,res) => {
//     try {
//         const searchQuery = req.query.search;
//         const searchStudent = Student.find({                
                   
//                     $and: [
//                         {
//                           $or: [
//                             {
//                               id: { $regex: `.${searchQuery}.`, $options: "i" },
//                             },
//                             {
//                               "Name": {
//                                 $regex: `.${searchQuery}.`,
//                                 $options: "i",
//                               },
//                             },
//                             {
//                               "email": {
//                                 $regex: `.${searchQuery}.`,
//                                 $options: "i",
//                               },
//                             },
                            
//                           ],
//                         }]})




//         res.send(searchStudent);
//     } catch (e) {
//         reqq.status(404).send(e)
        
//     }
  
//     })



app.get("/students/",async(req,res) => {
    try {
        var searchQuery = req.query.search;
        const searchStudent = await Student.find({ Name: { $regex:`.${searchQuery}.`, $options: "i"  } } )              
        res.send(searchStudent);
        console.log(searchStudent);
    } catch (e) {
        res.status(404).send(e)   
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