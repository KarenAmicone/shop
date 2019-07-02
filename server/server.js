//Express application. 
const express = require('express');

//Gets the information from requests and parses them. 
//to whatever you want your server to receive in POST/PUT requests (JSON, URL encoded, text, raw).
const bodyParser = require('body-parser');

//The cookie parser parses cookies and puts its information on req object in the middleware. 
//It will also decrypt signed cookies provided.
const cookieParser = require('cookie-parser');

//Fires express
const app = express();

//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.Promise = global.Promise;

//Database is an env variable declared on .env
mongoose.connect(process.env.DATABASE,
    { useNewUrlParser: true, useCreateIndex: true }, (err) => {
        if(err) return err
        console.log("Conectado a MongoDB")
    })

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 
app.use(cookieParser());

//--------------------------Models--------------------------
const { User } = require('./models/user');

//---------------------------Users---------------------------
//It creates a new user schema, wrap the data for the json and store it

//Auth route

app.get('/api/users/auth', (req, res) => {

})


app.post('/api/users/register', (req, res)=>{
    const user = new User(req.body);
    user.save((err,doc)=>{
        if(err) return res.json({success: false, err})
        res.status(200).json({
            success: true,
            userdata: doc
        });
    });
});

app.post('/api/users/login', (req, res) => {
    //find the email
    User.findOne({'email':req.body.email}, (err, user)=>{
        if(!user) return res.json({
            loginSuccess: false, 
            message: 'Auth failes, email not found'});
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch) return res.json({
                loginSuccess: false, 
                message: 'Wrong password'
            });
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('ex_auth', user.token).status(200).json({
                    loginSuccess: true
                })
            })
        }) 
    });
})

//The server needs a port, if we don't have it, We're going to run it on the port 3002
const port = process.env.PORT || 3002;

//Here, the app listens to the port
app.listen(port, () => {
    console.log(`Server running at ${port}`)
})
