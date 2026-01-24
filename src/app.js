require("dotenv").config();
const express = require('express')
const app = express();
const cors = require('cors');
const connectMongoDb = require("./configure/connectMongoDb");
const cookieParser = require('cookie-parser');


//routes
const adminAuthRoutes = require('./routes/adminAuth');
const inquiryRoutes = require('./routes/inquiry');
const uploadRoutes = require('./routes/upload');
const propertyRoutes = require('./routes/property');


// const dotenv = require("dotenv")
// const path = require("path")

// dotenv.config({ path: path.join(__dirname, "../.env") })


//connect db
connectMongoDb();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//accessing another domain req and send res
app.use(cors({
    origin:["http://localhost:3000"],
    methods:['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials:true
}));


app.use('/', adminAuthRoutes);
app.use('/',inquiryRoutes);
app.use('/',uploadRoutes);
app.use('/',propertyRoutes);

//local port address
app.listen(8000, () => {
 console.log('Started server...');
})

