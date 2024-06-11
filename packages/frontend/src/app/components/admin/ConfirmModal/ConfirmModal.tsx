import { Button, Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { IModalMethods } from '@/types/modal'
import '../modal.scss'
import './confirm-modal.scss'

export interface IConfirmModalProps {
  title: string
  content: React.ReactNode
  width?: number
  handleConfirm?: () => void
}

const _ConfirmModal: React.ForwardRefRenderFunction<IModalMethods, IConfirmModalProps> = (
  { title, content, handleConfirm, width },
  ref
) => {
  const [open, setOpen] = useState<boolean>(false)

  useImperativeHandle<IModalMethods, IModalMethods>(ref, () => ({
    showModal: (): void => setOpen(true),
    hideModal: (): void => setOpen(false)
  }))

  const handleCancelChild = (): void => {
    setOpen(false)
  }

  const handleConfirmChild = (): void => {
    handleConfirm && handleConfirm()
  }

  return (
    <>
      <Modal
        className='view-modal'
        title={title}
        open={open}
        transitionName='ant-move-up'
        width={width ? width + 'px' : '600px'}
        onCancel={handleCancelChild}
        footer={
          handleConfirm
            ? [
                <Button className='btn-cancel mt-1' onClick={handleCancelChild} type='primary' key='cancel'>
                  Close
                </Button>,
                <Button className='btn-primary mt-1' onClick={handleConfirmChild} type='primary' key='ok'>
                  Confirm
                </Button>
              ]
            : null
        }
      >
        <div className='content-box'>{content}</div>
      </Modal>
    </>
  )
}

const ConfirmModal = forwardRef(_ConfirmModal)
export default ConfirmModal
