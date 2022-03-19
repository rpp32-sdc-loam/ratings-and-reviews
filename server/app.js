var express = require('express');
const path = require('path');
var cors = require('cors');
const app = express()
//var <func names> = require('./controllers/reviews.js')
var {getReviews, getReviewsMeta, postReview, putReview, reportReview} = require('./controllers/reviews.js');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.end()
})

//app.<http form>(<pathname>, <function>);
app.get('/reviews', getReviews);
app.get('/reviews/meta', getReviewsMeta);
app.post('/reviews', postReview);
app.put('/reviews/:review_id/helpful', putReview);
app.put('/reviews/:review_id/report', reportReview);

//dummy response to get client to work
app.get('/product/:product_id', (req, res) => {
  res.data.name = 'Product Name';
  res.send(200);
})

//verification for loaderio
app.get('/loaderio-25f6cb3cdbf086e17d14c8e46db5cee4', (req, res) => {
  var options = {
    root: path.join(__dirname)
  }

  var fileName = 'loaderio.txt';
  res.sendFile(fileName, options, err => {
    if (err) {
      console.log(err);
    }
  });
})

module.exports = app;