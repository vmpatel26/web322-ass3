var posts = []
var categories = []
var path = require("path")
const fs = require("fs"); // required at the top of your module 

function initialize(){
    posts = JSON.parse(fs.readFileSync('./data/posts.json').toString());
    categories = JSON.parse(fs.readFileSync('./data/categories.json').toString());

    return new Promise((resolve, reject)=> {
        if (posts && categories) {
            resolve({msg: 'Successfully connected'})
        } else {
            reject({msg: 'Something wrong!'})
        }
    })
}

const getPublishedPosts =() =>{
    return new Promise((resolve, reject)=> {
         if (posts.length != 0) {
             resolve(posts.filter(post => post.published == true))
         } else {
             reject({msg: '0 data found'})
         }
     })
 };

const getAllPosts = () =>{
    return new Promise((resolve, reject)=> {
        if (posts.length != 0) {
            resolve(posts)
        } else {
            reject({msg: '0 data found'})
        }
    })
};



const getCategories =() =>{
    return new Promise((resolve, reject)=> {
        if (categories.length != 0) {
            resolve(categories)
        } else {
            reject({msg: '0 data found'})
        }
    })
};

const addPost = (postData) =>{
    return new Promise((resolve, reject)=> {
        if(postData!= null){
            if (postData.published == undefined) {
                postData.published = false
            } 
            postData.id = posts.length+1;
            posts.push(postData)
            resolve(postData)
        } else {
            reject({msg: '0 data found'})
        }
    })
};

const getPostsByCategory =(category) =>{
    return new Promise((resolve, reject)=> {
         if (posts.length != 0) {
             let categoryPost = posts.filter(post => post.category == category)
             resolve(categoryPost)
         } else {
             reject({msg: '0 data found'})
         }
     })
 };

 const getPostsByMinDate =(minDateStr) =>{
    return new Promise((resolve, reject)=> {
         if (posts.length != 0) {
            datedPosts = posts.filter(post => post.postDate >= minDateStr)
             resolve(datedPosts)
         } else {
             reject({msg: '0 data found'})
         }
     })
 };

const getPostById =(id) =>{
    return new Promise((resolve, reject)=> {
         if (posts.length != 0) {
            postIds = posts.filter(post => post.id == id)
             resolve(postIds)
         } else {
             reject({msg: '0 data found'})
         }
     })
 };

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostById, getPostsByCategory, getPostsByMinDate 
}