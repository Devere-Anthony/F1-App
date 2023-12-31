// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const { flash } = require('express-flash-message');

const app = express();
const PORT = process.env.PORT || 3000;

// database connection
mongoose.connect('mongodb+srv://dawresearch:RgKcegBpllj4XWDf@f1-cluster.q5oqrw9.mongodb.net/');
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database!"));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// static
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(
    session({
        secret: 'f1cr-ims',
        saveUninitialized: true,
        resave: false,
    })
);

// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));

// set template engine
app.set('view engine', 'ejs');

// route prefix
app.use("", require("./routes/routes"));





app.listen(PORT, () => {
    console.log(`App up at http://localhost:${PORT}`);
});