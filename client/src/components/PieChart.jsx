import React from 'react'
import Plot from 'react-plotly.js'

const PieChart = (props) => {
  const data = [{ 
    values: props.values, 
    labels: props.labels, 
    name: props.title,
    type: 'pie'
  }]
  const layout = {
    title: props.title,
    width: 500 * (props.x || 1), 
    height: 600 * (props.y || 1), 
    paper_bgcolor: '#7395ae', 
    plot_bgcolor: '#7395ae',
    margin: {b: '50'},
    showlegend: false
  }
  return <Plot data={data} layout={layout} />
}

export default PieChart
