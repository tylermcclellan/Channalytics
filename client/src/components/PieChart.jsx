import Plot from 'react-plotly.js'
import React from 'react'

const PieChart = (props) => {
  const data = [{ 
    labels: props.labels, 
    name: props.title,
    type: 'pie',
    values: props.values 
  }]
  const layout = {
    height: 600 * (props.y || 1), 
    margin: {b: '50'},
    paper_bgcolor: '#7395ae', 
    plot_bgcolor: '#7395ae',
    showlegend: false,
    title: props.title,
    width: 500 * (props.x || 1)
  }
  return <Plot data={data} layout={layout} />
}

export default PieChart
