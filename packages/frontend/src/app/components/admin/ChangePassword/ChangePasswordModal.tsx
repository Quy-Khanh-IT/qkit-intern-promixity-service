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
  const [open, setOpen] = useState(false)

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    showModal: () => setOpen(true),
    hideModal: () => setOpen(false)
  }))

  const handleCancel = () => {
    setOpen(false)
    console.log('close modal')
  }

  return (
    <>
      <Modal
        className='view-modal'
        title='Change password'
        open={open}
        onCancel={handleCancel}
        // transitionName='ant-move-up'
        centered={true}
        width={'400px'}
        footer={null}
      >
        <div className='content-box pb-3'>
          <ChangePasswordForm closeModal={handleCancel} />
        </div>
      </Modal>
    </>
  )
}

const ChangePasswordModal = forwardRef(_ChangePasswordModal)
export default ChangePasswordModal
