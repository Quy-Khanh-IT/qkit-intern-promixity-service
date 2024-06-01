import { Button, Descriptions, DescriptionsProps, Modal, Image } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { IModalMethods } from '../modal'
import '../modal.scss'
import './view-row-details.scss'
import { PLACEHOLDER } from '@/constants'

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
          <Image
            width={200}
            height={200}
            src={src}
            alt={PLACEHOLDER.ALT_IMAGE}
            className='--avatar-details align-self-center'
            placeholder={
              <Image preview={false} src={PLACEHOLDER.LOADING_IMAGE} width={200} alt={PLACEHOLDER.ALT_IMAGE} />
            }
            fallback={PLACEHOLDER.ERROR_IMAGE}
          />
          <Descriptions bordered items={data} size='small' layout='vertical' />
        </div>
      </Modal>
    </>
  )
}

const ViewRowDetailsModal = forwardRef(_ViewRowDetails)
export default ViewRowDetailsModal
