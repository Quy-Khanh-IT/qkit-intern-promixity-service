/* eslint-disable */
'use client'
import { subFrontFamily } from '@/configs/themes/light';
import { useGetCategoryStatisticQuery } from '@/services/statistic.service';
import { ICategoryStatistic } from '@/types/statistic';
import $ from 'jquery';
import React, { useEffect, useMemo } from 'react';
import './chart.scss';
import dynamic from 'next/dynamic';

declare const CanvasJS: any;

const generateChartFormat = (data: ICategoryStatistic) => ({
  animationEnabled: true,
  title: {
    text: `Categories (${data.total_category})`,
    fontFamily: subFrontFamily,
    fontSize: 24,
    fontWeight: 600,
    paddingBottom: 60
  },
  axisX: {
    interval: 1,
  },
  axisY: {
    title: "Business Quantity",
    includeZero: true,
  },
  data: [
    {
      type: "bar",
      toolTipContent: "{label}: {y} enterprises",
      dataPoints: data.categories.map(category => ({
        label: category.name,
        y: category.total_business,
      })),
    },
  ],
});

const _BarChart: React.FC = () => {
  const { data: categoryStatisticData} = useGetCategoryStatisticQuery();
  const chartFormat = useMemo(() => {
    return categoryStatisticData ? generateChartFormat(categoryStatisticData) : null;
  }, [categoryStatisticData]);

  useEffect(() => {
    if (chartFormat) {
      $(() => {
        const _barChart = new CanvasJS.Chart('dashboard-bar-chart', chartFormat);
        _barChart.render();
      });
    }
  }, [chartFormat]);

  return (
    <>
      <div id='dashboard-bar-chart' className='chart' style={{ height: '350px', width: '100%' }}></div>
    </>
  );
}

const BarChartDynamic = dynamic(() => Promise.resolve(_BarChart), { ssr: false })

const BarChart = (): React.ReactNode => {
  return <BarChartDynamic />
}

export default BarChart;
