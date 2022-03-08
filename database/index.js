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
exports.getProductReviews = (params, callback) => {//return all reviews for the provided product.
  pool.query(`select * from reviews where product_id=${params.product_id}`)
    .then(reviews => {
      pool.query(`select reviewphotos.id, reviewphotos.url from reviewphotos where review_id=${reviews.rows[0].id}`)
      .then(photos => {
        var result = {
          reviews: reviews.rows,
          photos: photos.rows
        };
        callback(undefined, result);
      })
      .catch(err => {
        callback(err);
      })
    })
    .catch(err => {
      callback(err);
    })
} //expecting page (int default 1) count (int default 5)
//sort (string 'newest' 'helpful' 'relevant') product_id (integer of product to give reviews of)
/*
  count is how many reviews per page
  page starts at 0

  so page 1, count 4 means return reviews number 5, 6, 7, 8 (4, 5, 6, 7 if 0-based indexing)

  sorting:
    newest based on date
    relevant needs more in depth research: https://www.postgresql.org/docs/9.1/textsearch-controls.html
    helpful based on helpfullness
    default based on helpfullness


  ==EXAMPLE RETURN==
  {
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    },
    // ...
  ]
}
*/
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