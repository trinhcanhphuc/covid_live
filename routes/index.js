var express = require('express');
var router = express.Router();

const csvFilePath='WHO-COVID-19-global-data.csv'
const csv=require('csvtojson')

/* GET home page. */
router.get('/', function(req, res, next) {
  const csv_data = [];
  csv()
    .fromFile(csvFilePath)
    .then((csv_data) => {
      res.render('index', {
        title: 'Express', global_data: JSON.stringify(csv_data)
      })
    });
});

module.exports = router;
