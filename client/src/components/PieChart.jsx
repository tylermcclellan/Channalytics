import React from 'react'
import Plot from 'react-plotly.js'

class PieChart extends React.Component {
  render() {
    const data = [{ 
      values: this.props.numbers, 
      labels: this.props.names, 
      type: 'pie',
      hole: .3
    }]
    const layout = {
      width: null, 
      height: null, 
      paper_bgcolor: '#7395ae', 
      plot_bgcolor: '#7395ae',
      margin: {b: '100'}
    }
    return (
      <div>
        <h2>User Participation</h2>
        <Plot data={data} layout={layout} />
      </div>
    )
  }
}

export default PieChart
