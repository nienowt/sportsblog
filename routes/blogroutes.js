'use strict';

var Blog = require('../models/blog');
var Keyword = require('../models/keywords');
var User = require('../models/user');
var Img = require('../models/images-model');
var auth = require('../lib/authenticate');
var nodemailer = require('nodemailer');
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
// var T = require('../twitter');

module.exports = (router) => {

  router.post('/blogs', auth, (req, res) => { //replace auth! !!!
    console.log('blogs POST route hit');
    console.log(req.body.keywords);
    var keys = req.body.keywords.split(' ');

    var blog = new Blog(req.body);
    // finding author name from header token
    User.findOne({_id: req.decodedToken._id})
      .then(user => {
        req.user = user;
        blog.author = user.name;
        blog.save(function(err, data) {
          if (err) {
            console.log(err);
            res.status(500).json(err);
          }
          // tweets article
          // T.post('statuses/update', { status: 'New article from ' + user.name + ' http://localhost:3000/blogs/' + data._id}, function(err, data){
          //   if (err) console.log(err);
          //   console.log(data);
          // });
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
                Keyword.findOneAndUpdate({keyword: key}, {$push: {'articles': data._id}}, (err) => {
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
    var mailOptions = {
      from: 'Sports Blog <sportsblogcf@gmail.com>',
      to: 'sportsfanCF41@gmail.com',
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
          console.log(pos);
          console.log(typeof pos);
          var newImage = new Img({position: pos, location: uploadData.Location});  //save image in mongo
          newImage.save((err) => {
            if(err) console.log(err);

            var update = {};
            update[pos] = uploadData.Location;
            console.log(update);
            Blog.findByIdAndUpdate(req.params.blog, {$set: update}, {new: true}, (err, blog)=> {
              if(err) console.log(err);
              console.log(blog);
            });
          });
          res.json(uploadData);
          res.end();
        } else {
          res.write('nope');
          res.end();
        }
      });
    });
  })


  .delete('/blogs/:blog', auth, (req, res) => {
    var blogId = req.params.blog;

    Blog.findOne({_id: blogId}, function(err, blog) {
      console.log(blog.keywords[0]);
      var keys = blog.keywords[0].split(' ');
      if (err){
        console.log(err);
        res.status(500).json(err);
      }
      User.update({$pull: {'newcontent': blogId}}, (err) => { //replaced commented out code
        if(err) console.log(err);
        console.log('pulled');
      });
      // blog.images.forEach((image) => {
      //   Img.findOne(image, (err, data) => {
      //     var key = blogId + '-' + data.position;
      //     var s3 = new AWS.S3();
      //     var params = {
      //       Bucket:'sportsblogimages',
      //       Delete: {
      //         Objects: [{Key:key}]
      //       }
      //     };
      //     s3.deleteObjects(params, (err, data) => {
      //       if(err) console.log(err);
      //       if(data) console.log(data);
      //     });
      //     data.remove();
      //   })
      // })
      // User.findOne(blog.author, (err, user) => {
      //   user.followedBy.forEach((follower) => {
      //     User.findByIdAndUpdate(follower, {$pull: {'newContent': blogId}}, (err) => { //pull might work without going through each follower eg. blog.find(all)/update - pull newcontent blogid
      //       if(err) console.log(err);
      //       console.log('article removed from followers content arrays');
      //     });
      //   });
      // });
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
};
