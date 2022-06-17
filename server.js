/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part 
* Of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* [Name: Vaibhavkumar Patel]  [Student ID: 139768204 ]     [Date: 17/06/2022]
*
* Online (Heroku) Link: 
______https://salty-meadow-49537.herokuapp.com/__________________________________________________
*
********************************************************************************/ 

var path = require('path');
var express = require('express')
var app = express()
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
var PORT = process.env.PORT || 8080

app.use(express.static('public'));
const { 
    initialize, getCategories, addPost, getAllPosts, getPostById, getPostsByCategory,getPostsByMinDate, getPublishedPosts, 
} = require('./blog-service')


cloudinary.config({
    cloud_name: 'didub3u0m',
    api_key: '519429116233389',
    api_secret: 'q0YSHK4Ku-Fu1B4q6Rme5wD6Iys',
    secure: true
   });


const upload = multer();

initialize().then(({msg}) => {
    app.listen(PORT, () => console.log(`${msg}, Express HTTP server is listening on port ${PORT}`))
}).catch((err)=> {
    console.log(err);
});

app.get('/',(req,res) => {
    res.redirect('/about')
});

app.get('/about',(req,res) =>{
    res.sendFile(path.join(__dirname+'/views/about.html'));
});

app.get('/blog', async (req,res)=> {
    getPublishedPosts()
    .then((posts) => res.json(posts))
    .catch((err)  => console.log(err))
});

app.get('/posts', async (req,res)=> {

    if(req.query.minDate != null){
        getPostsByMinDate(req.query.minDate)
        .then((posts) => res.json(posts))
        .catch((err)=> console.log(err))
    }

    if(req.query.category != null){
        getPostsByCategory(req.query.category)
        .then((posts) => res.json(posts))
        .catch((err)=> console.log(err))
    }

    getAllPosts()
    .then((posts) => res.json(posts))
    .catch((err)=> console.log(err))
});

app.get('/categories', async (req,res)=> {
    getCategories()
    .then((categories) => res.json(categories))
    .catch((err)=> console.log(err))
});


app.get('/posts/add',function(req,res) {
    res.sendFile(path.join(__dirname+'/views/addPost.html'));
});

app.post('/posts/add',upload.single("featureImage"),function(req,res) {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }

    upload(req).then((uploaded)=> {
        req.body.featureImage = uploaded.url;
        const { title, body, category, published, featureImage  } = req.body;
        post = {
            title, 
            body, 
            category, 
            published, 
            featureImage
        }
        addPost(post)
        .then((data) => res.json(data))
        .catch((err)=> console.log(err))
    });
});



app.get('/posts/:value', async (req,res)=> {
    if(req.params.value != null){
        getPostById(req.params.value)
        .then((posts) => res.json(posts))
        .catch((err)=> console.log(err))
    } else {
        console.log('Value not found')
    }
    
});






