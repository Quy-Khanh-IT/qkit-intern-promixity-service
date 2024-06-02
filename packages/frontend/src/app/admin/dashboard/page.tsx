'use client'
import React from 'react'
import PieChart from './components/PieChart'
import SplineChart from './components/SplineChart'
import { Col, Row } from 'antd'

const Dashboard: React.FC = () => {
  return (
    <>
      {/* <PieChart /> */}
      <Row>
        <Col span={24} className='d-flex justify-content-center'>
          <Col span={16}>
            <SplineChart />
          </Col>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard
