/* eslint-disable */
'use client'
import React, { useEffect, useMemo } from 'react'
import { subFrontFamily } from '@/configs/themes/light';
import $ from 'jquery'
import './chart.scss'

declare const CanvasJS: any;

const generateChartFormat = () => ({
  animationEnabled: true,
  title: {
    text: `Users (5023)`,
    fontFamily: subFrontFamily,
    fontSize: 24,
    fontWeight: 600
  },
  data: [{
    type: "doughnut",
    innerRadius: "40%",
    showInLegend: true,
    legendText: "{label}",
    indexLabel: "{label}: #percent%",
    dataPoints: [
      { label: "Department Stores", y: 6492917 },
      { label: "Discount Stores", y: 7380554 },
      { label: "Stores for Men / Women", y: 1610846 },
      { label: "Teenage Specialty Stores", y: 950875 },
      { label: "All other outlets", y: 900000 }
    ]
  }]
})

const PieChart: React.FC = () => {
  const chartFormat = useMemo(() => generateChartFormat(), []);

  useEffect(() => {
    $(() => {
      const _pieChart = new CanvasJS.Chart('dashboard-pie-chart', chartFormat)
      _pieChart.render()
    })
  }, [chartFormat])

  return (
    <>
      <div id='dashboard-pie-chart' className='chart' style={{ height: '340px', width: '100%' }}></div>
    </>
  )
}

export default PieChart
