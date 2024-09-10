import { IBusinessImage } from '@/types/business'
import { Button, Carousel, Descriptions, DescriptionsProps, Modal } from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import ImageCustom from '../../ImageCustom/ImageCustom'
import { IModalMethods } from '@/types/modal'
import '../modal.scss'
import './view-row-details.scss'

export interface ViewRowDetailsProps {
  title: string
  imageData?: string | IBusinessImage[]
  data: DescriptionsProps['items']
}

const _ViewRowDetails: React.ForwardRefRenderFunction<IModalMethods, ViewRowDetailsProps> = (
  { title, data, imageData },
  ref
) => {
  const [open, setOpen] = useState<boolean>(false)
  const carouselRef = useRef<CarouselRef | null>(null)

  const resetCarousel = (): void => {
    // Reset to the first slide
    if (carouselRef.current) {
      carouselRef.current.goTo(0, true)
    }
  }

  useImperativeHandle<IModalMethods, IModalMethods>(ref, () => ({
    showModal: (): void => setOpen(true),
    hideModal: (): void => setOpen(false)
  }))

  const handleCancel = (): void => {
    setOpen(false)
    resetCarousel()
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
          {typeof imageData === 'string' ? (
            <ImageCustom
              width={200}
              height={200}
              src={imageData}
              className='--avatar-custom d-flex align-self-center'
            />
          ) : (
            <div style={{}}>
              <Carousel ref={carouselRef} arrows infinite={false} className='--carousel-custom' slickGoTo={1} key={1}>
                {imageData?.map((img: IBusinessImage, index) => (
                  <ImageCustom
                    key={index}
                    circle={false}
                    width={200}
                    height={200}
                    src={img.url}
                    className='--avatar-custom d-flex align-self-center justify-content-center'
                  />
                ))}
              </Carousel>
            </div>
          )}
          <Descriptions bordered items={data} size='small' layout='vertical' />
        </div>
      </Modal>
    </>
  )
}

const ViewRowDetailsModal = forwardRef(_ViewRowDetails)
export default ViewRowDetailsModal
