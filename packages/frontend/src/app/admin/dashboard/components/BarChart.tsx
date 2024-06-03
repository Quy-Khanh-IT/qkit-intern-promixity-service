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
    text: `Categories (6)`,
    fontFamily: subFrontFamily,
    fontSize: 24,
    fontWeight: 600,
    paddingBottom: 60
  },
  axisX: {
    interval: 1,
  },
  axisY: {
    title: "items",
    includeZero: true,
  },
  data: [
    {
      type: "bar",
      toolTipContent: "<b>{label}</b><br>Items: {y}",
      dataPoints: [
        { y: 21, label: "Video" },
        { y: 25, label: "Dining" },
        { y: 33, label: "Entertainment" },
        { y: 36, label: "News" },
        { y: 42, label: "Music" },
        { y: 49, label: "Social Networking" },
        { y: 50, label: "Maps/ Search" },
        { y: 55, label: "Weather" },
        { y: 61, label: "Games" }
      ],
    },
  ],
})

const BarChart: React.FC = () => {
  const chartFormat = useMemo(() => generateChartFormat(), []);

  useEffect(() => {
    $(() => {
      const _barChart = new CanvasJS.Chart('dashboard-bar-chart', chartFormat)
      _barChart.render()
    })
  }, [chartFormat])

  return (
    <>
      <div id='dashboard-bar-chart' className='chart' style={{ height: '350px', width: '100%' }}></div>
    </>
  )
}

export default BarChart
