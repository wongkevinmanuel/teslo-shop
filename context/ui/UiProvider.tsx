//Se define el estado de la aplicacion
//Como luce el estado de la app
//Utilizado para saber en q momento
// y como luce la app
import { FC, useReducer,ReactNode } from 'react';
import { UiContext, uiReducer } from '.';

export interface UiState {
    isMenuOpen: boolean;
}

const Ui_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

interface Props{
    children?: ReactNode;
}

export const UiProvider:FC<Props> = ({children}) => {
    //Manejo del estado del provider
    //useReducer para administrar el estado
    const [state, dispatch] = useReducer( uiReducer, Ui_INITIAL_STATE);

    //METODOS PARA ABRIR MENU
    //const closeSideMenu = () => {
    //    dispatch({type:'[Ui]-Cerrar-Menu'});
    //}
    
    const openSideMenu = () => {
        dispatch({type:'[Ui]-Abrir-Menu'});
    } 

    return (
        <UiContext.Provider value={{
            ...state,
            //metodos
            openSideMenu
        }}>
            { children }
        </UiContext.Provider>
    )
}