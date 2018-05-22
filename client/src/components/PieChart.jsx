import React from 'react'
import Plot from 'react-plotly.js'

class PieChart extends React.Component {
  render() {
    const data = [{ 
      values: this.props.numbers, 
      labels: this.props.names, 
      type: 'pie',
      hole: .4}]
    const layout = {width: null, height: null, title: "User Participation"}
    return (
      <Plot data={data} layout={layout} />
    )
  }
}

export default PieChart
