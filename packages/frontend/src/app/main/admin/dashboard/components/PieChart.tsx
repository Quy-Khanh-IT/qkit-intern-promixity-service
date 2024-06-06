/* eslint-disable */
'use client'
import React, { useEffect, useMemo } from 'react'
import { subFrontFamily } from '@/configs/themes/light';
import $ from 'jquery'
import './chart.scss'
import { useGetBusinessStatusStatisticQuery } from '@/services/statistic.service';
import { IBusinessStatusStatistic } from '@/types/statistic';

declare const CanvasJS: any;

const pieChartColor= ['#65aac2', '#7c659d', '#5cbdaa', '#a1ba65', '#b25752']

const generateChartFormat = (data: IBusinessStatusStatistic) => ({
  animationEnabled: true,
  title: {
    text: `Businesses (5023)`,
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
    dataPoints: data.data.map((item, index) => ({
      label: item.status,
      y: item.total,
      color: pieChartColor[index >= pieChartColor.length ? index % pieChartColor.length : index]
    }))
  }]
})

const PieChart: React.FC = () => {
  const {data: businessStatusStatisticData} = useGetBusinessStatusStatisticQuery()
  const chartFormat = useMemo(() => {
    return businessStatusStatisticData ? generateChartFormat(businessStatusStatisticData) : null;
  }, [businessStatusStatisticData]);

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
