import React, { useState, useEffect } from 'react'
import useSWR from 'swr';

import { DataGrid, GridColDef, GridValueGetterParams,GridRowsProp } from '@mui/x-data-grid';
import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material'

import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

const UsersPage = () => {
       
    const {data, error} = useSWR<IUser[]>('/api/admin/users');
    
    const [ users , setUsers] = useState<IUser[]>([]);
    useEffect(()=> { // dispara establecer data en agreglo de usuarios
        if(data){
            setUsers(data);
        }
    },[data]) //agreglo de dependencia
    
    // Si no hay data y no hay error
    // loading
    if(!data && !error ){ 
        return (<></>)
    }

    const onRoleUpdated = async(userId: string, newRole:string )=> {
        
        //Mejor experiencia del usuario parra seleccion de Rol
        const previousUsers = users.map( user => ({...user }) );
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try{
            await tesloApi.put('/admin/users', { userId, role: newRole});
        }catch(error){
            setUsers( previousUsers );
            console.log(error);
            alert('No se pudo actualizar el rol del usuario');
        }
    }

    //Definir columnas
    const columns: GridColDef [] = [
            { field: 'email', headerName: 'Correo', width: 250 },
            { field: 'name' , headerName: 'Nombres', width: 300},
            { 
            field: 'role' 
            , headerName: 'Rol'
            , width: 300
            , editable: true 
            , renderCell: ({row}: GridValueGetterParams) => {
                return (<Select
                            value={row.role}
                            label="Rol"
                            onChange={ ({target}) => onRoleUpdated( row.id, target.value) }
                            sx={{width:'300px'}}>
                                <MenuItem value='admin'>    Admin </MenuItem>
                                <MenuItem value='client'>   Client </MenuItem>
                                <MenuItem value='super-user'> Super User </MenuItem>
                                <MenuItem value='SEO'>      SEO </MenuItem>
                        </Select>)
                },
            }
    ];
    
    const rows:GridRowsProp = users!.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

  return (
    <AdminLayout
        title={'Usuarios'}
        subTitle={'Mantenimiento de usuarios'}
        icon={ <PeopleOutline />}>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }
                    
                    />
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default UsersPage