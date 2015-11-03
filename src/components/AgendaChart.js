import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import StyleSheet from 'styles/agenda.styl';
import d3 from 'd3';

export default class AgendaChart extends Component {
  static propTypes = {
    items: PropTypes.array
  }
  createChart(items) {
    const data = [];
    const barHeight = 20;
    const x = d3.scale.linear()
      .domain([0, 8])
      .range([0, 400]);
    items.map(item => {
      if(item.location.toLowerCase() === 'biggie') {
        data.push(item);
      }
    });
    console.log(data);
    const chart = ReactDOM.findDOMNode(this.refs.chart);
    const d3Chart = d3.select(chart)
      .attr("width", 400)
      .attr("height", 500);
    const bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
    bar.append("rect")
        .attr("width", x)
        .attr("height", barHeight - 1);
  }
  render() {
    this.createChart(this.props.items);
    return (
      <div className={StyleSheet.container}>
        <svg ref="chart"/>
      </div>
    );
  }
}
// {this.props.items.map(item => {
//  const morning = moment().hour(9).minutes(0);
//  const eve = moment().hour(17).minutes(0);
//  const fromTop = moment(item.start.dateTime).diff(morning, 'hours', true);
//  const fromBottom = moment(item.end.dateTime).diff(eve, 'hours', true);
//  return (
    
//  );
// })}
