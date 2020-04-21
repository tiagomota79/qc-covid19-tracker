// Get Heroku URL from dotenv
// import {} from 'dotenv/config';
// dotenv.config();
// const dataURL = `${process.env.DATA_URL}` || `http://localhost:3000`;

// Auxiliary function to create HTML elements
function createHtmlElement(elementId, attributeType, attributeName, innerHTML) {
  const htmlElement = document.getElementById(elementId);
  const element = document.createElement('div');
  element.setAttribute(attributeType, attributeName);
  element.innerHTML = innerHTML;
  htmlElement.appendChild(element);
}

// Create loading spinner
const spinner = document.getElementById('spinner');
const spinnerImg = document.createElement('IMG');
spinnerImg.setAttribute('src', 'images/Bars-1s-200px.gif');
spinnerImg.setAttribute('class', 'spinner');
spinner.appendChild(spinnerImg);

// Assign DOM body element to variable, to be used for DOM manipulation
const body = document.body || document.getElementsByTagName('BODY')[0];

// Function to get today's date in long format
function dateLong() {
  let year = String(new Date().getFullYear());
  let day = String(new Date().getDate());
  let month;
  switch (new Date().getMonth()) {
    case 0:
      month = 'January';
      break;
    case 1:
      month = 'February';
      break;
    case 2:
      month = 'March';
      break;
    case 3:
      month = 'April';
      break;
    case 4:
      month = 'May';
      break;
    case 5:
      month = 'June';
      break;
    case 6:
      month = 'July';
      break;
    case 7:
      month = 'August';
      break;
    case 8:
      month = 'September';
      break;
    case 9:
      month = 'October';
      break;
    case 10:
      month = 'November';
      break;
    case 11:
      month = 'December';
      break;
  }
  let weekday;
  switch (new Date().getDay()) {
    case 0:
      weekday = 'Sunday';
      break;
    case 1:
      weekday = 'Monday';
      break;
    case 2:
      weekday = 'Tuesday';
      break;
    case 3:
      weekday = 'Wednesday';
      break;
    case 4:
      weekday = 'Thursday';
      break;
    case 5:
      weekday = 'Friday';
      break;
    case 6:
      weekday = 'Saturday';
  }

  let dateToShow = `${weekday}, ${month} ${day}, ${year}`;
  return dateToShow;
}

// Function to create charts titles
function chartTitle(chart, title) {
  let chartTitle = chart.titles.create();
  chartTitle.text = title;
  chartTitle.fontSize = '1rem';
  chartTitle.marginTop = 30;
  chartTitle.marginBottom = 10;
  chartTitle.fontWeight = 'bold';

  return chartTitle;
}

// BAR CHART FUNCTIONS
//Functin to create bar chart date axis
function dateAxis(chart) {
  // Set input format for the dates in charts to match the date format in the database
  chart.dateFormatter.inputDateFormat = 'yyyy-M-d';

  // Create chart date axis
  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;
  dateAxis.renderer.grid.template.strokeOpacity = 0;
  dateAxis.renderer.labels.template.location = 0;
  dateAxis.renderer.labels.template.horizontalCenter = 'right';
  dateAxis.renderer.labels.template.verticalCenter = 'middle';
  dateAxis.renderer.labels.template.rotation = 270;
  dateAxis.baseInterval = {
    timeUnit: 'day',
    count: 1,
  };

  return dateAxis;
}

// Function to create bar charts value axis
function valueAxis(chart) {
  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  return valueAxis;
}

// Function to create bar charts series
function barChartSeries(chart, xValue, yValue, seriesName) {
  // Create main chart series
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.dateX = xValue;
  series.dataFields.valueY = yValue;
  series.fillOpacity = 1;
  series.columns.template.tooltipText = '[bold]{dateX}[/]: {valueY}';
  series.tooltip.pointerOrientation = 'vertical';
  series.name = seriesName;

  return series;
}

// PIE CHART FUNCTIONS
// Function to create pie charts
function pieChart(chart, value, category) {
  // Create pie chart series
  let pieSeries = chart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = value;
  pieSeries.dataFields.category = category;

  // Change pie chart tooltip information
  pieSeries.slices.template.tooltipText = '[bold]{category}[/]: {value}';

  return pieSeries;
}

