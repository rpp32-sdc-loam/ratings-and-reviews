var {getProductReviews, getProductReviewMetadata, postReview, markReviewHelpful, reportReview} = require('../../database/index.js');

/*exports.<function name> = (req, res) => {

}*/
exports.getReviews = (req, res) => {
  getProductReviews({product_id: req.query.product_id}, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
}
 //expecting page (int default 1) count (int default 5)
//sort (string 'newest' 'helpful' 'relevant') product_id (integer of product to give reviews of)


exports.getReviewsMeta = (req, res) => {
  console.log('review meta get', req.query);
  res.sendStatus(200)
}
//expecting product_id


exports.postReview = (req, res) => {
  console.log('review post', req.query);

  res.sendStatus(201)
}
//expecting product_id, as well as pertinant review info (rating, summary, etc)


exports.putReview = (req, res) => { //mark as helpful
  console.log('put helpful review', req.params.review_id);
  res.sendStatus(204)
}
exports.reportReview = (req, res) => { //PUT request to report a review
  console.log('put report review', req.params.review_id);
  res.sendStatus(204)
}