import React from 'react';
import {XYPlot, LabelSeries, LineSeries, MarkSeries} from 'react-vis';

import {getDomains} from './utils';

import {forceDirectLabels} from './force-direct-with-d3';

import {prepData} from './utils';
import BuildingHeights from '../data/hashed-max-heights';
import CityElevations from '../data/city-elevations';

const datasets = [
  BuildingHeights,
  CityElevations
];

const MARGIN = {
  top: 100,
  bottom: 100,
  right: 100,
  left: 100
};

const BONUS = {
  line1: 0,
  line2: 17,
  line3: 17 * 2
};

class SizeLine extends React.Component {
  constructor(props) {
    super(props);
    const preppedData = prepData(datasets[props.dataset], props.dataset);
    this.state = {
      mappedAndForced: preppedData,
      originalData: preppedData
    };
  }

  componentWillMount() {
    const getUpdatedPositions = new Promise((resolve, reject) => {
      const updated = forceDirectLabels(this.state.originalData);
      resolve(updated);
    });
    getUpdatedPositions.then(mappedAndForced => {
      this.setState({mappedAndForced});
    });
  }

  componentWillReceiveProps(newProps) {
    const originalData = prepData(datasets[newProps.dataset], newProps.dataset);
    this.setState({
      originalData
    });
    const getUpdatedPositions = new Promise((resolve, reject) => {
      const updated = forceDirectLabels(originalData);
      resolve(updated);
    });
    getUpdatedPositions.then(mappedAndForced => {
      this.setState({mappedAndForced, originalData});
    });
  }

  updateLabel(d, labelKey, index) {
    const originalPoint = this.state.originalData[index];
    if (!originalPoint) {
      return d;
    }
    const xDelta = this.state.originalData[index].x - d.x;
    return ({
      ...d,
      y: d.y - BONUS[labelKey],
      label: d[labelKey],
      style: {
        textAnchor: xDelta < 0 ? 'start' : 'end',
        fontFamily: 'Roboto-Black',
        alignmentBaseline: 'middle',
        fill: '#c2bcae'
      }
    });
  }

  render() {
    const {mappedAndForced, originalData} = this.state;

    const {lines} = originalData.reduce((res, city, index) => {
      res.lines.push(<LineSeries
        animation
        key={index}
        color={city.color}
        data={[
          {y: city.y, x: 0},
          {y: city.y, x: city.x}
        ]}
      />);

      res.lines.push(<LineSeries
        animation
        key={`${index}-dots`}
        color={city.color}
        style={{strokeDasharray: '2, 1'}}
        data={[
          {y: city.y, x: city.x},
          {y: mappedAndForced[index].y, x: mappedAndForced[index].x}
        ]}
      />);
      return res;
    }, {lines: []});

    const {yMin, yMax} = getDomains(originalData);
    const labelProps = {
      allowOffsetToBeReversed: false
    };
    return (
      <div>
        <XYPlot
          height={1000}
          width={2000}
          margin={MARGIN}>
          {lines}
          {
            // <XAxis tickFormat={d => `${d} SQ MI`} orientation="top" style={{
            //     text: {
            //       fontFamily: 'Roboto-Black'
            //     }
            //   }}/>
          }
          <MarkSeries
            style={{fillOpacity: 0.8}}
            data={originalData}
            size="2"
            colorType="literal"
            animation/>
          <LabelSeries
            data={mappedAndForced.map((d, index) => this.updateLabel(d, 'line1', index))}
            {...labelProps}/>
          <LabelSeries
            data={mappedAndForced.map((d, index) => this.updateLabel(d, 'line2', index))}
            {...labelProps}/>
          <LabelSeries
            data={mappedAndForced.map((d, index) => this.updateLabel(d, 'line3', index))}
            {...labelProps}/>
          <LineSeries key={'refLine'} data={[
            {y: yMin, x: 0},
            {y: yMax, x: 0}
          ]} style={{
            strokeDasharray: '2, 2',
            stroke: 'white',
            strokeWidth: 0.5
          }}/>
        </XYPlot>
      </div>
    );
  }
}
SizeLine.displayName = 'SizeLine';
export default SizeLine;
