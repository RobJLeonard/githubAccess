import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.xScale = scaleBand()
    this.yScale = scaleLinear()

    this.createBarChart = this.createBarChart.bind(this)
  }
  componentDidMount() {
    this.createBarChart()
  }
  componentDidUpdate() {
    this.createBarChart()
  }
  createBarChart() {
    const svgHeight = 500;
    const svgWidth = 800;
    const node = this.node
    const barPadding = 2;
    //const barWidth = (this.node.width.baseVal.value / this.props.data.length);
    const barWidth = 80;
    const dataMax = max(this.props.data)
    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, this.props.size[1]])
    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr("y", function (d) {
        return svgHeight - d
      })
      .attr("height", function (d) {
        return d;
      })
      .attr("width", barWidth - barPadding)
      .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0];
        return "translate(" + translate + ")";
      });

    // select(node)
    //   .selectAll('rect')
    //   .data(this.props.data)
    //   .exit()
    //   .remove()

    // select(node)
    //   .selectAll('rect')
    //   .data(this.props.data)
    //   .style('fill', this.props.color)
    //   .attr('x', (d, i) => i * 15)
    //   .attr('y', d => this.props.size[1] - yScale(d))
    //   .attr('height', d => yScale(d))
    //   .attr('width', 15)
  }
  render() {
    return <svg ref={node => this.node = node}
      width={800} height={500}>
    </svg>
  }
}
export default BarChart
