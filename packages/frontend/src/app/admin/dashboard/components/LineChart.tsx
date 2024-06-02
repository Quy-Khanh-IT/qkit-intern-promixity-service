/* eslint-disable */
'use client'
import React, { useEffect } from 'react'
import $ from 'jquery'

declare var CanvasJS: any;

const LineChart: React.FC = () => {
  useEffect(() => {
    $(() => {
      // Pie chart
      const chart1 = new CanvasJS.Chart('chartContainer1', {
        animationEnabled: true,
        title: {
          text: `Authors ()`,
          fontFamily: 'Jost, sans-serif',
          fontSize: 20
          // fontWeight: 600
        },
        data: [
          {
            type: 'pie',
            startAngle: 240,
            yValueFormatString: '##0.00"%"',
            indexLabel: '{x} {y}',
            dataPoints: [
              { x: 23, y: 19034.5 },
              { x: 23, y: 20015 },
              { x: 23, y: 27342 },
              { x: 23, y: 20088 },
              { x: 23, y: 20234 },
              { x: 23, y: 29034 }
            ]
          }
        ]
      })
      chart1.render()
    })
  }, [])

  return (
    <>
      <div id='chartContainer1' style={{ height: '300px', width: '100%' }}></div>
      <script src='https://cdn.canvasjs.com/canvasjs.min.js' defer></script>
    </>
  )
}

export default LineChart
