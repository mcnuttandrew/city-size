import React from 'react';
import {XYPlot, LineSeries, LabelSeries} from 'react-vis';

class Legend extends React.Component {
  render() {
    const labelStyle = {
      fontFamily: 'Roboto-Black',
      alignmentBaseline: 'middle',
      fill: '#c2bcae'
    };

    return (
      <div>
        <XYPlot
          xDomain={[0, 10]}
          yDomain={[0, 10]}
          height={300}
          width={500}>
          <LineSeries
            style={{strokeDasharray: '1, 1'}}
            color={'#fff'}
            data={[
              {x: 0, y: 0},
              {x: 10, y: 0},
              {x: 10, y: 10},
              {x: 0, y: 10},
              {x: 0, y: 0}
            ]}/>
          <LineSeries
            color={'#a61618'}
            data={[
              {x: 0, y: 5},
              {x: 4, y: 5}
            ]}/>
          <LineSeries
            style={{strokeDasharray: '2, 1'}}
            color={'#a61618'}
            data={[
              {x: 4, y: 5},
              {x: 6, y: 6}
            ]}/>
          <LabelSeries
            data={[
              {x: 7, y: 9, label: 'SAN FRANCISCO, CA', style: labelStyle},
              {x: 7, y: 8, label: '46.9 SQ M', style: labelStyle},
              {x: 7, y: 7, label: '1.1k FT MAX', style: labelStyle}
            ]}
            />
        </XYPlot>
      </div>
    );
  }
}
Legend.displayName = 'Legend';
export default Legend;
