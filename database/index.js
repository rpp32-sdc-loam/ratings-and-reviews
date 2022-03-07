var {Pool, Client} = require('pg');

const pool = new Pool({
  user: 'wlessley',
  host: 'localhost',
  database: 'ratingsReviews',
  port:5432
})

/*pool.query('SELECT * FROM reviews WHERE id=75', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
})/* */


//param === {<insert expected parameters>}
exports.getProductReviews = (params) => {//return all reviews for the provided product.
  console.log('get product reviews');
} //expecting page (int default 1) count (int default 5)
//sort (string 'newest' 'helpful' 'relevant') product_id (integer of product to give reviews of)

exports.getProductReviewMetadata = (params) => { //return meta data for a products reviews
  console.log('get product review metadata');
} //expecting product_id

exports.postReview = (params) => { //post a review for a product
  console.log('psot product reviews');
} //expecting product_id, as well as pertinant review info (rating, summary, etc)

exports.markReviewHelpful = (params) => { //mark a review as helpful
  console.log('mark review helfpul');
} //expecting review_id

exports.reportReview = (params) => { //report a review
  console.log('report reviev');
} //expecting review_id