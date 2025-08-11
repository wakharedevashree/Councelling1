// import express from 'express';
// import path from 'path';
// import bcrypt from 'bcrypt';
// import mongoose, { sanitizeFilter } from 'mongoose';
// import collection from './config.js';
// import session from "express-session";



// const app = express();
// const __dirname = path.resolve();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");

// app.use(session({
//   secret: "counsel-key",
//   resave: false,
//   saveUninitialized: false,
// }));

// app.use(express.json());


// //use EJS as view Engin

// app.set('view engine','ejs');


// mongoose.connect("mongodb+srv://diyawakhare27:Axp05sXlOkzYvlKf@cluster0.yu6vodo.mongodb.net",{
//     dbName:"Councelling"
// }
// ).then(()=>{

//     console.log("Database connected Successfully");
// })
// .catch(()=>{
//     console.log("Database can not be connceted");
// })



// app.get("/",(req,res)=>{
//     res.render("home")
// })
// app.get("/signup",(req,res)=>{
//     res.render("signup");
// });

// app.post("/signup",async (req,res)=>{
//    const data={
//     name:req.body.name,
//     email:req.body.email,
//     password:req.body.password,
//     percentile:req.body.percentile,
//     branches:req.body.branches
//    }
//    const existUser=await collection.findOne({email:data.email});
//     if(existUser){
//         return res.send(`<script>alert("User already exists! Try another email."); window.location.href="/signup";</script>`);
//     }
//     else{

//        const saltRounds=10;
//        const hashpassword= await bcrypt.hash(data.password,saltRounds);
//        data.password=hashpassword;
//    const userdata =await collection.insertMany(data);

//    console.log(userdata);
// //    res.send("User registered successfully");
// res.send(`<script>alert("User registered successfully!"); window.location.href="/login";</script>`);
//     }
// });

//  //for login

//  app.post("/login", async (req, res) => {
//     try {
//       const check = await collection.findOne({ email: req.body.email }); 
  
//       if (!check) {
//         return res.send("User not found");
//       }
  
//       const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
  
//       if (isPasswordMatch) {
//         req.session.user = check; 
//         res.redirect("/dashboard"); 
//       }
//        else {
//         return res.send("Wrong Password");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       res.send("Something went wrong");
//     }
//   });
  
// app.get("/login",(req,res)=>{
//     res.render("login");
// });

// app.get("/dashboard", (req, res) => {
//   const user = req.session.user;
//   if (!user) {
//     return res.send("No user session found. Please log in.");
//   }
//   res.render("dashboard", { user });
// });

// const port=3000;
// app.listen(port,()=>{
//     console.log(`Server is running on Port ${port}`);
// })




import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import collection from './config.js';
import session from "express-session";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SESSION_SECRET || "default-secret", // from env
  resave: false,
  saveUninitialized: false,
}));

app.use(express.json());

// Connect to MongoDB using env variable
mongoose.connect(process.env.MONGODB_URI, {
  dbName: "Councelling",
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Database connected Successfully"))
.catch(err => console.error("❌ Database connection failed:", err));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    percentile: req.body.percentile,
    branches: req.body.branches
  };

  const existUser = await collection.findOne({ email: data.email });
  if (existUser) {
    return res.send(`<script>alert("User already exists! Try another email."); window.location.href="/signup";</script>`);
  } else {
    const saltRounds = 10;
    const hashpassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashpassword;

    const userdata = await collection.insertMany(data);
    console.log(userdata);
    res.send(`<script>alert("User registered successfully!"); window.location.href="/login";</script>`);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.email }); 
    if (!check) {
      return res.send("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    if (isPasswordMatch) {
      req.session.user = check; 
      res.redirect("/dashboard"); 
    } else {
      return res.send("Wrong Password");
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.send("Something went wrong");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.send("No user session found. Please log in.");
  }
  res.render("dashboard", { user });
});

// Use PORT from env or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on Port ${port}`);
});
