import React from 'react'
import './admin-sign-in.scss'
import { Col, Flex, Space, Typography } from 'antd'

const AdminLogin: React.FC = () => {
  return (
    <div className='--admin-sign-in-wrapper'>
      <div className='container'>
        <div className='design'>
          <div className='pill-1 rotate-45'></div>
          <div className='pill-2 rotate-45'></div>
          <div className='pill-3 rotate-45'></div>
          <div className='pill-4 rotate-45'></div>
        </div>
        {/* <div className='login'>
          
        </div> */}
        <Flex vertical justify='center'>
          <Flex align='center' justify='center' gap='large'>
            <Col span={18} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              <h3 className='title'>Admin Login</h3>
              <div className='text-input w-100'>
                <i className='ri-user-fill'></i>
                <input type='text' placeholder='Username' />
              </div>
              <div className='text-input w-100'>
                <i className='ri-lock-fill'></i>
                <input type='password' placeholder='Password' />
              </div>
              <button className='login-btn w-100'>LOGIN</button>
            </Col>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}

export default AdminLogin
