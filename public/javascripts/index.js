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
  var countries_statistic = [];
  Array.from(nationals).map( national => {
    var national_statistic = global_data.filter(x => x['Country'] == national).pop();
    countries_statistic.push(national_statistic);
    resolve(countries_statistic);
  });
});
promise.then((countries_statistic) => {
  addTableHeader(['Country', 'Deaths', 'Cumulative Deaths', 'Confirmed', 'Cumulative Confirmed']);
  addTableContent(countries_statistic);
}).then(() => {
  $('table#countries-statistic').DataTable({
    "scrollY": "500px",
    "scrollCollapse": true,
    "paging": false
  });
  showPage();
});

function addTableContent(countries_statistic) {
  $.each(countries_statistic, (index, country_statistic) => {
    appendCountryStatistic(country_statistic);
  })
}

function appendCountryStatistic(country_statistic) {
  $('table#countries-statistic tbody').append(`
    <tr>
      <td>${country_statistic['Country Name']}</td>
      <td>${country_statistic['Deaths']}</td>
      <td>${country_statistic['Cumulative Deaths']}</td>
      <td>${country_statistic['Confirmed']}</td>
      <td>${country_statistic['Cumulative Confirmed']}</td>
    </tr>
  `);
}

function addTableHeader(headerList) {
  $('table#countries-statistic thead').append('<tr></tr>');
  $(headerList).each((index, header) => {
    $('table#countries-statistic thead tr').append(`
      <td>${header}</td>
    `);
  });
}
