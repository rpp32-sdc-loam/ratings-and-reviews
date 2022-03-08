var express = require('express');
const path = require('path');
const app = express()
//var <func names> = require('./controllers/reviews.js')
var {getReviews, getReviewsMeta, postReview, putReview, reportReview} = require('./controllers/reviews.js');

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

module.exports = app;