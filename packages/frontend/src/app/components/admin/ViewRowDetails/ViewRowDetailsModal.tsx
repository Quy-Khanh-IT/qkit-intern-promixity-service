import { Button, Descriptions, DescriptionsProps, Modal, Image } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { IModalMethods } from '../modal'
import '../modal.scss'
import './view-row-details.scss'
import { PLACEHOLDER } from '@/constants'

export interface ViewRowDetailsProps {
  title: string
  data: DescriptionsProps['items']
}

const _ViewRowDetails: React.ForwardRefRenderFunction<IModalMethods, ViewRowDetailsProps> = ({ title, data }, ref) => {
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
        title={title}
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
        <div className='content-box d-flex flex-column gap-3'>
          <Image
            width={200}
            height={200}
            src='https://picsum.photos/id/237/200/300'
            alt={PLACEHOLDER.ERROR_IMAGE}
            className='--avatar-details align-self-center'
            placeholder={
              <Image
                preview={false}
                // src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200'
                src={PLACEHOLDER.ERROR_IMAGE}
                width={200}
                alt='error'
              />
            }
          />
          <Descriptions bordered items={data} size='small' layout='vertical' />
        </div>
      </Modal>
    </>
  )
}

const ViewRowDetailsModal = forwardRef(_ViewRowDetails)
export default ViewRowDetailsModal
