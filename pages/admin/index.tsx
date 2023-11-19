import React from 'react'
import { AdminLayout } from '../../components/layouts'
import { DashboardOutlined } from '@mui/icons-material'

const DashboardPage = () => {
  return (
    <AdminLayout
    title= 'Dashboard'
    subTitle= 'Estadisticas generales'
    icon={ <DashboardOutlined/> }>
    </AdminLayout>
  )
}

export default DashboardPage;