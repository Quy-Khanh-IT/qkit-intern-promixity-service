import './delete-user.scss'

import { Button, Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

// import { ManageUserReloadContext } from '~/context/ManageUserContext'
// import { useDeleteUserMutation, useRestoreUserMutation } from '~/services/user.service'
import { IModalMethods } from '../modal'
import '../modal.scss'
import './delete-user.scss'

export interface IDeleteUserProps {
  title: string
  content: React.ReactNode
  handleConfirm: () => void
}

const _DeleteModal: React.ForwardRefRenderFunction<IModalMethods, IDeleteUserProps> = (
  { title, content, handleConfirm },
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

  const handleCancelChild = () => {
    setOpen(false)
  }

  const handleConfirmChild = () => {
    handleConfirm()
  }

  const _handleDeleteUser = async () => {
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
          <Button className='btn-cancel' onClick={handleConfirmChild} type='primary' key='cancel'>
            Đóng
          </Button>,
          <Button
            className='btn-primary'
            onClick={handleConfirm}
            type='primary'
            key='ok'
            // loading={confirmLoading}
          >
            Xác nhận
          </Button>
        ]}
      >
        <div className='content-box'>{content}</div>
      </Modal>
    </>
  )
}

const DeleteModal = forwardRef(_DeleteModal)
export default DeleteModal
