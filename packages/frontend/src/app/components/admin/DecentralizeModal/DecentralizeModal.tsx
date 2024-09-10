import { Button, Col, Modal, Row, Select, Space } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { SelectionOptions } from '@/types/common'
import { IModalMethods } from '@/types/modal'
import '../modal.scss'
import './decentralize-role-modal.scss'

export interface IDecentralizeRoleProps {
  title: string
  specificInfo: React.ReactNode
  handleConfirm: (_role: string) => void
  presentOption: string
  selectionOptions: SelectionOptions[]
  children: React.ReactNode
}

const _DecentralizeModal: React.ForwardRefRenderFunction<IModalMethods, IDecentralizeRoleProps> = (
  { title, specificInfo, handleConfirm, presentOption, selectionOptions, children },
  ref
) => {
  const [open, setOpen] = useState<boolean>(false)
  const [selectOption, setSelectOption] = useState<string>(presentOption)
  const confirmBoolean: boolean = useMemo<boolean>(() => selectOption === presentOption, [selectOption, presentOption])

  const handleCancelChild = (): void => {
    setSelectOption(presentOption)
    setOpen(false)
  }

  useImperativeHandle<IModalMethods, IModalMethods>(ref, () => ({
    showModal: (): void => setOpen(true),
    hideModal: (): void => handleCancelChild()
  }))

  useEffect(() => {
    setSelectOption(presentOption)
  }, [presentOption])

  const onChangeSelection = (value: string): void => {
    setSelectOption(value)
  }

  const handleConfirmChild = (): void => {
    handleConfirm(selectOption)
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
            className='btn-primary'
            onClick={handleConfirmChild}
            type='primary'
            key='ok'
            disabled={confirmBoolean}
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
                  value={selectOption}
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
