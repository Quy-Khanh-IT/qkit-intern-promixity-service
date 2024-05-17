import '../modal.scss'

import { Button, Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import ChangePasswordForm from './ChangePasswordForm'
import { IModalMethods } from '../modal'

interface IChangePassword {
  id: string
  value: string
  description: string
}

const _ChangePasswordModal: React.ForwardRefRenderFunction<IModalMethods, IChangePassword> = ({id}, ref) => {
  // const [open, setOpen] = useState(false)

  // // Expose methods via ref
  // useImperativeHandle(ref, () => ({
  //   showModal: () => setOpen(true),
  //   hideModal: () => setOpen(false)
  // }))

  // const handleCancel = () => {
  //   setOpen(false)
  //   console.log('close modal')
  // }

  // return (
  //   <>
  //     <Modal
  //       // className='change-password-modal'
  //       // title='Change password'
  //       // open={open}
  //       // onCancel={handleCancel}
  //       // transitionName='ant-move-up'
  //       className='view-modal'
  //       title='Change password'
  //       open={open}
  //       onCancel={handleCancel}
  //       transitionName='ant-move-up'
  //       width={'400px'}
  //       footer={[
  //         <Button className='btn-cancel' onClick={handleCancel} type='primary' key='cancel'>
  //           Close
  //         </Button>
  //       ]}
  //     >
  //       <div className='content-box pb-3'>
  //         {/* <ChangePasswordForm closeModal={handleCancel} /> */}
  //       </div>
  //     </Modal>
  //   </>
  // )
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    showModal: () => setOpen(true),
    hideModal: () => setOpen(false)
  }))

  const onChangeSelection = (value: string) => {
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleDecentralizeRole = async () => {
   
  }

  const handleOk = () => {

  }

  return (
    <>
      <Modal
        className='view-modal'
        title='Decentralize'
        open={open}
        transitionName='ant-move-up'
        width={'600px'}
        onCancel={handleCancel}
        footer={[
          <Button className='btn-cancel' onClick={handleCancel} type='primary' key='cancel'>
            Close
          </Button>,
          <Button
            // className={isConfirm ? 'btn-primary' : ''}
            className='btn-primary'
            onClick={handleOk}
            type='primary'
            key='ok'
            // disabled={!isConfirm}
            // loading={confirmLoading}
          >
            Confirm
          </Button>
        ]}
      >
        <div className='content-box'>
          
        </div>
      </Modal>
    </>
  )
}

const ChangePasswordModal = forwardRef(_ChangePasswordModal)
export default ChangePasswordModal
