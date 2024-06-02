/* eslint-disable */
'use client'
import React, { useEffect } from 'react'
// import $ from 'jquery'
import { subFrontFamily } from '@/configs/themes/light';

declare var CanvasJS: any;

const PieChart: React.FC = () => {
  useEffect(() => {
    $(() => {
      // Pie chart
      const chart1 = new CanvasJS.Chart('dashboard-pie-chart', {
        animationEnabled: true,
        title: {
          text: `Users (5023)`,
          fontFamily: subFrontFamily,
          fontSize: 20,
          fontWeight: 600
        },
        data: [
          {
            type: 'pie',
            startAngle: 240,
            // yValueFormatString: '##0.00"%"',
            indexLabel: '{x} {y}',
            dataPoints: [
              { x: 'Hotel', y: 19034.5 },
              { x: 'C', y: 20015 },
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
      <div id='dashboard-pie-chart' style={{ height: '300px', width: '100%' }}></div>
    </>
  )
}

export default PieChart
