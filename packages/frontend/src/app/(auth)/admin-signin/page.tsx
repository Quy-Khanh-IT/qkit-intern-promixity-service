import React from 'react'
import './admin-sign-in.scss'
import { Space } from 'antd'

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
        <Space vertical>
          <h3 className='title'>User Login</h3>
          <div className='text-input'>
            <i className='ri-user-fill'></i>
            <input type='text' placeholder='Username' />
          </div>
          <div className='text-input'>
            <i className='ri-lock-fill'></i>
            <input type='password' placeholder='Password' />
          </div>
          <button className='login-btn'>LOGIN</button>
        </Space>
      </div>
    </div>
  )
}

export default AdminLogin
