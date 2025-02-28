import { createContext, useState } from "react";





export const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {

  // const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  let [deletemodal, setdeletemodal] = useState(false)
  let [productData, setproductData] = useState([]);

  let hidemodal = () => {
    setdeletemodal(false)
  }

  let showmodal = () => {
    setdeletemodal(true)
  }

  return (
    <ModalContext.Provider value={{ deletemodal, hidemodal, showmodal, productData, setproductData }}>
      {children}
    </ModalContext.Provider>
  );
}