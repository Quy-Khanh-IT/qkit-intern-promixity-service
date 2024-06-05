'use client'
import React from 'react'
import PieChart from './components/PieChart'
import SplineChart from './components/SplineChart'
import { Col, Row } from 'antd'
import BarChart from './components/BarChart'

const Dashboard: React.FC = () => {
  return (
    <>
      {/* <PieChart /> */}
      <Row className='gap-5'>
        <Col span={24} className='d-flex justify-content-center'>
          <Col span={16}>
            <SplineChart />
          </Col>
        </Col>
        <Col span={24} className='d-flex'>
          <Col span={12}>
            <PieChart />
          </Col>
          <Col span={11}>
            <BarChart />
          </Col>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard
