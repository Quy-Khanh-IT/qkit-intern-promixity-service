import variables from '@/sass/common/_variables.module.scss'
import { Button, Descriptions, DescriptionsProps, Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { IModalMethods } from '../modal'
import '../modal.scss'
import './view-row-details.scss'

const { _grayBg } = variables

export interface ViewRowDetailsProps {
  data: DescriptionsProps['items']
}

const _ViewRowDetails: React.ForwardRefRenderFunction<IModalMethods, ViewRowDetailsProps> = ({ data }, ref) => {
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
        title='User details'
        open={open}
        onCancel={handleCancel}
        transitionName='ant-move-up'
        width={'800px'}
        footer={[
          <Button className='h-100 btn-cancel' onClick={handleCancel} key='cancel' type='primary'>
            Close
          </Button>
        ]}
      >
        <div className='content-box'>
          <Descriptions bordered items={data} size='small' layout='vertical' />
        </div>
      </Modal>
    </>
  )
}

const ViewRowDetailsModal = forwardRef(_ViewRowDetails)
export default ViewRowDetailsModal
