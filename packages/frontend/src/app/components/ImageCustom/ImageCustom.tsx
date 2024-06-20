import React from 'react'
import { Image } from 'antd'
import { PLACEHOLDER } from '@/constants'
import './image-custom.scss'

interface ImageCustomProps {
  width: number
  height: number
  src: string | undefined
  className?: string
  preview?: boolean
  circle?: boolean
}

const ImageCustom: React.FC<ImageCustomProps> = ({ width, height, src, className, circle = true, preview = true }) => {
  return (
    <div className={`${circle ? '--image-circle' : ''} ${className}`}>
      <Image
        width={width}
        height={height}
        src={src}
        preview={preview}
        alt={PLACEHOLDER.ERROR_IMAGE}
        placeholder={
          <Image
            preview={false}
            src={PLACEHOLDER.LOADING_IMAGE}
            width={width}
            height={height}
            alt={PLACEHOLDER.ERROR_IMAGE_2}
          />
        }
        fallback={PLACEHOLDER.ERROR_IMAGE}
      />
    </div>
  )
}

export default ImageCustom
