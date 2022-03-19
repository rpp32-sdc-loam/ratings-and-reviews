var {getProductReviews, getProductReviewMetadata, postReview, markReviewHelpful, reportReview} = require('../../database/index.js');

/*exports.<function name> = (req, res) => {

}*/
exports.getReviews = (req, res) => {
  var options = {product_id: req.query.product_id,
     count: req.query.count,
      page: req.query.page,
      sort: req.query.sort}

  getProductReviews(options, (err, result) => {
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
      res.status(500).send(err);
    } else {
      res.status(200).send(metaData);
    }
  })
}
//expecting product_id


exports.postReview = (req, res) => {
  console.log('review post', req.body);
  postReview(req.body, err => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(201);
    }
  });
}
//expecting product_id, as well as pertinant review info (rating, summary, etc)

/*

req.body =
review post {
  product_id: 64620,
  rating: 5,
  summary: 'test',
  body: 'test text to test texting test of testing text test',
  recommend: true,
  name: 'test',
  email: 't@t.com',
  photos: [],
  characteristics: { '216798': 1, '216799': 1, '216800': 1, '216801': 1 }
}
*/


exports.putReview = (req, res) => { //mark as helpful
  console.log('put helpful review', req.params.review_id);
  var options = {
    review_id: req.params.review_id
  }
  markReviewHelpful(options, err => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send('NO CONTENT');
    }
  })
}
exports.reportReview = (req, res) => { //PUT request to report a review
  console.log('put report review', req.params.review_id);
  var options = {
    review_id: req.params.review_id
  }
  reportReview(options, err => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(204).send('NO CONTENT');
    }
  })
}