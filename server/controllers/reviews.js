var {getProductReviews, getProductReviewMetadata, postReview, markReviewHelpful, reportReview} = require('../../database/index.js');

/*exports.<function name> = (req, res) => {

}*/
exports.getReviews = (req, res) => {
  getProductReviews({product_id: req.query.product_id}, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {

      var getRequestResultObject = {
        product_id: req.query.product_id,
        page: req.query.page,
        count: req.query.count,
        results: []
      };

      for (var photo in result.photos) {
        for (var review in result.reviews) {
          if (result.photos[photo].review_id === result.reviews[review].review_id) {
            if (result.reviews[review].photos === undefined) {
              result.reviews[review].photos = [];
            }
            result.reviews[review].photos.push({
              url: result.photos[photo].url,
              id: result.photos[photo].id,
              review_id: result.photos[photo].review_id
            })
          }
        }
      }
      getRequestResultObject.results = result.reviews;
      //console.log(getRequestResultObject);
      res.status(200).send(getRequestResultObject);
    }
  });
}
 //expecting page (int default 1) count (int default 5)
//sort (string 'newest' 'helpful' 'relevant') product_id (integer of product to give reviews of)


exports.getReviewsMeta = (req, res) => {
  console.log('review meta get', req.query);
  var queryParams = {
    product_id: req.query.product_id
  }
  getProductReviewMetadata(queryParams, (err, metaData) => {
    if (err) {
      console.log(err);
    } else {
      console.log(metaData);
    }
  })
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