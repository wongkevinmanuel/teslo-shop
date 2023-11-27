import React from 'react'
import useSWR from 'swr';

import { PeopleOutline } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams,GridRowsProp } from '@mui/x-data-grid';
import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces';

const usersPage = () => {
        
    const {data, error} = useSWR<IUser[]>('/api/admin/users');

    // Si no hay data y no hay error
    //loading
    if(!data && !error ) return (<></>)

    const columns: GridColDef [] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name' , headerName: 'Nombre completo', width: 300 },
        { field: 'role' , headerName: 'Rol', width: 300 }
    ]

    let rows:GridRowsProp = data!.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

  return (
    <AdminLayout
        title={'Usuarios'}
        subTitle={'Mantenimiento de usuarios'}
        icon={<PeopleOutline></PeopleOutline>}>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }/>
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default usersPage