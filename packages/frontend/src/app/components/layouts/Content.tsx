'use client'
import { themConfig } from '@/configs/themes/light'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import LoaderArea from '../LoaderArea/LoaderArea'
import StoreProvider from '../StoreProvider'
import { AuthProvider } from '@/context/AuthContext'

interface IContentLayout {
  children: React.ReactNode
}

const Content: React.FC<IContentLayout> = ({ children }): React.ReactNode => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [_blur, setBlur] = useState<boolean>(false)

  const startLoading = (): void => {
    setLoading(true)
    setBlur(true)
  }

  const stopLoading = (): void => {
    setBlur(false)
    setLoading(false)
  }

  useEffect(() => {
    startLoading()
    const timer = setTimeout(stopLoading, 500)
    return (): void => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <AntdRegistry>
      <ConfigProvider theme={themConfig}>
        <div className={`app-content blur`}>
          <StoreProvider>
            <AuthProvider>{children}</AuthProvider>
          </StoreProvider>
        </div>
        {loading ? <LoaderArea /> : null}
      </ConfigProvider>
    </AntdRegistry>
  )
}

export default Content