// MOBILE STACKED BAR CHART FUNCTIONS
// Function to create mobile category axis
function categoryAxis(chart, category) {
  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = category;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.grid.template.strokeOpacity = 0;

  return categoryAxis;
}

// Function to create mobile value axis
function mobileValueAxis(chart) {
  let mobileValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  mobileValueAxis.renderer.inside = true;
  mobileValueAxis.renderer.labels.template.disabled = true;
  mobileValueAxis.min = 0;
  mobileValueAxis.renderer.grid.template.strokeOpacity = 0;
  mobileValueAxis.calculateTotals = true;
  mobileValueAxis.min = 0;
  mobileValueAxis.max = 100;
  mobileValueAxis.strictMinMax = true;
  mobileValueAxis.renderer.labels.template.adapter.add('text', function (text) {
    return text + '%';
  });

  return mobileValueAxis;
}

// Function to create series for the mobile versions of the pie charts
function createMobileSeries(chart, field, name) {
  // Set up series
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.name = name;
  series.dataFields.valueY = field;
  series.dataFields.valueYShow = 'totalPercent';
  series.dataFields.categoryX = 'date';
  series.sequencedInterpolation = true;
  series.calculatePercent = true;

  // Make it stacked
  series.stacked = true;

  // Configure columns
  series.columns.template.width = am4core.percent(60);
  series.columns.template.tooltipText =
    '[font-size:0.7rem bold]{name}[font-size:0.7rem]: {valueY}';
  series.tooltip.pointerOrientation = 'vertical';

  // Add label
  let labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.text = '[bold]{name}[/]: {valueY}';
  labelBullet.label.fontSize = '0.5rem';
  labelBullet.locationY = 0.5;
  labelBullet.label.hideOversized = true;

  return series;
}

// DONUT CHART FUNCTIONS
// Create donut chart label
function donutChartLabel(chart, labelText) {
  let label = chart.seriesContainer.createChild(am4core.Label);
  label.text = labelText;
  label.horizontalCenter = 'middle';
  label.verticalCenter = 'middle';
  if (window.matchMedia('(min-width: 950px)').matches) {
    label.fontSize = '1rem';
  } else {
    label.fontSize = 'small';
  }
  // label.fontSize = '1rem';

  return label;
}

function donutChartSeries(chart, value, category) {
  let donutSeries = chart.series.push(new am4charts.PieSeries());
  donutSeries.dataFields.value = value;
  donutSeries.dataFields.category = category;
  donutSeries.calculatePercent = true;
  donutSeries.labels.template.text = `[bold]{category}[/]:\n{value.percent}%`;
  if (window.matchMedia('(min-width: 950px)').matches) {
    donutSeries.labels.template.fontSize = 'smaller';
  } else {
    donutSeries.labels.template.fontSize = 'x-small';
    donutSeries.ticks.template.disabled = true;
    donutSeries.labels.template.disabled = true;
  }

  // Change pie chart tooltip information
  donutSeries.slices.template.tooltipText = '[bold]{category}[/]: {value}';

  return donutSeries;
}

// Function to create the divs where the charts will be placed
function createChartDiv(attribute) {
  const footer = document.getElementById('footer');
  const chartDiv = document.createElement('div');
  chartDiv.setAttribute('id', attribute);
  body.insertBefore(chartDiv, footer);
}

// Auxiliary function to perform several DOM manipulations only after the data is loaded
function domElements() {
  document.body.removeChild(spinner); // removes spinner after the data is loaded
  createChartDiv('mainchartdiv'); // Adds the div where the main chart will be placed
  createChartDiv('rateofchange'); // Adds the div where the rate of change chart will be placed
  createChartDiv('casesbyage'); // Adds the div where the cases by age group chart will be placed
  createChartDiv('casesbyagemobile'); // Adds the div where the mobile version of the cases by age group chart will be placed
  createChartDiv('regionchartdiv'); // Adds the div where the regions chart will be placed
  createChartDiv('regionchartmobilediv'); // Adds the div where the mobile version of the regions chart will be placed
  createChartDiv('test-hosp'); // Adds the div where the tests and the hospitalizations charts will be placed
  createChartDiv('deaths'); // Adds the div where the deaths headline will be placed
  createChartDiv('agegroupdeaths'); // Adds the div where the deaths by age group chart will be placed
  createChartDiv('regiondeaths'); // Adds the div where the deaths by region chart will be placed
  createChartDiv('agegroupdeathsmobile'); // Adds the div where the mobile version of the deaths by age group chart will be placed
  createChartDiv('regiondeathsmobile'); // Adds the div where the mobile version of the deaths by region chart will be placed
  createChartDiv('ca-data'); // Adds the div where the Canada data will be placed
}

