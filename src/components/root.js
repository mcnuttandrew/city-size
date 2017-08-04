import React from 'react';

import {EXPLANATION} from '../constants';
import SizeLine from './size-line';

class RootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: 1
    };
  }
  render() {
    const {dataset} = this.state;
    return (
      <div className="container" style={{
        background: '#0f201a'
      }}>
        <div className="header">
          <div className="title">CITY SIZE!</div>
          <div className="subtitle">by Andrew McNutt</div>
          <div className="explanation">{EXPLANATION}</div>
        </div>
        <div onClick={() => {
          this.setState({dataset: (dataset + 1) % 2});
        }}> BUTTON </div>
        <SizeLine dataset={dataset}/>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
