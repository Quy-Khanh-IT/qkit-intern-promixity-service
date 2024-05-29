import './delete-user.scss'
import { Button, Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { IModalMethods } from '../modal'
import '../modal.scss'
import './delete-user.scss'

export interface IDeleteUserProps {
  title: string
  content: React.ReactNode
  handleConfirm: () => void
}

const _DeleteModal: React.ForwardRefRenderFunction<IModalMethods, IDeleteUserProps> = (
  { title, content, handleConfirm },
  ref
) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    showModal: (): void => setOpen(true),
    hideModal: (): void => setOpen(false)
  }))

  const handleCancelChild = (): void => {
    setOpen(false)
  }

  const handleConfirmChild = (): void => {
    handleConfirm()
  }

  return (
    <>
      <Modal
        className='view-modal'
        title={title}
        open={open}
        transitionName='ant-move-up'
        width={'600px'}
        onCancel={handleCancelChild}
        footer={[
          <Button className='btn-cancel' onClick={handleCancelChild} type='primary' key='cancel'>
            Close
          </Button>,
          <Button
            className='btn-primary'
            onClick={handleConfirmChild}
            type='primary'
            key='ok'
            // loading={confirmLoading}
          >
            Confirm
          </Button>
        ]}
      >
        <div className='content-box'>{content}</div>
      </Modal>
    </>
  )
}

const DeleteModal = forwardRef(_DeleteModal)
export default DeleteModal