// Get data from server and generate graphs
const getData = async () => {
  // Fetch data from DB
  const allDataFetch = await fetch(`http://localhost:3000/alldata`);
  allData = await allDataFetch.json();
  console.log('allData', allData);
  domElements();

  // Assign each data to a variable
  const totalCases = allData.totalCases;
  console.log('TotalCases', totalCases);
  const regionCases = allData.regionCases[0].data;
  console.log('regionCases', regionCases);
  const ageGroupCases = allData.ageGroupCases[0].data;
  const deathsByAgeGroup = allData.deathsByAgeGroup[0].data;
  const regionDeaths = allData.regionDeaths[0].data;
  const hospitalizations = allData.hospitalizations[0].data;
  const tests = allData.tests[0].data;
  const deaths = allData.deaths[0].data;
  const caData = allData.caData[0].data;

  // DATA MANIPULATIONS
  // Total Quebec cases today
  let totalQCCases = totalCases[totalCases.length - 1].data;

  // Get rate of change - difference between one day's cases and the previous day's cases
  let rateOfChange = [];
  for (let i = 0; i < totalCases.length - 1; i++) {
    rateOfChange[i] = {
      date: totalCases[i + 1].date,
      total: totalCases[i + 1].data - totalCases[i].data,
    };
  }
  console.log('rateOfChange', rateOfChange);

  // Get difference bewteen today's cases and yesterday's cases
  const diff = rateOfChange[rateOfChange.length - 1].total;

  // Transform arrays into objects for mobile version of graphs
  // Region Cases
  let regionCasesMobile = [];
  let regionCasesMobileObject = {};
  regionCases.forEach((item, index, arr) => {
    regionCasesMobileObject[arr[index].region] = arr[index].cases;
  });
  regionCasesMobile.push(regionCasesMobileObject);
  regionCasesMobile[0].date = dateLong();
  console.log('regionCasesMobile', regionCasesMobile);

  // Cases by age group
  let ageGroupCasesMobile = [];
  let ageGroupCasesMobileObject = {};
  ageGroupCases.forEach((item, index, arr) => {
    ageGroupCasesMobileObject[arr[index].ageGroup] = arr[index].cases;
  });
  ageGroupCasesMobile.push(ageGroupCasesMobileObject);
  ageGroupCasesMobile[0].date = dateLong();

  // Deaths by region
  let regionDeathsMobile = [];
  let regionDeathsMobileObject = {};
  regionDeaths.forEach((item, index, arr) => {
    regionDeathsMobileObject[arr[index].region] = arr[index].deaths;
  });
  regionDeathsMobile.push(regionDeathsMobileObject);
  regionDeathsMobile[0].date = dateLong();

  // Deaths by age group
  let ageGroupDeathsMobile = [];
  let ageGroupDeathsMobileObject = {};
  deathsByAgeGroup.forEach((item, index, arr) => {
    ageGroupDeathsMobileObject[arr[index].ageGroup] = arr[index].deaths;
  });
  ageGroupDeathsMobile.push(ageGroupDeathsMobileObject);
  ageGroupDeathsMobile[0].date = dateLong();

  // Hospitalizations
  let totalHosp = hospitalizations.pop().value;
  let hospitalizationsMobile = [];
  let hospitalizationsMobileObject = {};
  hospitalizations.forEach((item, index, arr) => {
    hospitalizationsMobileObject[arr[index].number] = arr[index].value;
  });
  hospitalizationsMobile.push(hospitalizationsMobileObject);
  hospitalizationsMobile[0].date = dateLong();

  // Tests
  let testsMobile = [];
  let testsMobileObject = {};
  tests.forEach((item, index, arr) => {
    testsMobileObject[arr[index].number] = arr[index].value;
  });
  testsMobile.push(testsMobileObject);
  testsMobile[0].date = dateLong();

  // Create title
  const title = document.createElement('H1');
  title.setAttribute('id', 'title');
  title.innerHTML = 'COVID-19 situation in Quebec';
  body.prepend(title);

  // Create headline, source, disclaimer, sourcecode and copyright
  createHtmlElement(
    'headline',
    'class',
    'headline',
    `As of <b>${dateLong()}</b>, Quebec has`
  );
  createHtmlElement(
    'headline',
    'class',
    'cases-headline',
    new Intl.NumberFormat('en-CA').format(totalQCCases)
  );
  createHtmlElement(
    'headline',
    'class',
    'headline',
    `confirmed COVID-19 cases (up ${new Intl.NumberFormat('en-CA').format(
      diff
    )} from yesterday).`
  );
  createHtmlElement(
    'headline',
    'class',
    'percentage',
    `This represents <span id="percentage">${(
      (totalQCCases / caData.total) *
      100
    ).toFixed(1)}%</span> of the confirmed cases in Canada.`
  );
  createHtmlElement(
    'deaths',
    'class',
    'deaths',
    `<div id="death-number">${new Intl.NumberFormat('en-CA').format(
      deaths
    )}</div><div>deaths reported in Quebec</div><div id="death-detail">(${new Intl.NumberFormat(
      'en-CA'
    ).format(
      (
        (deaths *
          (deathsByAgeGroup[5].deaths +
            deathsByAgeGroup[6].deaths +
            deathsByAgeGroup[7].deaths)) /
        100
      ).toFixed(0)
    )} of which from people 70 years or more).</div>`
  );
  createHtmlElement('test-hosp', 'id', 'tests', '');
  createHtmlElement('test-hosp', 'id', 'hosp', '');
  createHtmlElement(
    'ca-data',
    'id',
    'ca-data-header',
    'COVID-19 situation in Canada'
  );
  createHtmlElement(
    'ca-data',
    'id',
    'ca-data-subheader',
    'Resumed information'
  );
  createHtmlElement('ca-data', 'id', 'ca-data-boxes', '');
  createHtmlElement(
    'ca-data-boxes',
    'class',
    'ca-numbers',
    `<div id="bignumber">${new Intl.NumberFormat('en-CA').format(
      caData.total
    )}</div><div>confirmed cases</div>`
  );
  createHtmlElement(
    'ca-data-boxes',
    'class',
    'ca-numbers',
    `<div id="bignumber">${new Intl.NumberFormat('en-CA').format(
      caData.tested
    )}</div><div>people tested</div>`
  );
  createHtmlElement(
    'ca-data-boxes',
    'class',
    'ca-numbers',
    `<div id="bignumber">${new Intl.NumberFormat('en-CA').format(
      caData.deaths
    )}</div><div>deaths</div>`
  );
  createHtmlElement(
    'footer',
    'class',
    'source',
    `<b>Sources:</b><br />
  <a
    href="https://www.quebec.ca/sante/problemes-de-sante/a-z/coronavirus-2019/situation-coronavirus-quebec/"
    >Quebec.ca</a
  ><br /><a href="https://www.canada.ca/en/public-health/services/diseases/coronavirus-disease-covid-19.html">Canada.ca</a>`
  );
  createHtmlElement(
    'footer',
    'class',
    'disclaimer',
    'This is a personal project, it is not meant to alarm anyone or cause panic. All the data is real, collected daily from the Quebec government website. For more information on the COVID-19 spread, consult the sources above.'
  );
  createHtmlElement(
    'footer',
    'class',
    'sourcecode',
    `<a id="github_link" href="https://github.com/tiagomota79/qc-covid19-tracker"><svg height="32" id="github" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg><br />GitHub Repository</a>`
  );
  createHtmlElement('footer', 'class', 'copyright', '© 2020 Tiago Mota');

  // CREATE CHARTS
  // Create charts instances before anything, so they all use the themes below
  let mainChart = am4core.create('mainchartdiv', am4charts.XYChart); // This is the main chart, showing the cumulative cases by episode date
  let rateOfChangeChart = am4core.create('rateofchange', am4charts.XYChart); // This is the rate of change chart, showing number of new cases per day
  let ageGroupChart = am4core.create('casesbyage', am4charts.PieChart); // This is the chart showing the cases by age group
  let ageGroupMobileChart = am4core.create(
    'casesbyagemobile',
    am4charts.XYChart
  ); // This is the mobile version of the chart showing the cases by age group in a stacked bar chart
  let regionsChart = am4core.create('regionchartdiv', am4charts.PieChart); // This is the chart showing the cases by region
  let regionsMobileChart = am4core.create(
    'regionchartmobilediv',
    am4charts.XYChart
  ); // This is the mobile version of the chart showing the cases by region in a stacked bar chart
  let testsChart = am4core.create('tests', am4charts.PieChart); // This is the chart showing people tested and results
  let hospChart = am4core.create('hosp', am4charts.PieChart); // This is the chart showing hospitalizations
  let ageGroupDeathsChart = am4core.create(
    'agegroupdeaths',
    am4charts.PieChart
  ); // This is the chart showing the cases by age group
  let ageGroupDeathsMobileChart = am4core.create(
    'agegroupdeathsmobile',
    am4charts.XYChart
  ); // This is the mobile version of the chart showing the cases by age group in a stacked bar chart
  let regionDeathsChart = am4core.create('regiondeaths', am4charts.PieChart); // This is the chart showing the cases by age group
  let regionDeathsMobileChart = am4core.create(
    'regiondeathsmobile',
    am4charts.XYChart
  ); // This is the mobile version of the chart showing the cases by age group in a stacked bar chart

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_material);
  // Themes end

  // MAIN CHART STARTS HERE
  mainChart.data = totalCases; // Assign data
  chartTitle(mainChart, 'Cumulative Cases by Episode Date'); // Main chart title
  dateAxis(mainChart); // Set up main chart date axis
  valueAxis(mainChart); // Set ip main chart value axis
  barChartSeries(mainChart, 'date', 'data', 'Cases');
  // MAIN CHART ENDS HERE

  // RATE OF CHANGE CHART STARTS HERE
  rateOfChangeChart.data = rateOfChange; // Assign data
  chartTitle(
    rateOfChangeChart,
    'Rate of change\n[font-weight: normal font-size: smaller](new episodes per day)'
  ); // ROF chart title
  dateAxis(rateOfChangeChart); // Set up ROF chart date axis
  valueAxis(rateOfChangeChart); // Set up ROF value axis
  barChartSeries(rateOfChangeChart, 'date', 'total', 'Cases');
  // RATE OF CHANGE CHART ENDS HERE

  // CASES BY AGE GROUP CHART STARTS HERE
  ageGroupChart.data = ageGroupCases;
  chartTitle(
    ageGroupChart,
    'Cases by age group [font-weight: normal font-size: smaller](%)'
  ); // Age Group chart title
  pieChart(ageGroupChart, 'cases', 'ageGroup'); // Set up age group pie chart
  // CASES BY AGE GROUP CHART ENDS HERE

  // CASES BY AGE GROUP MOBILE CHART STARTS HERE
  ageGroupMobileChart.data = ageGroupCasesMobile;
  chartTitle(
    ageGroupMobileChart,
    'Cases by age group [font-weight: normal font-size: smaller](%)'
  ); // Age group mobile chart title
  categoryAxis(ageGroupMobileChart, 'date'); // Set up age group mobile category axis
  mobileValueAxis(ageGroupMobileChart); // Set up age group mobile value axis
  ageGroupCases.forEach((item, index, arr) => {
    createMobileSeries(
      ageGroupMobileChart,
      arr[index].ageGroup,
      arr[index].ageGroup
    );
  }); // Create series for the age group mobile chart
  // CASES BY AGE GROUP MOBILE CHART ENDS HERE

  // CASES BY REGION CHART STARTS HERE
  regionsChart.data = regionCases;
  chartTitle(
    regionsChart,
    'Cases by region\n[font-weight: normal font-size: smaller](total cases to date)'
  ); // Regions chart title
  pieChart(regionsChart, 'cases', 'region'); // Set up regions pie chart
  // CASES BY REGION CHART ENDS HERE

  // CASES BY REGION MOBILE CHART STARTS HERE
  regionsMobileChart.data = regionCasesMobile;
  chartTitle(
    regionsMobileChart,
    'Cases by region\n[font-weight: normal font-size: smaller](total cases to date)'
  ); // Regions mobile chart title
  categoryAxis(regionsMobileChart, 'date'); // Set up regions mobile chart category axis
  mobileValueAxis(regionsMobileChart); // Set up regions mobile chart value axis
  regionCases.forEach((item, index, arr) => {
    createMobileSeries(
      regionsMobileChart,
      arr[index].region,
      arr[index].region
    );
  }); // Create series for the regions mobile chart
  // CASES BY REGION MOBILE CHART ENDS HERE

  // TESTS CHART STARTS HERE
  testsChart.data = tests;
  testsChart.numberFormatter.numberFormat = '#,###.#';
  if (window.matchMedia('(min-width: 950px)').matches) {
    testsChart.innerRadius = '60rem';
  } else {
    testsChart.innerRadius = '50rem';
    testsChart.legend = new am4charts.Legend();
    testsChart.legend.labels.template.fontSize = 'x-small';
    testsChart.legend.labels.template.text = `[bold]{category}[/]:\n{value}`;
  }
  donutChartLabel(
    testsChart,
    `[bold]${new Intl.NumberFormat('en-CA').format(
      tests.map((item) => item.value).reduce((a, b) => a + b)
    )}\npeople\ntested`
  );
  donutChartSeries(testsChart, 'value', 'number');
  // TESTS CHART ENDS HERE

  // HOSPITALIZATIONS CHART STARTS HERE
  hospChart.data = hospitalizations;
  hospChart.numberFormatter.numberFormat = '#,###.#';
  if (window.matchMedia('(min-width: 950px)').matches) {
    hospChart.innerRadius = '65rem';
  } else {
    hospChart.innerRadius = '60rem';
    hospChart.legend = new am4charts.Legend();
    hospChart.legend.labels.template.fontSize = 'x-small';
    hospChart.legend.labels.template.text = `[bold]{category}[/]:\n{value}`;
  }
  donutChartLabel(
    hospChart,
    `[bold]${new Intl.NumberFormat('en-CA').format(
      totalHosp
    )}\npeople\nhospitalized`
  );
  donutChartSeries(hospChart, 'value', 'number');
  // HOSPITALIZATIONS CHART ENDS HERE

  // DEATHS BY AGE GROUP CHART STARTS HERE
  ageGroupDeathsChart.data = deathsByAgeGroup;
  chartTitle(
    ageGroupDeathsChart,
    'Deaths by age group [font-weight: normal font-size: smaller](%)'
  ); // Age Group Deaths chart title
  pieChart(ageGroupDeathsChart, 'deaths', 'ageGroup'); // Set up age group deaths pie chart
  // DEATHS BY AGE GROUP CHART ENDS HERE

  // DEATHS BY AGE GROUP MOBILE CHART STARTS HERE
  ageGroupDeathsMobileChart.data = ageGroupDeathsMobile;
  chartTitle(
    ageGroupDeathsMobileChart,
    'Deaths by age group [font-weight: normal font-size: smaller](%)'
  ); // Age group mobile chart title
  categoryAxis(ageGroupDeathsMobileChart, 'date'); // Set up age group deaths mobile category axis
  mobileValueAxis(ageGroupDeathsMobileChart); // Set up age group  deathsmobile value axis
  deathsByAgeGroup.forEach((item, index, arr) => {
    createMobileSeries(
      ageGroupDeathsMobileChart,
      arr[index].ageGroup,
      arr[index].ageGroup
    );
  }); // Create series for the age group deaths mobile chart
  // DEATHS BY AGE GROUP MOBILE CHART ENDS HERE

  // DEATHS BY REGION CHART STARTS HERE
  regionDeathsChart.data = regionDeaths;
  chartTitle(
    regionDeathsChart,
    'Deaths by region\n[font-weight: normal font-size: smaller](total cases to date)'
  ); // Deaths by Regions chart title
  pieChart(regionDeathsChart, 'deaths', 'region'); // Set up deaths by regions pie chart
  // DEATHS BY REGION CHART ENDS HERE

  // DEATHS BY REGION MOBILE CHART STARTS HERE
  regionDeathsMobileChart.data = regionDeathsMobile;
  chartTitle(
    regionDeathsMobileChart,
    'Deaths by region\n[font-weight: normal font-size: smaller](total cases to date)'
  ); // Deaths by Regions mobile chart title
  categoryAxis(regionDeathsMobileChart, 'date'); // Set up deaths by regions mobile chart category axis
  mobileValueAxis(regionDeathsMobileChart); // Set up deaths by regions mobile chart value axis
  regionDeaths.forEach((item, index, arr) => {
    createMobileSeries(
      regionDeathsMobileChart,
      arr[index].region,
      arr[index].region
    );
  }); // Create series for the deaths by regions mobile chart
  // DEATHS BY REGION MOBILE CHART ENDS HERE
};

getData();
