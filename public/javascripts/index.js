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
  addTableHeader(['Country', 'Confirmed Total', 'Confirmed Today', 'Deaths Total', 'Deaths Today']);
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

/**
 * This is a complicated demo of Highmaps, not intended to get you up to speed
 * quickly, but to show off some basic maps and features in one single place.
 * For the basic demo, check out https://www.highcharts.com/maps/demo/geojson
 * instead.
 */

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

    // Update info box download links
    $("#download").html(
      '<a class="button" target="_blank" href="https://jsfiddle.net/gh/get/jquery/1.11.0/' +
      'highcharts/highcharts/tree/master/samples/mapdata/' + mapKey + '">' +
      'View clean demo</a>' +
      '<div class="or-view-as">... or view as ' +
      '<a target="_blank" href="' + svgPath + '">SVG</a>, ' +
      '<a target="_blank" href="' + geojsonPath + '">GeoJSON</a>, ' +
      '<a target="_blank" href="' + javascriptPath + '">JavaScript</a>.</div>'
    );

    // Generate non-random data for the map
    $.each(mapGeoJSON.features, function (index, feature) {
      data.push({
        key: feature.properties['hc-key'],
        value: index
      });
    });

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
            $('#mapDropdown').val(parent.key + '.js').change();
          })
      );
    }


    // Instantiate chart
    $("#container").highcharts('Map', {

      title: {
        text: null
      },

      mapNavigation: {
        enabled: true
      },

      colorAxis: {
        min: 0,
        stops: [
          [0, '#EFEFFF'],
          [0.5, Highcharts.getOptions().colors[0]],
          [1, Highcharts.color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()]
        ]
      },

      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom'
      },

      series: [{
        data: data,
        mapData: mapGeoJSON,
        joinBy: ['hc-key', 'key'],
        name: 'Random data',
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
              $('#mapDropdown option').each(function () {
                if (this.value === 'countries/' + key.substr(0, 2) + '/' + key + '-all.js') {
                  $('#mapDropdown').val(this.value).change();
                }
              });
            }
          }
        }
      }, {
        type: 'mapline',
        name: "Separators",
        data: Highcharts.geojson(mapGeoJSON, 'mapline'),
        nullColor: 'gray',
        showInLegend: false,
        enableMouseTracking: false
      }]
    });

    showDataLabels = $("#chkDataLabels").prop('checked');

  }

  // Check whether the map is already loaded, else load it and
  // then show it async
  if (Highcharts.maps[mapKey]) {
    mapReady();
  } else {
    $.getScript(javascriptPath, mapReady);
  }
});

// Toggle data labels - Note: Reloads map with new random data
$("#chkDataLabels").change(function () {
  showDataLabels = $("#chkDataLabels").prop('checked');
  $("#mapDropdown").change();
});

// Switch to previous map on button click
$("#btn-prev-map").click(function () {
  $("#mapDropdown option:selected").prev("option").prop("selected", true).change();
});

// Switch to next map on button click
$("#btn-next-map").click(function () {
  $("#mapDropdown option:selected").next("option").prop("selected", true).change();
});

// Trigger change event to load map on startup
if (location.hash) {
  $('#mapDropdown').val(location.hash.substr(1) + '.js');
} else { // for IE9
  $($('#mapDropdown option')[0]).attr('selected', 'selected');
}
$('#mapDropdown').change();
