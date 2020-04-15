// Auxiliary function to create HTML elements
function createHtmlElement(elementId, attribute, innerHTML) {
  const htmlElement = document.getElementById(elementId);
  const element = document.createElement('div');
  element.setAttribute('class', attribute);
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

// Get data from server and generate graph
const getData = async () => {
  // Scrape data from government website and get last document on database
  const responses = await Promise.all([
    await fetch('http://localhost:3000/scrape'),
    await fetch('http://localhost:3000/lastdoc'),
  ]);
  const [scrape, lastdoc] = await Promise.all(
    responses.map(async (response) => await response.json())
  );
  console.log('scrape', scrape);
  console.log('lastdoc', lastdoc);
  console.log('scrape total cases', scrape.total);
  console.log('lastdoc total cases', lastdoc[lastdoc.length - 1].total);

  // Function to create the divs where the charts will be placed
  function createChartDiv(attribute) {
    const footer = document.getElementById('footer');
    const chartDiv = document.createElement('div');
    chartDiv.setAttribute('id', attribute);
    body.insertBefore(chartDiv, footer);
  }

  // Placeholder for complete dataset
  let alldata;

  // Auxiliary function to perform several DOM manipulations only after the data is loades
  function domElements() {
    document.body.removeChild(spinner); // removes spinner after the data is loaded
    createChartDiv('mainchartdiv'); // Adds the div where the main chart will be placed
    createChartDiv('rateofchange'); // Adds the div where the rate of change chart will be placed
    createChartDiv('casesbyage'); // Adds the div where the cases by age group chart will be placed
    createChartDiv('casesbyagemobile'); // Adds the div where the mobile version of the cases by age group chart will be placed
    createChartDiv('regionchartdiv'); // Adds the div where the regions chart will be placed
    createChartDiv('regionchartmobilediv'); // Adds the div where the mobile version of the regions chart will be placed
  }

  // Compare scrape data with last document. If total cases number is the same, no action is performed on database. If they are different, the database is updated.
  if (scrape.total !== lastdoc[lastdoc.length - 1].total) {
    const update = await fetch('http://localhost:3000/updatedb');
    alldata = await update.json();
    domElements();
  } else {
    const alldataFetch = await fetch('http://localhost:3000/alldata');
    alldata = await alldataFetch.json();
    domElements();
  }

  // Get rate of change - difference between one day's cases and the previous day's cases
  let rateOfChange = [];
  for (let i = 0; i < alldata.length - 1; i++) {
    rateOfChange[i] = {
      date: alldata[i + 1].date,
      total: alldata[i + 1].total - alldata[i].total,
    };
  }

  // Get difference bewteen today's cases and yesterday's cases
  const diff = rateOfChange[rateOfChange.length - 1].total;

  // Add title to the #title div
  const title = document.createElement('H1');
  title.setAttribute('id', 'title');
  title.innerHTML = 'COVID-19 situation in Quebec';
  body.prepend(title);

  // Create headline, source, disclaimer, sourcecode and copyright
  createHtmlElement('headline', 'headline', `As of ${dateLong()}, Quebec has`);
  createHtmlElement('headline', 'cases-headline', scrape.total);
  createHtmlElement(
    'headline',
    'headline',
    `confirmed COVID-19 cases (up ${diff} from yesterday).`
  );
  createHtmlElement(
    'footer',
    'source',
    `Source:
  <a
    href="https://www.quebec.ca/sante/problemes-de-sante/a-z/coronavirus-2019/situation-coronavirus-quebec/"
    >Quebec.ca</a
  >`
  );
  createHtmlElement(
    'footer',
    'disclaimer',
    'This is a personal project, it is not meant to alarm anyone or cause panic. All the data is real, collected daily from the Quebec government website. For more information on the COVID-19 spread, consult the source above.'
  );
  createHtmlElement(
    'footer',
    'sourcecode',
    `<svg height="32" id="github" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg><a id="github_link" href="https://github.com/tiagomota79/qc-covid19-tracker">GitHub Repository</a>`
  );
  createHtmlElement('footer', 'copyright', '© 2020 Tiago Mota');

  // Create charts instances
  let mainChart = am4core.create('mainchartdiv', am4charts.XYChart); // This is the main chart, showing the cumulative cases by episode date
  let rateOfChangeChart = am4core.create('rateofchange', am4charts.XYChart); // This is the rate of change chart, showing number of new cases per day
  let ageGroupChart = am4core.create('casesbyage', am4charts.PieChart); // This is the seconda chart, showing the cases by age group
  let ageGroupMobileChart = am4core.create(
    'casesbyagemobile',
    am4charts.XYChart
  ); // This is the mobile version of the seconda chart, showing the cases by age group in a stacked bar chart
  let regionsChart = am4core.create('regionchartdiv', am4charts.PieChart); // This is the third chart, showing the cases by region
  let regionsMobileChart = am4core.create(
    'regionchartmobilediv',
    am4charts.XYChart
  ); // This is the mobile version of the third chart, showing the cases by region in a stacked bar chart

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_material);
  // Themes end

  // Add today's date as a value in the ageGroupMobileChart dataset
  scrape.casesByAgeMobile[0].date = dateLong();

  // Add today's date as a value in the regionsMobileChart dataset
  scrape.regionsMobile[0].date = dateLong();

  // Assign data to charts
  mainChart.data = alldata;
  rateOfChangeChart.data = rateOfChange;
  ageGroupChart.data = scrape.casesByAge;
  ageGroupMobileChart.data = scrape.casesByAgeMobile;
  regionsChart.data = scrape.regions;
  regionsMobileChart.data = scrape.regionsMobile;
  console.log('Main Chart data', mainChart.data);
  console.log('Rate of change data', rateOfChangeChart.data);
  console.log('Regions Chart data', regionsChart.data);
  console.log('Regions Mobile Chart data', regionsMobileChart.data);
  console.log('Age Group Chart data', ageGroupChart.data);
  console.log('Age Group Mobile Chart data', ageGroupMobileChart.data);

  // MAIN CHART STARTS HERE
  // Set up main chart title
  let mainChartTitle = mainChart.titles.create();
  mainChartTitle.text = 'Cumulative Cases by Episode Date';
  mainChartTitle.fontSize = '1rem';
  mainChartTitle.marginTop = 30;
  mainChartTitle.marginBottom = 10;
  mainChartTitle.fontWeight = 'bold';

  // Set input format for the dates in charts to match the date format in the database
  mainChart.dateFormatter.inputDateFormat = 'yyyy-M-d';

  // Create main chart axes
  let dateAxis = mainChart.xAxes.push(new am4charts.DateAxis());
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

  let casesAxis = mainChart.yAxes.push(new am4charts.ValueAxis());

  // Create main chart series
  let casesSeries = mainChart.series.push(new am4charts.ColumnSeries());
  casesSeries.dataFields.dateX = 'date';
  casesSeries.dataFields.valueY = 'total';
  //   casesSeries.strokeWidth = 1.5;
  casesSeries.fillOpacity = 1;
  //   casesSeries.stroke = am4core.color('dodgerblue');
  // casesSeries.columns.template.fill = am4core.color('dodgerblue');
  casesSeries.columns.template.tooltipText = '[bold]{dateX}[/]: {valueY}';
  casesSeries.tooltip.pointerOrientation = 'vertical';
  casesSeries.name = 'Cases';
  // MAIN CHART ENDS HERE

  // RATE OF CHANGE CHART STARTS HERE
  // Set up rate of change chart title
  let rateOfChangeChartTitle = rateOfChangeChart.titles.create();
  rateOfChangeChartTitle.text =
    '[bold]Rate of change[/]\n(new episodes per day)';
  rateOfChangeChartTitle.fontSize = '1rem';
  rateOfChangeChartTitle.marginTop = 30;
  rateOfChangeChartTitle.marginBottom = 10;
  rateOfChangeChartTitle.align = 'center';
  // rateOfChangeChartTitle.fontWeight = 'bold';

  // Set input format for the dates in charts to match the date format in the database
  rateOfChangeChart.dateFormatter.inputDateFormat = 'yyyy-M-d';

  // Create rate of change chart axes
  let rocDateAxis = rateOfChangeChart.xAxes.push(new am4charts.DateAxis());
  rocDateAxis.renderer.minGridDistance = 50;
  rocDateAxis.renderer.grid.template.strokeOpacity = 0;
  rocDateAxis.renderer.labels.template.location = 0;
  rocDateAxis.renderer.labels.template.horizontalCenter = 'right';
  rocDateAxis.renderer.labels.template.verticalCenter = 'middle';
  rocDateAxis.renderer.labels.template.rotation = 270;
  rocDateAxis.baseInterval = {
    timeUnit: 'day',
    count: 1,
  };

  let rocCasesAxis = rateOfChangeChart.yAxes.push(new am4charts.ValueAxis());

  // Create rate of change chart series
  let rocCasesSeries = rateOfChangeChart.series.push(
    new am4charts.ColumnSeries()
  );
  rocCasesSeries.dataFields.dateX = 'date';
  rocCasesSeries.dataFields.valueY = 'total';
  //   rocCasesSeries.strokeWidth = 1.5;
  rocCasesSeries.fillOpacity = 1;
  //   rocCasesSeries.stroke = am4core.color('dodgerblue');
  // rocCasesSeries.columns.template.fill = am4core.color('dodgerblue');
  rocCasesSeries.columns.template.tooltipText = '[bold]{dateX}[/]: {valueY}';
  rocCasesSeries.tooltip.pointerOrientation = 'vertical';
  rocCasesSeries.name = 'Cases';
  // RATE OF CHANGE CHART ENDS HERE

  // CASES BY AGE GROUP CHART STARTS HERE
  // Create cases by age group chart series
  let ageGroupPieSeries = ageGroupChart.series.push(new am4charts.PieSeries());
  ageGroupPieSeries.dataFields.value = 'cases';
  ageGroupPieSeries.dataFields.category = 'ageGroup';

  // Change cases by age group chart tooltip information
  ageGroupPieSeries.slices.template.tooltipText =
    '[bold]{category}[/]: {value}%';

  // Set up cases by age group chart title
  let ageGroupChartTitle = ageGroupChart.titles.create();
  ageGroupChartTitle.text = 'Cases by age group';
  ageGroupChartTitle.fontSize = '1rem';
  ageGroupChartTitle.marginTop = 30;
  ageGroupChartTitle.marginBottom = 10;
  ageGroupChartTitle.fontWeight = 'bold';
  // CASES BY AGE GROUP CHART ENDS HERE

  // CASES BY AGE GROUP MOBILE CHART STARTS HERE
  // Mobile chart axes
  let ageGroupMobileCategoryAxis = ageGroupMobileChart.xAxes.push(
    new am4charts.CategoryAxis()
  );
  ageGroupMobileCategoryAxis.dataFields.category = 'date';
  ageGroupMobileCategoryAxis.renderer.grid.template.location = 0;
  ageGroupMobileCategoryAxis.renderer.grid.template.strokeOpacity = 0;

  let ageGroupMobileValueAxis = ageGroupMobileChart.yAxes.push(
    new am4charts.ValueAxis()
  );
  ageGroupMobileValueAxis.renderer.inside = true;
  ageGroupMobileValueAxis.renderer.labels.template.disabled = true;
  ageGroupMobileValueAxis.min = 0;
  ageGroupMobileValueAxis.renderer.grid.template.strokeOpacity = 0;

  // Set up mobile regions chart title
  let ageGroupMobileChartTitle = ageGroupMobileChart.titles.create();
  ageGroupMobileChartTitle.text = 'Cases by age group';
  ageGroupMobileChartTitle.fontSize = '1rem';
  ageGroupMobileChartTitle.marginTop = 30;
  ageGroupMobileChartTitle.marginBottom = 10;
  ageGroupMobileChartTitle.fontWeight = 'bold';

  // Function to create series for the mobile regions chart
  function createAgeGroupSeries(field, name) {
    // Set up series
    let series = ageGroupMobileChart.series.push(new am4charts.ColumnSeries());
    series.name = name;
    series.dataFields.valueY = field;
    series.dataFields.categoryX = 'date';
    series.sequencedInterpolation = true;

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

  // Create a series for each age group
  scrape.casesByAge.forEach((item, index, arr) => {
    createAgeGroupSeries(arr[index].ageGroup, arr[index].ageGroup);
  });
  // CASES BY AGE GROUP MOBILE CHART ENDS HERE

  // CASES BY REGION CHART STARTS HERE
  // Create regions chart series
  let regionsPieSeries = regionsChart.series.push(new am4charts.PieSeries());
  regionsPieSeries.dataFields.value = 'cases';
  regionsPieSeries.dataFields.category = 'region';

  // Change regions chart tooltip information
  regionsPieSeries.slices.template.tooltipText =
    '[bold]{category}[/]: {value.value}';

  // Set up regions chart title
  let regionsChartTitle = regionsChart.titles.create();
  regionsChartTitle.text = 'Cases by region';
  regionsChartTitle.fontSize = '1rem';
  regionsChartTitle.marginTop = 30;
  regionsChartTitle.marginBottom = 10;
  regionsChartTitle.fontWeight = 'bold';
  // CASES BY REGION CHART ENDS HERE

  // CASES BY REGION MOBILE CHART STARTS HERE
  // Mobile chart axes
  let mobileCategoryAxis = regionsMobileChart.xAxes.push(
    new am4charts.CategoryAxis()
  );
  mobileCategoryAxis.dataFields.category = 'date';
  mobileCategoryAxis.renderer.grid.template.location = 0;
  mobileCategoryAxis.renderer.grid.template.strokeOpacity = 0;

  let mobileValueAxis = regionsMobileChart.yAxes.push(
    new am4charts.ValueAxis()
  );
  mobileValueAxis.renderer.inside = true;
  mobileValueAxis.renderer.labels.template.disabled = true;
  mobileValueAxis.min = 0;
  mobileValueAxis.renderer.grid.template.strokeOpacity = 0;

  // Set up mobile regions chart title
  let mobileRegionsChartTitle = regionsMobileChart.titles.create();
  mobileRegionsChartTitle.text = 'Cases by region';
  mobileRegionsChartTitle.fontSize = '1rem';
  mobileRegionsChartTitle.marginTop = 30;
  mobileRegionsChartTitle.marginBottom = 10;
  mobileRegionsChartTitle.fontWeight = 'bold';
  // CASES BY REGION MOBILE CHART ENDS HERE

  // Function to create series for the mobile regions chart
  function createRegionsSeries(field, name) {
    // Set up series
    let series = regionsMobileChart.series.push(new am4charts.ColumnSeries());
    series.name = name;
    series.dataFields.valueY = field;
    series.dataFields.categoryX = 'date';
    series.sequencedInterpolation = true;

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

  // Create a series for each region
  scrape.regions.forEach((item, index, arr) => {
    createRegionsSeries(arr[index].region, arr[index].region);
  });
};

getData();
