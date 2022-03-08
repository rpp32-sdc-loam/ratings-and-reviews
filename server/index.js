
var app = require('./app.js');

var port = 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});