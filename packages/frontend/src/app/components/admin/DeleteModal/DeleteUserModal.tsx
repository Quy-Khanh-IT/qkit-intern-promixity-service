import './delete-user.scss'

import { Button, Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

// import { ManageUserReloadContext } from '~/context/ManageUserContext'
// import { useDeleteUserMutation, useRestoreUserMutation } from '~/services/user.service'
import '../modal.scss'
import './delete-user.scss'
import { IUserInformation } from '@/types/user'
import { IModalMethods } from '../modal'

export interface IDeleteUserProps {
  userOne: IUserInformation | null
  isDeleted: boolean | null
}

const _DeleteUserModal: React.ForwardRefRenderFunction<IModalMethods, IDeleteUserProps> = (
  { userOne, isDeleted },
  ref
) => {
  const [open, setOpen] = useState(false)
  // const reloadContextUse = useContext(ManageUserReloadContext)

  // const [deleteUser, { isLoading: confirmLoading }] = useDeleteUserMutation()
  // const [restoreUser] = useRestoreUserMutation()

  useImperativeHandle(ref, () => ({
    showModal: () => setOpen(true),
    hideModal: () => setOpen(false)
  }))

  const handleCancel = () => {
    setOpen(false)
  }

  const handleDeleteUser = async () => {
    // if (userOne) {
    //   isDeleted
    //     ? await restoreUser(userOne.id)
    //         .unwrap()
    //         .then(() => {
    //           handleCancel()
    //           reloadContextUse.handleReloadCurPage()
    //           toast.success('Khôi phục tài khoản thành công')
    //         })
    //         .catch((error) => {
    //           toast.error(error.data.message)
    //         })
    //     : await deleteUser(userOne.id)
    //         .unwrap()
    //         .then(() => {
    //           handleCancel()
    //           reloadContextUse.handleReloadCurPage()
    //           toast.success('Xoá tài khoản thành công')
    //         })
    //         .catch((error) => {
    //           toast.error(error.data.message)
    //         })
    // }
  }

  const handleOk = () => {
    handleDeleteUser()
  }

  return (
    <>
      <Modal
        className='view-modal'
        title='Xoá tài khoản'
        open={open}
        transitionName='ant-move-up'
        width={'600px'}
        onCancel={handleCancel}
        footer={[
          <Button className='btn-cancel' onClick={handleCancel} type='primary' key='cancel'>
            Đóng
          </Button>,
          <Button
            className='btn-primary'
            onClick={handleOk}
            type='primary'
            key='ok'
            // loading={confirmLoading}
          >
            Xác nhận
          </Button>
        ]}
      >
        <div className='content-box'>
          {isDeleted ? 'Bạn chắc chắn muốn khôi phục tài khoản' : 'Bạn chắc chắn muốn xoá tài khoản'}
          <strong>{' ' + 'ndtuan21@gmail.com'}</strong>?
        </div>
      </Modal>
    </>
  )
}

const DeleteUserModal = forwardRef(_DeleteUserModal)
export default DeleteUserModal
