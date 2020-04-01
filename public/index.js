// Create chart instance
let chart = am4core.create('chartdiv', am4charts.XYChart);

// Themes begin
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_material);
// Themes end

console.log('chart data', chart.data);

// Get data from server and generate graph
const getData = async () => {
  const responses = await Promise.all([
    await fetch('http://localhost:3000/scrape'),
    await fetch('http://localhost:3000/alldata'),
    await fetch('http://localhost:3000/lastdoc'),
  ]);
  const [scrape, alldata, lastdoc] = await Promise.all(
    responses.map(async response => await response.json())
  );
  console.log('scrape', scrape);
  console.log('alldata', alldata);
  console.log('lastdoc', lastdoc);

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

    let dateToShow = `${month} ${day}, ${year}`;
    return dateToShow;
  }

  // Get difference bewteen today's cases and yesterday's cases
  const diff =
    alldata[alldata.length - 1].total - alldata[alldata.length - 2].total;

  // Account for government website not being updated yet
  if (scrape.total === alldata[alldata.length - 1].total) {
  }

  // Assign data to chart
  chart.data = alldata;
  console.log('Chart data', chart.data);

  // Create headline, soucre and disclaimer
  function createTextElement(elementId, attribute, innerHTML) {
    const htmlElement = document.getElementById(elementId);
    const element = document.createElement('div');
    element.setAttribute('class', attribute);
    element.innerHTML = innerHTML;
    htmlElement.appendChild(element);
  }

  createTextElement('headline', 'headline', `As of ${dateLong()}, Quebec has`);
  createTextElement('headline', 'cases-headline', scrape.total);
  createTextElement(
    'headline',
    'headline',
    `confirmed COVID-19 cases (up ${diff} from yesterday).`
  );
  createTextElement(
    'footer',
    'source',
    `Source:
  <a
    href="https://www.quebec.ca/sante/problemes-de-sante/a-z/coronavirus-2019/situation-coronavirus-quebec/"
    >Quebec.ca</a
  >`
  );
  createTextElement(
    'footer',
    'disclaimer',
    'This is a personal project, it is not meant to alarm anyone or cause panic. All the data is real, collected daily from the Quebec government website. For more information on the COVID-19 spread, consult the source above.'
  );

  // Create axes
  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;
  dateAxis.renderer.grid.template.strokeOpacity = 0;

  let casesAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  let casesSeries = chart.series.push(new am4charts.ColumnSeries());
  casesSeries.dataFields.dateX = 'date';
  casesSeries.dataFields.valueY = 'total';
  //   casesSeries.strokeWidth = 1.5;
  //   casesSeries.fillOpacity = 1;
  //   casesSeries.stroke = am4core.color('dodgerblue');
  //   casesSeries.columns.template.fill = am4core.color('dodgerblue');
  casesSeries.tooltipText = '{value}';
  casesSeries.name = 'Cases';

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.snapToSeries = casesSeries;
  chart.cursor.dateAxis = dateAxis;
};

getData();
