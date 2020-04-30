var nationals = [
  'AF', 'AL', 'DZ', 'AD', 'AO', 'AI', 'AG', 'AR', 'AM', 'AW', 'AU',
  'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM',
  'BT', 'BO', 'BQ', 'BA', 'BW', 'BR', 'VG', 'BN', 'BG', 'BF', 'BI',
  'CV', 'KH', 'CM', 'CA', 'KY', 'CF', 'TD', 'CL', 'CN', 'CO', 'CG',
  'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'CD', 'DK', 'DJ', 'DM',
  'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FK', 'FO',
  'FJ', 'FI', 'FR', 'GF', 'PF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI',
  'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT',
  'VA', 'HN', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL',
  'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'XK', 'KW', 'KG', 'LA',
  'LV', 'LB', 'LR', 'LY', 'LI', 'LT', 'LU', 'MG', 'MW', 'MY', 'MV',
  'ML', 'MT', 'MQ', 'MR', 'MU', 'YT', 'MX', 'MC', 'MN', 'ME', 'MS',
  'MA', 'MZ', 'MM', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'MK',
  'MP', 'NO', 'PS', 'OM', 'PK', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL',
  'PT', 'PR', 'QA', 'KR', 'MD', 'RE', 'RO', 'RU', 'RW', 'BL', 'KN',
  'LC', 'MF', 'PM', 'VC', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL',
  'SG', 'SX', 'SK', 'SI', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD', 'SR',
  'SE', 'CH', 'SY', 'TH', 'GB', 'TL', 'TG', 'TT', 'TN', 'TR', 'TC',
  'UG', 'UA', 'AE', 'TZ', 'US', 'VI', 'UY', 'UZ', 'VE', 'VN', 'YE',
  'ZM', 'ZW'
];

var promise = new Promise(function (resolve, reject) {
  var countries_statistic = [];
  Array.from(nationals).map(national => {
    var days_data = global_data.filter(x => x['Country'] == national);
    today_data = days_data.pop();
    yesterday_data = days_data.pop();
    if (parseInt(today_data['Confirmed']) == 0) {
      today_data['Confirmed Change'] = '';
    }
    else {
      today_data['Confirmed Change'] = (parseInt(today_data['Confirmed']) / parseInt(yesterday_data['Cumulative Confirmed'])) * 100;
      today_data['Confirmed Change'] = today_data['Confirmed Change'].toFixed(2);
    }
    if (parseInt(today_data['Deaths']) == 0) {
      today_data['Deaths Change'] = '';
    }
    else {
      today_data['Deaths Change'] = (parseInt(today_data['Deaths']) / parseInt(yesterday_data['Cumulative Deaths'])) * 100;
      today_data['Deaths Change'] = today_data['Deaths Change'].toFixed(2);
    }
    countries_statistic.push(today_data);
    resolve(countries_statistic);
  });
});

