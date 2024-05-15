import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Modal, Space, Typography } from 'antd'
import '~/sass/ManageUser/view-user-modal.scss'
import { Row, Col } from 'antd'
import { IUserInformation } from '@/types/user'
import { IBusiness } from '@/types/business'

export interface ViewRowDetailsModalMethods {
  showModal: () => void
  hideModal: () => void
}

export interface ViewRowDetailsProps {
  title: string
  data: IUserInformation | IBusiness | null
  children: React.ReactNode
}

const { Text } = Typography

const _ViewRowDetails: React.ForwardRefRenderFunction<ViewRowDetailsModalMethods, ViewRowDetailsProps> = (
  { title, data, children },
  ref
) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    showModal: () => setOpen(true),
    hideModal: () => setOpen(false)
  }))

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <>
      <Modal
        className='view-modal'
        title={title}
        open={open}
        onCancel={handleCancel}
        transitionName='ant-move-up'
        width={'800px'}
        footer={[
          <Button className='btn-cancel' onClick={handleCancel} type='primary' key={'close'}>
            Đóng
          </Button>
        ]}
      >
        <div className='content-box'>{children}</div>
      </Modal>
    </>
  )
}

const ViewRowDetailsModal = forwardRef(_ViewRowDetails)
export default ViewRowDetailsModal
