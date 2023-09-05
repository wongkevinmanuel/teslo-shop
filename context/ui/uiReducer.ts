import { UiState } from './'

//acciones permitidas
//(informacion q recibe para generar nuevo estado)
type UiActionType = 
| { type: '[Ui]-Abrir-Menu'};

//Funcion pura xq todos los valores de retorno
//se trabajan con los argumentos que recibe
//No llama a ningun otro metodo exterior  
//Recibe estado, accion, produce nuevo estado
export const uiReducer = (state: UiState, action: UiActionType): UiState =>{
    switch (action.type) {
        case '[Ui]-Abrir-Menu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen
            }
        
        default:
            return state;
    }
}