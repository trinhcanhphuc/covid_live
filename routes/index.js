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
      var nationals = ['AF', 'AL', 'DZ', 'AD', 'AO', 'AI', 'AG', 'AR', 'AM', 'AW', 'AU',
      'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM',
      'BT', 'BO', 'BQ', 'BA', 'BW', 'BR', 'VG', 'BN', 'BG', 'BF', 'BI',
      'CV', 'KH', 'CM', 'CA', 'KY', 'CF', 'TD', 'CL', 'CN', 'CO', 'CG',
      'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'CD', 'DK', 'DJ', 'DM',
      'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FK', 'FO',
      'FJ', 'FI', 'FR', 'GF', 'PF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI',
      'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT',
      'VA', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM',
      'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'XK', 'KW', 'KG',
      'LA', 'LV', 'LB', 'LR', 'LY', 'LI', 'LT', 'LU', 'MG', 'MW', 'MY',
      'MV', 'ML', 'MT', 'MQ', 'MR', 'MU', 'YT', 'MX', 'MC', 'MN', 'ME',
      'MS', 'MA', 'MZ', 'MM', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG',
      'MK', 'MP', 'NO', 'PS', 'OM', 'PK', 'PA', 'PG', 'PY', 'PE', 'PH',
      'PL', 'PT', 'PR', 'QA', 'KR', 'MD', 'RE', 'RO', 'RU', 'RW', 'BL',
      'KN', 'LC', 'MF', 'PM', 'VC', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC',
      'SL', 'SG', 'SX', 'SK', 'SI', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD',
      'SR', 'SE', 'CH', 'SY', 'TH', 'GB', 'TL', 'TG', 'TT', 'TN', 'TR',
      'TC', 'UG', 'UA', 'AE', 'TZ', 'US', 'VI', 'UY', 'UZ', 'VE', 'VN',
      'YE', 'ZM', 'ZW'];

      var promise = new Promise(function(resolve, reject) {
        var countries_statistic_days = [];
        Array.from(nationals).map( national => {
          var national_statistic = csv_data.filter(x => x['Country'] == national).pop();
          countries_statistic_days.push(national_statistic);
          resolve(countries_statistic_days);
        });
      });
      promise.then((countries_statistic_days) => res.render('index', { title: 'Express', countries_statistic_days: countries_statistic_days }))
  });
});

module.exports = router;
