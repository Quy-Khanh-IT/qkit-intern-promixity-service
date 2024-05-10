import { Button, Pagination } from 'antd'
import React from 'react'

function AdminPage() {
  return (
    <div>
      <Button>Intern project</Button>
      <Pagination defaultCurrent={1} total={50} />
    </div>
  )
}

export default AdminPage
