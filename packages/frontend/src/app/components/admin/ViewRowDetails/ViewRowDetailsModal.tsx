import { Button, Descriptions, DescriptionsProps, Modal } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import ImageCustom from '../../ImageCustom/ImageCustom'
import { IModalMethods } from '../modal'
import '../modal.scss'
import './view-row-details.scss'

export interface ViewRowDetailsProps {
  title: string
  imageData?: string
  data: DescriptionsProps['items']
}

const _ViewRowDetails: React.ForwardRefRenderFunction<IModalMethods, ViewRowDetailsProps> = (
  { title, data, imageData },
  ref
) => {
  const [open, setOpen] = useState<boolean>(false)
  const [src, setSrc] = useState<string | undefined>(imageData)

  useEffect(() => {
    setSrc(imageData)
  }, [imageData])

  useImperativeHandle<IModalMethods, IModalMethods>(ref, () => ({
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
          <ImageCustom width={200} height={200} src={src || ''} className='--avatar-custom d-flex align-self-center' />
          <Descriptions bordered items={data} size='small' layout='vertical' />
        </div>
      </Modal>
    </>
  )
}

const ViewRowDetailsModal = forwardRef(_ViewRowDetails)
export default ViewRowDetailsModal
