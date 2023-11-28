import React, { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr';

import { DataGrid, GridColDef, GridValueGetterParams,GridRowsProp, GridEventListener, GridRowId, GridCellModesModel, GridCellModes } from '@mui/x-data-grid';
import { PeopleOutline } from '@mui/icons-material'
import { Box, Button, Grid } from '@mui/material'

import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces';

//Parámetros de celda seleccionados
interface SelectedCellParams{
    id: GridRowId;
    field: string;
}

interface EditToolbarProps{
    selectCellParams?: SelectedCellParams;
    //se utiliza para controlar el modo de la
    // celda seleccionada usando los botones externos
    cellModesModel: GridCellModesModel;
    setCellModesModel: (value: GridCellModesModel) => void;
    cellMode: 'Ver' | 'Editar';
}

function EditToolbar(props: EditToolbarProps){
    const { selectCellParams, cellMode, cellModesModel, setCellModesModel } = props;

    const handleSaveOrEdit = () =>{
        if(!selectCellParams){
            return;
        }

        const { id, field } = selectCellParams;
        
        if(cellMode === 'Editar'){
            setCellModesModel({
                ...cellModesModel,
                [id]: {...cellModesModel[id], [field]: {mode:GridCellModes.View} },
            });
        }else{
            setCellModesModel({
                ...cellModesModel,
                [id]: { ...cellModesModel[id], [field]: {mode: GridCellModes.Edit} }
            });
        }
    }
    
    const handleCancel = () => {
        if(!selectCellParams){
            return;
        }
        
        const { id, field } = selectCellParams;

        setCellModesModel({
            ...cellModesModel,
            [id]: {
                ...cellModesModel[id],
                [field]: { mode: GridCellModes.View, ignoreModifications: true}
            }
        });
    }

    const handleMouseDown = ( event: React.MouseEvent) => {
        event.preventDefault();
    }

    return(
        <Box 
            sx={{ 
                borderBottom: 1,
                borderColor: 'divider',
                p: 1
            }}>
                <Button
                    onClick={handleSaveOrEdit}
                    onMouseDown = {handleMouseDown}
                    disabled={!selectCellParams}>
                    {cellMode === 'Editar' ? 'Guardar': 'Editar' }
                </Button>
                <Button 
                    onClick={handleCancel}
                    onMouseDown = {handleMouseDown}
                    disabled={cellMode === 'Ver'}
                    variant="outlined"
                    sx={{ ml:1 }}>
                        
                    Cancelar
                </Button>
        </Box>);
}

const usersPage = () => {
        
    /* MANEJO DEL DATAGRID */
    const [selectedCellParams
        , setSelectedCellParams] = useState< SelectedCellParams | null >(null);
        
    const [cellModesModel
        , setCellModesModel] = useState<GridCellModesModel>({});
            
    const {data, error} = useSWR<IUser[]>('/api/admin/users');
    
    const [ users , setUsers] = useState<IUser[]>([]);
    useEffect(()=> {
        if(data){
            setUsers(data);
        }
    },[data])
    // Si no hay data y no hay error
    //loading
    //if(!data && !error ){ 
    //    return (<></>)
    //}

    // MANEJO DEL DATAGRID 
    //manejo celda enfocada
    const handleCellFocus = useCallback(
        (event:React.FocusEvent<HTMLDivElement >) => {
            const row = event.currentTarget.parentElement;
            const id = row!.dataset.id!;
            const field = event.currentTarget.dataset.field!;

            setSelectedCellParams({id, field });
    }, [],);
    
    const cellMode = React.useMemo( () => {
        if(!selectedCellParams){
            return 'Ver';
        }
    }, [cellModesModel, selectedCellParams ]);

    const handleCellEditStop = React.useCallback<GridEventListener<'cellEditStop'> >(
       (params, event )=> {
            event.defaultMuiPrevented = true;
       }, [] , );

    const columns: GridColDef [] = [
            { field: 'email'
            , headerName: 'Correo', width: 250
             },
            { field: 'name' 
            , headerName: 'Nombres', width: 300
             },
            { field: 'role' 
            , headerName: 'Rol', width: 300
            , editable: true 
            
         }
    ];
    
    //{ field: 'role' , headerName: 'Rol', width: 300 , editable: true , type: 'singleSelect' 
    // , valueOptions: ['admin','client'] }
    //console.log(data);
    //    const rows:GridRowsProp = data!.map( user => ({
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
        icon={<PeopleOutline></PeopleOutline>}>

        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
                <DataGrid
                    
                    rows={ rows }
                    columns={ columns }
                    //
                    //getRowId={row => row._id}
                    // Manejo DataGrid
                    cellModesModel={ cellModesModel}
                    onCellEditStop={ handleCellEditStop }
                    onCellModesModelChange={ (model) => setCellModesModel(model)}
                    
                    //Editar rol
                    slots={{
                        toolbar: EditToolbar
                    }}

                    slotProps={{
                        toolbar: {
                            cellMode,
                            selectedCellParams,
                            setSelectedCellParams,
                            cellModesModel,
                            setCellModesModel
                        }, cell: {
                            onFocus: handleCellFocus
                        }
                    }}

                    />
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default usersPage