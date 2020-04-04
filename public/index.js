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

// Get data from server and generate graph
const getData = async () => {
  // Scrape data from government website and last document on database
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
    const body = document.body || document.getElementsByTagName('BODY')[0];
    const footer = document.getElementById('footer');
    const chartDiv = document.createElement('div');
    chartDiv.setAttribute('id', attribute);
    body.insertBefore(chartDiv, footer);
  }

  // Placeholder for complete dataset
  let alldata;

  // Compare scrape data with last document. If total cases number is the same, no action is performed on database. If they are different, the database is updated.
  if (scrape.total !== lastdoc[lastdoc.length - 1].total) {
    const update = await fetch('http://localhost:3000/updatedb');
    alldata = await update.json();
    document.body.removeChild(spinner);
    createChartDiv('mainchartdiv');
    createChartDiv('regionchartdiv');
  } else {
    const alldataFetch = await fetch('http://localhost:3000/alldata');
    alldata = await alldataFetch.json();
    document.body.removeChild(spinner);
    createChartDiv('mainchartdiv');
    createChartDiv('regionchartdiv');
  }

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

  // Get difference bewteen today's cases and yesterday's cases
  const diff =
    alldata[alldata.length - 1].total - alldata[alldata.length - 2].total;

  // Create headline, source and disclaimer
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

  // Create charts instances
  let mainChart = am4core.create('mainchartdiv', am4charts.XYChart); // This is the main chart, showing the cumulative cases by episode date
  let regionsChart = am4core.create('regionchartdiv', am4charts.PieChart); // This is the secondary chart, showing the cases by region

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_material);
  // Themes end

  // Assign data to charts
  mainChart.data = alldata;
  regionsChart.data = scrape.regions;
  console.log('Main Chart data', mainChart.data);
  console.log('Regions Chart data', regionsChart.data);

  // Set up main chart title
  let title = mainChart.titles.create();
  title.text = 'Cumulative Cases by Episode Date';
  title.fontSize = '1rem';
  title.marginTop = 30;
  title.marginBottom = 10;
  title.fontWeight = 'bold';
  title.color = am4core.color('dodgerblue');

  // Create main chart axes
  let dateAxis = mainChart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;
  dateAxis.renderer.grid.template.strokeOpacity = 0;
  dateAxis.renderer.labels.template.horizontalCenter = 'right';
  dateAxis.renderer.labels.template.verticalCenter = 'middle';
  dateAxis.renderer.labels.template.rotation = 270;

  let casesAxis = mainChart.yAxes.push(new am4charts.ValueAxis());

  // Create main chart series
  let casesSeries = mainChart.series.push(new am4charts.ColumnSeries());
  casesSeries.dataFields.dateX = 'date';
  casesSeries.dataFields.valueY = 'total';
  //   casesSeries.strokeWidth = 1.5;
  //   casesSeries.fillOpacity = 1;
  //   casesSeries.stroke = am4core.color('dodgerblue');
  //   casesSeries.columns.template.fill = am4core.color('dodgerblue');
  casesSeries.tooltipText = '{value}';
  casesSeries.name = 'Cases';

  mainChart.cursor = new am4charts.XYCursor();
  mainChart.cursor.snapToSeries = casesSeries;
  mainChart.cursor.dateAxis = dateAxis;

  // Create regions chart series
  let pieSeries = regionsChart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = 'cases';
  pieSeries.dataFields.category = 'region';
};

getData();
