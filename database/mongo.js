var mongoose = require('mongoose');

let reviewSchema = new mongoose.Schema ({
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  reported: Boolean,
  recommend: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfullness: Number
});

let photoSchema = new mongoose.Schema ({
  id: Number,
  review_id: Number,
  url: String
});

let characteristicReviewsSchema = new mongoose.Schema ({
  id: Number,
  characterstics_id: Number,
  review_id: Number,
  value: Number
});

let characteristicsSchema = new mongoose.Schema ({
  id: Number,
  product_id: Number,
  name: String
});