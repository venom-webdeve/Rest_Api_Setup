const express = require("express");
const body_parser = require("body-parser");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const indexRoutes = require('./routes/router.index');

dotenv.config();
const app = express();
// env setup
const port = process.env.PORT || 3300;
const dbUrl = process.env.MONGODB_URI;

// x-www-urlencoded data
app.use(body_parser.urlencoded({ extended: true }));
// body form data
app.use(body_parser.json());

// cors config
app.use(cors());
app.use(express.json());

// database connection
mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log("database connected to db");
})

// Routes config
app.use('/api/',indexRoutes);

app.listen(port, () => {
    console.log(' server started on: ' + port);
});


