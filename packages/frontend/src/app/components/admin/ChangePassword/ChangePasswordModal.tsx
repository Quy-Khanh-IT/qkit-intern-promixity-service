import '../modal.scss'

import { Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { IModalMethods } from '../modal'
import ChangePasswordForm from './ChangePasswordForm'

interface IChangePassword {
  id: string
  value: string
  description: string
}

const _ChangePasswordModal: React.ForwardRefRenderFunction<IModalMethods, IChangePassword> = ({ id: _id }, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    showModal: (): void => setOpen(true),
    hideModal: (): void => setOpen(false)
  }))

  const handleCancel = (): void => {
    setOpen(false)
  }

  return (
    <>
      <Modal
        className='view-modal'
        title='Change password'
        open={open}
        onCancel={handleCancel}
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
