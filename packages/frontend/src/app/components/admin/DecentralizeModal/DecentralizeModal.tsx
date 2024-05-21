import { Button, Col, Modal, Row, Select, Space, Typography } from 'antd'
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { toast } from 'react-toastify'
// import { ManageUserReloadContext } from '@/context/ManageUserContext'
import '../modal.scss'
import './decentralize-role-modal.scss'
import { IUserInformation, RoleFiltered } from '@/types/user'
import { IModalMethods } from '../modal'
// import { useDecentralizeRoleMutation } from '@/services/user.service'

export interface IDecentralizeRoleProps {
  userOne: IUserInformation | null
  decentralizeOpts: RoleFiltered[]
}

export interface IDecentralizeOptions {
  id: string
  value: string
  description: string
}

const { Text } = Typography

const _DecentralizeRoleModal: React.ForwardRefRenderFunction<IModalMethods, IDecentralizeRoleProps> = (
  { userOne, decentralizeOpts },
  ref
) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    showModal: () => setOpen(true),
    hideModal: () => setOpen(false)
  }))

  const onChangeSelection = (value: string) => {
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleDecentralizeRole = async () => {
   
  }

  const handleOk = () => {

  }

  return (
    <>
      <Modal
        className='view-modal'
        title='Decentralize'
        open={open}
        transitionName='ant-move-up'
        width={'600px'}
        onCancel={handleCancel}
        footer={[
          <Button className='btn-cancel' onClick={handleCancel} type='primary' key='cancel'>
            Close
          </Button>,
          <Button
            // className={isConfirm ? 'btn-primary' : ''}
            className='btn-primary'
            onClick={handleOk}
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
              <Space direction='vertical'>
                <Text>Email:</Text>
                <Text>Role:</Text>
              </Space>
            </Col>

            <Col span={16}>
              <Space direction='vertical'>
                <Text>ndtuan@gmail.com</Text>
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
                  // value={selectedOption}
                  options={decentralizeOpts}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
}

const DecentralizeRoleModal = forwardRef(_DecentralizeRoleModal)
export default DecentralizeRoleModal
