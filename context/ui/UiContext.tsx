//UiContext maneja si menu abierto o cerrado
import { createContext } from 'react';

interface ContextProps {
    isMenuOpen: boolean

    //metodos
    openSideMenu: () => void;
}

export const UiContext = createContext({} as ContextProps);