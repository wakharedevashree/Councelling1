import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Url from './config.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect('mongodb+srv://diyawakhare27:sVOTneQH5uU2Q4S1@cluster0.psv4hdz.mongodb.net/', {
    dbName: "NodeJs_Mastery_Course",
}).then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Rou
app.get("/", (req, res) => {
    res.render("home"); // Renders home.
});


app.get("/login", (req, res) => {
    res.render("login", { error: req.query.error });
});

app.get("/signup", (req, res) => {
    res.render("signup", { error: req.query.error });
});
// app.get('/login', (req, res) => {
//   res.render('login'); // This renders login.ejs
// });


// Signup User
app.post("/signup", async (req, res) => {
    try {
        // Check if user exists
        const existingUser = await Url.findOne({ email: req.body.email });
        if (existingUser) {
            return res.redirect("/signup?error=email_exists");
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create new user
        const newUser = await Url.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            percentile: req.body.percentile,
            branches: Array.isArray(req.body.branches) 
                        ? req.body.branches 
                        : [req.body.branches]
        });

        console.log("User registered:", newUser);
        res.redirect("/?success=1");
    } catch (error) {
        console.error("Signup error:", error);
        res.redirect("/signup?error=signup_failed");
    }
});

// Login User
app.post("/login", async (req, res) => {
    try {
        const user = await Url.findOne({ email: req.body.email });
        
        if (!user) {
            return res.redirect("/signup?error=email_not_found");
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        
        if (passwordMatch) {
            // Successful login - render dashboard or redirect
            return res.render("dashboard", { user });
        } else {
            return res.redirect("/?error=wrong_password");
        }
    } catch (error) {
        console.error("Login error:", error);
        res.redirect("/?error=login_error");
    }
});

// Start Server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

