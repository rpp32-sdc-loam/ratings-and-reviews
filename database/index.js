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
  pool.query(`select * from reviews where product_id=${params.product_id} and reported=false limit ${params.count} desc offset ${params.page * params.count} rows`)
    .then(reviews => {
      var ids = '(';
      for (var row in reviews.rows) {
        ids += reviews.rows[row].review_id.toString() + ',' ;
      }
      var queryString = `select * from reviewphotos where review_id in ${ids.substr(0,ids.length -1 ) + ')'}`
      //select reviewphotos.id, reviewphotos.url from reviewphotos where review_id in ${ids}
      //                                                                              (72,73,74,75)

      pool.query(queryString)
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
exports.getProductReviewMetadata = (params, callback) => { //return meta data for a products reviews
  console.log('get product review metadata');

  pool.query(`SELECT reviews.rating, reviews.recommend, characteristics.name, characteristics_reviews.review_id, characteristics_reviews.characteristic_id, characteristics_reviews.value FROM characteristics
  INNER JOIN characteristics_reviews ON characteristics.id=characteristics_reviews.characteristic_id
  INNER JOIN reviews ON reviews.product_id=characteristics.product_id
  WHERE characteristics.product_id=${params.product_id}
  ORDER BY characteristics.id ASC;`)
  .then(characteristics => {
    var metadata = {
      product_id: params.product_id,
      ratings: {},
      recommended: {},
      characteristics: {}

    }
    for (var charac in characteristics.rows) {
      if (metadata.characteristics[characteristics.rows[charac].name]) {//already populated in metadata obj
        metadata.characteristics[characteristics.rows[charac].name].value += characteristics.rows[charac].value;
        metadata.characteristics[characteristics.rows[charac].name].count += 1;
      } else {//not yet populated in metadata obj
        metadata.characteristics[characteristics.rows[charac].name] = {
          value: characteristics.rows[charac].value,
          count: 1,
          id: characteristics.rows[charac].characteristic_id
        }
      }
    }
    let count;
    // metadata.ratings[characteristics.rows[charac].rating] /= count;
    // metadata.recommended[characteristics.rows[charac].recommend] /= count;

    for (var charac in metadata.characteristics) { //averaging values for characteristics
      count = metadata.characteristics[charac].count
      metadata.characteristics[charac].value /= count;
      delete metadata.characteristics[charac].count;
    }

    pool.query(`select rating, recommend from reviews where product_id=${params.product_id}`)
    .then(ratings => {

      console.log(ratings.rows);
      callback(null, metadata);
    })
  })
  .catch(err => {
    callback(err);
  })
} //expecting product_id

/*
using characteristics and characteristics_reviews tables
first use product id to find all the characteristics ids
use those to query for each id/value for itself.
structure will be v similar to normal get request

literally ignore all of that up above
inner join is beautiful
SELECT * FROM characteristics
  INNER JOIN characteristics_reviews ON characteristics.id=characteristics_reviews.characteristic_id
  WHERE characteristics.product_id=75
  ORDER BY characteristics.id ASC;

SELECT * FROM characteristics
  INNER JOIN characteristics_reviews ON characteristics.id=characteristics_reviews.characteristic_id
  INNER JOIN reviews ON reviews.product_id=characteristics.product_id
  WHERE characteristics.product_id=75
  ORDER BY characteristics.id ASC;

returns:
|      CHARACTERISTCS       |           CHARACTERSTICS_REVIEWS            |
 id  | product_id |  name   |  id  | characteristic_id | review_id | value
-----+------------+---------+------+-------------------+-----------+-------
 264 |         75 | Fit     | 1243 |               264 |       361 |     3
 264 |         75 | Fit     | 1247 |               264 |       362 |     3
 264 |         75 | Fit     | 1251 |               264 |       363 |     1
 264 |         75 | Fit     | 1255 |               264 |       364 |     5
 264 |         75 | Fit     | 1259 |               264 |       365 |     3
 265 |         75 | Length  | 1244 |               265 |       361 |     4
 265 |         75 | Length  | 1248 |               265 |       362 |     2
 265 |         75 | Length  | 1252 |               265 |       363 |     2
 265 |         75 | Length  | 1256 |               265 |       364 |     5
 265 |         75 | Length  | 1260 |               265 |       365 |     4
 266 |         75 | Comfort | 1245 |               266 |       361 |     3
 266 |         75 | Comfort | 1249 |               266 |       362 |     1
 266 |         75 | Comfort | 1253 |               266 |       363 |     2
 266 |         75 | Comfort | 1257 |               266 |       364 |     2
 266 |         75 | Comfort | 1261 |               266 |       365 |     2
 267 |         75 | Quality | 1246 |               267 |       361 |     5
 267 |         75 | Quality | 1250 |               267 |       362 |     4
 267 |         75 | Quality | 1254 |               267 |       363 |     3
 267 |         75 | Quality | 1258 |               267 |       364 |     2
 267 |         75 | Quality | 1262 |               267 |       365 |     2
(20 rows)


just change * to be whatever columns are pertinant and boom, one request instead of 2 requests

filtered query with added inner join of reviews table for ratings/recommend columns
 rating | recommend |  name   | characteristic_id | value
--------+-----------+---------+-------------------+-------
      4 | t         | Quality |                 5 |     4
      4 | t         | Quality |                 5 |     5
      4 | t         | Quality |                 5 |     5
      4 | t         | Quality |                 5 |     3
      4 | t         | Quality |                 5 |     4
      4 | t         | Quality |                 5 |     4
      4 | t         | Quality |                 5 |     5
      4 | t         | Quality |                 5 |     5
      4 | t         | Quality |                 5 |     3
      4 | t         | Quality |                 5 |     4
      3 | t         | Quality |                 5 |     4
      3 | t         | Quality |                 5 |     5
      3 | t         | Quality |                 5 |     5
      3 | t         | Quality |                 5 |     3
      3 | t         | Quality |                 5 |     4
      5 | f         | Quality |                 5 |     4
      5 | f         | Quality |                 5 |     5
      5 | f         | Quality |                 5 |     5
      5 | f         | Quality |                 5 |     3
      5 | f         | Quality |                 5 |     4
      2 | f         | Quality |                 5 |     4
      2 | f         | Quality |                 5 |     5
      2 | f         | Quality |                 5 |     5
      2 | f         | Quality |                 5 |     3
      2 | f         | Quality |                 5 |     4


expected response
{
  "product_id": "2",
  "ratings": {
    2: 1,
    3: 1,
    4: 2,
    5: 1
  },
  "recommended": {
    false: 2,
    true: 3
  },
  "characteristics": {
    "Size": {
      "id": 14,
      "value": "4.0000"
    },
    "Width": {
      "id": 15,
      "value": "3.5000"
    },
    "Comfort": {
      "id": 16,
      "value": "4.0000"
    },
    // ...
}
*/

exports.postReview = (params) => { //post a review for a product
  console.log('pot product reviews');
} //expecting product_id, as well as pertinant review info (rating, summary, etc)

exports.markReviewHelpful = (params) => { //mark a review as helpful
  console.log('mark review helfpul');
} //expecting review_id

exports.reportReview = (params) => { //report a review
  console.log('report reviev');
} //expecting review_id