const AuthReducer=(state,action)=>{
    switch(action.type){
        case 'LOGIN':{
            return{
            currentUser:action.payload
        }
        }
        case 'LOGOUT':{
            return{
            currentUser:null
        }
        }
        case 'SIGNUP':{
            return{
            currentUser:action.payload
        }
        }
        default : state
    }
    }
    
    export default AuthReducer;