promise.then((countries_statistic) => {
  showMap(countries_statistic);
  return countries_statistic;
}).then((countries_statistic) => {
  var initialValue = 0;
  var total_confirm_cases = countries_statistic.reduce(function (accumulator, currentValue) {
    return accumulator + parseInt(currentValue['Cumulative Confirmed']);
  },initialValue)
  var total_deaths = countries_statistic.reduce(function (accumulator, currentValue) {
    return accumulator + parseInt(currentValue['Cumulative Deaths']);
  },initialValue)
  setTimeout(() => {
    $('#statistics #confirm-cases').text(total_confirm_cases.toLocaleString('vi'));
    $('#statistics #deaths').text(total_deaths.toLocaleString('vi'));
    showPage();
  }, 1500);
  addTableHeader(['Country', 'Confirmed Total', 'Confirmed Today', 'Deaths Total', 'Deaths Today']);
  addTableContent(countries_statistic);
}).then(() => {
  $('table#countries-statistic').DataTable({
    "scrollY": "500px",
    "scrollCollapse": true,
    "paging": false
  });
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
      <td>${country_statistic['Cumulative Confirmed']}</td>
      <td>${country_statistic['Confirmed']} ${country_statistic['Confirmed Change'] != '' ? '(' + country_statistic['Confirmed Change'] + ' %)' : ''}</td>
      <td>${country_statistic['Cumulative Deaths']}</td>
      <td>${country_statistic['Deaths']} ${country_statistic['Deaths Change'] != '' ? '(' + country_statistic['Deaths Change'] + ' %)' : ''}</td>
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

function showMap(countries_statistic) {

  // Base path to maps
  var baseMapPath = "https://code.highcharts.com/mapdata/",
    showDataLabels = false, // Switch for data labels enabled/disabled
    mapCount = 0,
    searchText,
    mapOptions = '';

  // Populate dropdown menus and turn into jQuery UI widgets
  $.each(Highcharts.mapDataIndex, function (mapGroup, maps) {
    if (mapGroup !== "version") {
      mapOptions += '<option class="option-header">' + mapGroup + '</option>';
      $.each(maps, function (desc, path) {
        mapOptions += '<option value="' + path + '">' + desc + '</option>';
        mapCount += 1;
      });
    }
  });
  searchText = 'Search ' + mapCount + ' maps';
  mapOptions = '<option value="custom/world.js">' + searchText + '</option>' + mapOptions;
  $("#mapDropdown").append(mapOptions).combobox();

  // Change map when item selected in dropdown
  $("#mapDropdown").change(function () {
    var $selectedItem = $("option:selected", this),
      mapDesc = $selectedItem.text(),
      mapKey = this.value.slice(0, -3),
      svgPath = baseMapPath + mapKey + '.svg',
      geojsonPath = baseMapPath + mapKey + '.geo.json',
      javascriptPath = baseMapPath + this.value,
      isHeader = $selectedItem.hasClass('option-header');

    // Dim or highlight search box
    if (mapDesc === searchText || isHeader) {
      $('.custom-combobox-input').removeClass('valid');
      location.hash = '';
    } else {
      $('.custom-combobox-input').addClass('valid');
      location.hash = mapKey;
    }

    if (isHeader) {
      return false;
    }

    // Show loading
    if (Highcharts.charts[0]) {
      Highcharts.charts[0].showLoading('<i class="fa fa-spinner fa-spin fa-2x"></i>');
    }

    // When the map is loaded or ready from cache...
    function mapReady() {

      var mapGeoJSON = Highcharts.maps[mapKey],
        data = [],
        parent,
        match;

      // Generate non-random data for the map
      new Promise((resolve, reject) => {
        $.each(mapGeoJSON.features, function (index, feature) {
          const promise = new Promise((resolve, reject) => {
            var country_statistic = countries_statistic.filter(item => item.Country == feature.properties['hc-a2']).shift()
            resolve(country_statistic);
          });
          promise.then(function (country_statistic) {
            data.push({
              key: feature.properties['hc-key'],
              country: country_statistic ? country_statistic['Country Name'] : null,
              deaths: country_statistic ? country_statistic['Deaths'] : null,
              cumulative_deaths: country_statistic ? country_statistic['Cumulative Deaths'] : null,
              deaths: country_statistic ? country_statistic['Confirmed'] : null,
              cumulative_confirmed: country_statistic ? country_statistic['Cumulative Confirmed'] : null,
              value: country_statistic ? country_statistic['Cumulative Confirmed'] : null,
            });
          });
        });

        resolve();

      }).then(() => {
        // Show arrows the first time a real map is shown
        if (mapDesc !== searchText) {
          $('.selector .prev-next').show();
          $('#sideBox').show();
        }

        // Is there a layer above this?
        match = mapKey.match(/^(countries\/[a-z]{2}\/[a-z]{2})-[a-z0-9]+-all$/);
        if (/^countries\/[a-z]{2}\/[a-z]{2}-all$/.test(mapKey)) { // country
          parent = {
            desc: 'World',
            key: 'custom/world'
          };
        } else if (match) { // admin1
          parent = {
            desc: $('option[value="' + match[1] + '-all.js"]').text(),
            key: match[1] + '-all'
          };
        }
        $('#up').html('');
        if (parent) {
          $('#up').append(
            $('<a><i class="fa fa-angle-up"></i> ' + parent.desc + '</a>')
              .attr({
                title: parent.key
              })
              .click(function () {
              })
          );
        }

        // Instantiate chart
        $("#container").highcharts('Map', {

          title: {
            text: null
          },

          mapNavigation: {
            enabled: true,
            enableMouseWheelZoom: false,
            buttonOptions: {
              verticalAlign: 'bottom',
              align: 'right'
            }
          },

          colorAxis: {
            min: 0,
            dataClasses: [
              {
                to: Number.parseInt(100),
                color: '#D1E0C5'
              }, {
                from: 100,
                to: 1000,
                color: '#FED906',
              }, {
                from: 1000,
                to: 10000,
                color: '#FE6306',
              }, {
                from: 10000,
                color: '#FF0D02',
              }]
          },

          yAxis: {
            type: "datetime",
            ordinal: false,
            events: {
              afterSetExtremes() {
                let btn = document.querySelector('#reset-zoom');
                btn.onclick = () => {
                  this.chart.zoomOut();
                };
              }
            }
          },

          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            labelFormatter: function () {
              if (this.from === undefined) {
                return '< ' + this.to;
              }
              if (this.to === undefined) {
                return '> ' + this.from;
              }
              return this.from + ' - ' + this.to;
            },
          },

          tooltip: {
            useHTML: true,
            formatter: function () {
              return `
                <div><h6 class='mb-2'>${this.point.country}</h3></div>
                <div>
                  <div class="confirmed d-flex">
                    <small class="title">Confirmed</small><span class='ml-auto'><b>${Number.parseInt(this.point.cumulative_confirmed).toLocaleString('vi')}</b></span>
                  </div>
                  <div class='recovered d-flex'>
                    <small class="title mr-5">Recovered</small><span class='ml-auto'><b>1.000.000</b></span>
                  </div>
                  <div class='deaths d-flex'>
                    <small class="title">Deaths</small><span class='ml-auto'><b>${Number.parseInt(this.point.cumulative_deaths).toLocaleString('vi')}</b></span>
                  </div>
                </div>
              `
            }
          },

          plotOptions: {
          },
          series: [{
            data: data,
            mapData: mapGeoJSON,
            joinBy: ['hc-key', 'key'],
            name: 'Country Name !!!',
            cursor: 'pointer',
            states: {
              hover: {
                color: Highcharts.getOptions().colors[2]
              }
            },
            dataLabels: {
              enabled: showDataLabels,
              formatter: function () {
                return mapKey === 'custom/world' || mapKey === 'countries/us/us-all' ?
                  (this.point.properties && this.point.properties['hc-a2']) :
                  this.point.name;
              }
            },

            point: {
              events: {
                // On click, look for a detailed map
                click: function () {
                  var key = this.key;
                }
              }
            }
          },

          {
            type: 'mapline',
            name: "Separators",
            data: Highcharts.geojson(mapGeoJSON, 'mapline'),
            nullColor: 'gray',
            showInLegend: true,
            enableMouseTracking: true
          }],
        });

        showDataLabels = $("#chkDataLabels").prop('checked');
      })
    }

    // Check whether the map is already loaded, else load it and
    // then show it async
    if (Highcharts.maps[mapKey]) {
      mapReady();
    } else {
      $.getScript(javascriptPath, mapReady);
    }
  });

  // Trigger change event to load map on startup
  if (location.hash) {
    $('#mapDropdown').val(location.hash.substr(1) + '.js');
  } else { // for IE9
    $($('#mapDropdown option')[0]).attr('selected', 'selected');
  }
  $('#mapDropdown').change();
}

trendChart();

function trendChart() {
  new Promise((resolve, reject) => {
    var america_data = global_data.filter(row => row['Country'] === 'US');
    resolve(america_data);
  }).then((america_data) => {
    console.log(america_data);
    len = america_data.length,
    i = 0,
    data = [];

    for (i = 0; i < len; i++) {
      data[i] = {
          x: Date.parse(america_data[i]['day']),
          y: Number.parseInt(america_data[i]['Cumulative Confirmed'])
        }
    }
    console.log(data);
    Highcharts.chart('trend-chart', {
      title: {
        text: 'All The World'
      },

      subtitle: {
        text: 'Source: www.who.int'
      },

      xAxis: {
        type: 'datetime'
      },

      yAxis: {
        title: {
          text: 'Number Of Confirmed'
        }
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      series: [{
        name: 'Installation',
        data: data
      }],

      // responsive: {
      //   rules: [{
      //     condition: {
      //       maxWidth: 500
      //     },
      //     chartOptions: {
      //       legend: {
      //         layout: 'horizontal',
      //         align: 'center',
      //         verticalAlign: 'bottom'
      //       }
      //     }
      //   }]
      // }
    });
  });
}
