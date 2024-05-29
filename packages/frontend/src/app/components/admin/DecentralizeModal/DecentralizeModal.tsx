import { Button, Col, Modal, Row, Select, Space } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { SelectionOptions } from '@/types/common'
import { IModalMethods } from '../modal'
import '../modal.scss'
import './decentralize-role-modal.scss'

export interface IDecentralizeRoleProps {
  title: string
  specificInfo: React.ReactNode
  handleConfirm: () => void
  selectionOptions: SelectionOptions[]
  children: React.ReactNode
}

export interface IDecentralizeOptions {
  id: string
  value: string
  description: string
}

const _DecentralizeModal: React.ForwardRefRenderFunction<IModalMethods, IDecentralizeRoleProps> = (
  { title, specificInfo, handleConfirm, selectionOptions, children },
  ref
) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    showModal: (): void => setOpen(true),
    hideModal: (): void => setOpen(false)
  }))

  const onChangeSelection = (_value: string): void => {}

  const handleCancelChild = (): void => {
    setOpen(false)
  }

  const handleConfirmChild = (): void => {
    handleConfirm()
  }

  return (
    <>
      <Modal
        className='view-modal'
        title={title}
        open={open}
        transitionName='ant-move-up'
        width={'600px'}
        onCancel={handleCancelChild}
        footer={[
          <Button className='btn-cancel' onClick={handleCancelChild} type='primary' key='cancel'>
            Close
          </Button>,
          <Button
            // className={isConfirm ? 'btn-primary' : ''}
            className='btn-primary'
            onClick={handleConfirmChild}
            type='primary'
            key='ok'
            // disabled={!isConfirm}
            // loading={confirmLoading}
          >
            Confirm
          </Button>
        ]}
      >
        <div className='content-box'>
          <Row>
            <Col span={8}>
              <Space direction='vertical'>{children}</Space>
            </Col>

            <Col span={16}>
              <Space direction='vertical'>
                {specificInfo}
                <Select
                  onChange={onChangeSelection}
                  style={{ width: 200 }}
                  placeholder='Tìm kiếm'
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    typeof option === 'object' && 'label' in option
                      ? (option as { label: string }).label.toLowerCase().includes(input.toLowerCase())
                      : false
                  }
                  filterSort={(optionA, optionB) =>
                    ((optionA as { label: string }).label ?? '')
                      .toLowerCase()
                      .localeCompare(((optionB as { label: string }).label ?? '').toLowerCase())
                  }
                  // value={selectionOptions}
                  options={selectionOptions}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
}

const DecentralizeModal = forwardRef(_DecentralizeModal)
export default DecentralizeModal
