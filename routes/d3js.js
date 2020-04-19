var express = require('express');
var router = express.Router();

const csvFilePath='d3js-example.csv'
const csv=require('csvtojson')

/* GET users listing. */
router.get('/', function(req, res, next) {
  const csv_data = [];
  csv()
    .fromFile(csvFilePath)
    .then((csv_data) => {
      res.render('d3js', { title: 'D3JS Example', populations: JSON.stringify(csv_data) });
    });
});

module.exports = router;
