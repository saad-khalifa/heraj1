import { createContext, useContext, useState } from "react";

export const Menu=createContext("");
export default function MenuContext({children}){
    const [isOpen,setIsOpen]=useState(false);
    return(
        <Menu.Provider value={{isOpen,setIsOpen}}>{children}</Menu.Provider>
    );
}
