'use strict';

var Blog = require('../models/blog');
var Keyword = require('../models/keywords');
var User = require('../models/user');
var Subscriber = require('../models/subscribers');
var auth = require('../lib/authenticate');
var nodemailer = require('nodemailer');
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var T = require('../lib/twitter');

function checkUser(req, res, next){
  Blog.findById(req.params.blog, (err, blog) => {
    if (blog.authorId === req.decodedToken._id) {
      next();
    } else {
      res.write('Permission Denied');
      res.end();
    }
  });
}

module.exports = (router) => {

  router.post('/blogs', auth, (req, res) => {
    console.log('blogs POST route hit');
    console.log(req.body.keywords);
    var keys;
    if(req.body.keywords){
      try {
        keys = req.body.keywords.split(' ');
      }
      catch (e) {
        keys = req.body.keywords;
      }
    }

    var blog = new Blog(req.body);
    // finding author name from header token
    User.findOne({_id: req.decodedToken._id})
      .then(user => {
        req.user = user;
        blog.author = user.name;
        blog.authorId = req.decodedToken._id;
        blog.save(function(err, data) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }
          // tweets article
          T.post('statuses/update', { status: 'New article from ' + user.name + ' http://sportsblog.herokuapp.com/#/blogs/' + data._id}, function(err, data){
            if (err) console.log(err);
            console.log(data);
          });
          //adds article to 'authored' list
          User.findByIdAndUpdate(req.decodedToken._id, {$push: {'authored': data._id}}, (err) => {
            if(err) console.log(err);
          });
          //adds article to every follower's newContent list
          user.followedBy.forEach((follower) => {
            User.findByIdAndUpdate(follower, {$push: {'newContent': data._id}}, (err) => {
              if(err) console.log(err);
              console.log('articles added to followers content list');
            });
          });
          //creates new keyword or adds article to existing
          keys.forEach((key) => {
            Keyword.findOne({keyword: key}, (err, keyword) => {
              if (err) console.log(err);
              if(!keyword && key.length > 0) {
                var newKeyword =  new Keyword(
                  {
                    keyword: key,
                    articles: [data._id]
                  });
                newKeyword.save((err, data) => {
                  if(err) console.log(err);
                  console.log('Saved!');
                  console.log(data);
                  res.end();
                });
              } else if (keyword) {
                Keyword.findOneAndUpdate({keyword: key}, {$push: {'articles': data._id}}, (err, keyword) => {
                  //add article to newContent of users following keyword
                  keyword.followedBy.forEach((follower) => {
                    User.findByIdAndUpdate(follower, {$addToSet: {'newContent': data._id}}, (err) => {
                      if(err) console.log(err);
                    });
                  });
                  if(err) console.log(err);
                });
              }
            });
          });
          res.json(data);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(418).json({msg: err});
      });
    //sending email to users with new blog posting
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sportsblogcf@gmail.com',
        pass: process.env.SPORTS_PASS
      }
    });
    Subscriber.find({}, (err, subscribers) => {
      subscribers.forEach((subscriber) => {
        var mailOptions = {
          from: 'Sports Blog <sportsblogcf@gmail.com>',
          to: subscriber.email,
          subject: 'New Sports Blog Post! '+req.body.title,
          text: 'Here is the latest Sports Blog Post! Title: '+req.body.title+ ' Content: '+req.body.content,
          html: '<h2>Here is the latest Sports Blog Post!</h2><ul><li>Title: '+req.body.title+'</li><li>Content: '+req.body.content+'</li></ul>'
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if(error) {
            console.log(error);
          } else {
            console.log('Message Sent: ' + info.response);
          }
        });
      });
    });
  })

  .put('/blogs/:blog', auth, (req, res) => {
    var blogId = req.params.blog;
    var newBlogInfo = req.body;
    Blog.update({_id: blogId}, newBlogInfo, function(err, blog) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: err});
      }
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).json({msg: 'Unable to locate ' + blogId });
      }
    });
  })

  .put('/blogs/:blog/images', auth, (req, res) => {
    var imgData = [];
    var fileContent;
    req.on('data', (data) => {
      console.log(data);
      imgData.push(data);
    }).on('end', () =>{
      fileContent = Buffer.concat(imgData);
      var s3 = new AWS.S3();
      if (fileContent.length === 0){
        res.send('upload failed');
        return res.end();
      }
      // change bucketname!
      var params = {Bucket: 'sportsysports', Key: req.params.blog + '-' + req.headers.position, Body:fileContent, ACL:'public-read'};
      s3.upload(params,(err, uploadData) => {
        if (err) {
          res.send(err);
          return res.end();
        }
        if (uploadData) {
          var pos = uploadData.key.split('-')[1];
          var update = {};
          update[pos] = uploadData.Location;
          console.log(update);
          console.log(req.params.blog);
          Blog.findByIdAndUpdate(req.params.blog, {$set: update}, {new: true}, (err, thisblog)=> {
            if(err) console.log(err);
            console.log(thisblog);
          });
          res.json(uploadData);
          res.end();
        } else {
          res.write('upload failed');
          res.end();
        }
      });
    });
  })


  .delete('/blogs/:blog', auth, checkUser, (req, res) => {
    var blogId = req.params.blog;
    var key = blogId + '-';
    var s3 = new AWS.S3();
    var params = {
      Bucket:'sportsysports',
      Delete: {
        Objects: [{Key: key + 'primary'},{Key: key + 'secondary'},{Key: key + 'titleImage'}]
      }
    };
    Blog.findOne({_id: blogId}, function(err, blog) {
      console.log(blog.keywords[0]);
      var keys = blog.keywords[0].split(' ');
      if (err){
        console.log(err);
        res.status(500).json(err);
      }
      //removes article from follows newContent
      User.update({$pull: {'newcontent': blogId}}, (err) => {
        if(err) console.log(err);
        console.log('pulled');
      });
      //deletes images from s3
      s3.deleteObjects(params, (err, data) => {
        if(err) console.log(err);
        if(data) console.log(data);
      });
      //removes article from keys
      keys.forEach((key) => {
        Keyword.findOne({keyword: key}, (err, keyword) => {
          if (err) console.log(err);
          if(keyword) {
            Keyword.findOneAndUpdate({keyword: key}, {$pull: {'articles': blogId}}, (err) => {
              if(err) console.log(err);
              if(keyword.articles.length === 1) {
                keyword.remove();
              }
            });
          }
        });
      });
      blog.remove();
      res.json({msg: 'Blog was removed'});
    });
  })
  //get all
  .get('/blogs', (req, res) => {
    Blog.find({})
    .populate('comments')
    .exec(function(err, data) {
      console.log('blog get route hit');
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal Server Error'});
      }
      res.json(data);
    });
  })

  .get('/blogs/:blog', (req, res) => {
    var blogId = req.params.blog;
    Blog.findOne({_id: blogId})
      .populate('comments')
      .exec(function(err, blog) {
        if (err) {
          console.log(err);
          res.status(500).json({msg: 'Internal server error'});
        }
        if (blog) {
          res.json(blog);
        } else {
          res.status(404).json({msg: 'Unable to locate ' + blogId});
        }
      });
  })

  //subscriber routes
  .post('/subscribe', (req, res) => {
    var subscriber = new Subscriber(req.body);
    var subEmail = req.body.email;
    Subscriber.findOne({email: subEmail}, (err, email) => {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal server error'});
      }
      if (email) {
        res.status(400).json({msg: 'Already Subscribed'});
      }
      if (!email) {
        console.log(req.body.email);
        subscriber.save(function(err, sub) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }
          res.json(sub);
        });
      }
    });
  })

  .post('/unsubscribe', (req, res) => {
    var unSub = req.body.email;
    console.log(req.body.email);
    Subscriber.findOne({email: unSub}, (err, email) => {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'Internal server error'});
      }
      if (email) {
        email.remove();
        res.json({msg: 'You are unsubscribed'});
      }
      if (!email) {
        res.json({msg: 'Not a subscriber'});
      }
    });
  });
};
