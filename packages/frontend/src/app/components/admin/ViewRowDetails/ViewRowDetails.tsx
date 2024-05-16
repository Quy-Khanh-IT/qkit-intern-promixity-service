import variables from '@/sass/common/_variables.module.scss'
import { IBusiness } from '@/types/business'
import { IUserInformation } from '@/types/user'
import { Button, Modal, Carousel, Image, Descriptions, DescriptionsProps } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import './view-row-details.scss'
import { PLACEHOLDER } from '@/types/common'
import ViewUserDescription from '@/app/(admin)/manage-user/user-details.pipe'

const { grayBg } = variables

export interface ViewRowDetailsModalMethods {
  showModal: () => void
  hideModal: () => void
}

export interface ViewRowDetailsProps {
  title: string
  data: any
}

const _ViewRowDetails: React.ForwardRefRenderFunction<ViewRowDetailsModalMethods, ViewRowDetailsProps> = (
  { title, data },
  ref
) => {
  const [open, setOpen] = useState(false)
  const pipedData: DescriptionsProps['items'] = ViewUserDescription(data as IUserInformation)

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
          <Button
            className='h-100'
            style={{
              fontWeight: 700,
              padding: '8px 20px',
              background: grayBg
            }}
            onClick={handleCancel}
            key={'close'}
          >
            Close
          </Button>
        ]}
      >
        <div className='content-box'>
          <Descriptions bordered items={pipedData} size='small' layout="vertical"/>
        </div>
      </Modal>
    </>
  )
}

const ViewRowDetailsModal = forwardRef(_ViewRowDetails)
export default ViewRowDetailsModal
