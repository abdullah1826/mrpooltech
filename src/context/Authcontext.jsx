import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./Authreducer";

let INITIAL_STATE = {
    currentUser:JSON.parse(localStorage.getItem('myadmin')) || null,
  };




export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    useEffect(()=>{
      localStorage.setItem('myadmin',JSON.stringify(state.currentUser))
    },[state.currentUser])
    let Nulluser=()=>{
     return  dispatch({type:'LOGOUT'})
     
     
    }
    return (
        <AuthContext.Provider value={{ currentUser: state.currentUser, dispatch ,Nulluser}}>
          {children}
        </AuthContext.Provider>
      );
}