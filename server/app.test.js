var request = require('supertest');
var app = require('./app.js');

describe('GET /reviews', () => {
  describe('given default values and a product_id', () => {

    test('should respond with a 200 status code', async () => {
      const response = await request(app).get('/reviews').query({
        product_id: 75
      });
      expect(response.statusCode).toBe(200);
    })
  });

  describe('given specific values', () => {

  });

  describe('given no/missing values', () => {

  });

});
/*
describe('GET /reviews/meta', () => {
  describe('given a product_id', () => {

  });
  describe('when product_id is missing', () => {

  });
});

describe('POST /reviews', () => {
  describe('given all pertinent information for a review', () => {

  });
  describe('given no/missing values', () => {

  });
});

describe('PUT /reviews/:review_id/helpful', () => {
  describe('given a review_id', () => {

  });
});

describe('PUT /reviews/:review_id/report', () => {
  describe('given a review_id', () => {

  });
});
/** */