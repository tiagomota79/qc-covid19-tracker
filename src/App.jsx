import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Headline from './Headline.jsx';
import Graph from './Graph.jsx';
import UpdateDB from './UpdateDB.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finishedLoading: false,
      scrape: [],
      lastdoc: [],
      alldata: [],
    };
  }

  async componentDidMount() {
    const responses = await Promise.all([
      await fetch('/scrape'),
      await fetch('/alldata'),
      await fetch('/lastdoc'),
    ]);
    const [scrape, alldata, lastdoc] = await Promise.all(
      responses.map(async response => await response.json())
    );
    console.log('scrape', scrape);
    console.log('alldata', alldata);
    console.log('lastdoc', lastdoc);

    this.setState({
      scrape: scrape,
      lastdoc: lastdoc,
      alldata: alldata,
      finishedLoading: true,
    });
  }

  //   renderHeadline() {
  //     console.log(this.state.scrape);
  //     return <Headline data={this.state.scrape} />;
  //   }

  //   renderGraph() {
  //     console.log(this.state.alldata);
  //     return <Graph data={this.state.alldata} />;
  //   }

  render = () => {
    if (!this.state.finishedLoading) {
      return (
        <div>
          {/*<Loading />*/}
          <div>App is loading</div>
        </div>
      );
    }
    return <div>The app will go here</div>;
  };
}

export default App;
