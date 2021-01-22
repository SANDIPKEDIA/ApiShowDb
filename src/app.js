const express = require("express");
require("./db/conn");
const Student = require("./models/students");
const upload = require("express-fileupload");
const jwt = require("jsonwebtoken");
const app = express(); // call express
const port = process.env.PORT || 3000; //assign new port number
app.use(express.json()); //middleware of our application hum postman se JSon fomat mein data bhejrhe hein so ye directly JSOn format read nahi karpata so humlog ye middleware use karte hein

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

// 1: Create Api
app.post("/students", async (req, res) => {
  try {
    const user = new Student(req.body);
    const createUser = await user.save();
    res.status(201).send(createUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

// 2: Get ALL
//read the data 
app.get("/students", async (req, res) => {
  try {
    const studentsData = await Student.find()
    .limit(parseInt(req.params.limit))
    res.send(studentsData);
  } catch (e) {
    res.send(e);
  }
});

//limit
app.get("/students/limit=:limit", async (req, res) => {
  try {
    const limitStudent = await Student.find()
    .limit(parseInt(req.params.limit))
    res.send(limitStudent );
    // console.log(limitStudent );
  } catch (e) {
    res.send(e);
  }
});

//count
app.get("/students/countDocuments", async (req, res) => {
  try {
    const countStudent = await Student.count({});
    res.json(countStudent);
    // console.log(limitStudent );
  } catch (e) {
    res.send(e);
  }
});
//without async await count method
// app.get("/students/countDocuments", function (req, res) {
//   Student.count( {}, function(err, result){
//       if(err){
//           res.send(err)
//       }else{
//           res.json(result)
//       }
//  })
// })





//skip
app.get("/students/skip=:skip", async (req, res) => {
  try {
    const skipStudent = await Student.find()
    .skip(parseInt(req.params.skip))
    res.send(skipStudent);
    // console.log(limitStudent );
  } catch (e) {
    res.send(e);
  }
});

//sort api
app.get("/students/sort", async (req, res) => {
  try {
    const sortStudent = await Student.find().sort('Name')
    res.send(sortStudent);
    // console.log(sortStudent);
     } catch (e) {
    res.send(e);
  }
});


//find individual Student-detail with Age
app.get("/students/Age=:Age", async (req, res) => {
  try {
    const Age = req.params.Age;
    // const studentData = await Student.findById(_id);
    const studentData = await Student.findOne({ Age })
    if (!studentData) {
      return res.status(404).send("No Result");
    } else {
      res.send(studentData);
    }
  } catch (e) {
    res.status(404).send("No Result");
    // res.status(404).send(e);
  }
});
//find individual Student-detail with Name
app.get("/students/Name=:Name", async (req, res) => {
  try {
    const Name = req.params.Name;
    // const studentData = await Student.findById(_id);
    const NameData = await Student.findOne({Name} )
    if (!NameData) {
      return res.status(404).send(error);
    } else {
      res.send(NameData);
    }
  } catch (e) {
    res.status(404).send(e);
    // res.status(404).send(e);
  }
});




// update with updateOne method
app.put("/students/update/:id", async (req, res) => {
  try {
     const _id = req.params.id;
    const updateStudents = await Student.updateOne(
      {
       _id:_id,  // match
      },
      {
        $set: req.body,  // update
      },
      {
        multi: true, // for multiple updations
      }
    );
    res.send(updateStudents);
//     // console.log(upadteStudents);
  } catch (e) {
    res.send(e);
  }
});

// update by id

// app.put("/students/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const updateStudents = await Student.findByIdAndUpdate(_id, req.body, {
//       new: true,
//       multi: true,
//     });
//     res.send(updateStudents);
//     // console.log(upadteStudents);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });



//Delete Student details
app.delete("/students/:id", async (req, res) => {
  try {
    // const id = req.params.id //we can also skip this line by write in findByIdAndDelete(req.params.id);
    // const deleteStudent = await Student.findByIdAndDelete(req.params.id);
    const deleteStudent = await Student.remove(
      { _id: req.params.id },
      {
             multi: true, 
      }
      
      );
    if (!deleteStudent) {
      return res.status(404).send();
    } else {
      res.send(deleteStudent + "Successfully Deleted");
    }
  } catch (e) {
    res.status(404).send("User Not Found");
  }  
});

//Search Api with Name

app.get("/students/search/:q", async (req, res) => {
  try {

    const searchQuery = req.params.q;
    const query = {
        $and: [
          {
            $or: [
              {
                Name: { $regex: `.*${searchQuery}.*`, $options: "i" },
              },
               {
                Age: { $regex: `.*${searchQuery}.*`, $options: "i" },
               },
              {
                email: { $regex: `.*${searchQuery}.*`, $options: "i" },
               },
            ],
          }
        ],
      };
    const searchStudent = await Student.find(query);
    res.send(searchStudent);
  } catch (e) {
    res.status(404).send(e);
  }
});



//Jwt token
// basic part:create a jwt token of id


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







//upload file
app.use(upload());
app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/fileupload.html"); 
  res.sendFile(__dirname + "/public/fileupload.html"); 
    //sending the file with help of __dirname
  // __dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file.
});
app.post("/", (req, res) => {
  if (req.files) {
    console.log(req.files);
    var file = req.files.file;
    var filename = file.name;
    console.log(filename);
    file.mv("./src/uploads/" + filename, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("File Uploaded Succesfull!");
      }
    });
  }
});




app.listen(port, () => {
  console.log(`connection is setup at ${port}`);
});

//references for status code
//https://www.restapitutorial.com/httpstatuscodes.html
//references for some methods or functions:
//https://mongoosejs.com/docs/queries.html
//https://mongoosejs.com/docs/api/query.html#query_Query-sort
//https://docs.mongodb.com/manual/reference/operator/query/regex/
//https://jwt.io/



// Tasks




// update one  // chekout updateOne method as well
// update multiple // try another methord
// delete one // try with .remove() method
// delete multiple
// search  // api retest kr lena


// -----------------------------
// Done
// create APi
// Get Aall APi
// auth with jwt
// file upload
// sort
// limit
// skip 
// count
// .remove({
//     age:23
// }, {
//        multi: true, // for multiple updations
//      })
// GET ONE APi  //  should work with find method
// filter   // find() query for other fields

//question
//delete multiple
//update multiple
//sort count
//search