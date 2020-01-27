//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//Some random texts as initial contents of the blog
const homeStartingContent = "Welcome to my healthy blog! This is the home for people who care about themselves.";
const aboutContent = "This blog is dedicated to active people with healthy lifestyles in order to inspire others.";
const contactContent = "You can contact me via links mentioned below:";

const app = express();

//utilising ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//create MongoDB schema
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

//getting homepage
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

//compose a post
app.get("/compose", function(req, res){
  res.render("compose");
});

//saving the composed post
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

//getting each post page by the post ID from the database
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

//getting the 'about' page
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//getting the 'contact' page
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

//setting up the server
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
