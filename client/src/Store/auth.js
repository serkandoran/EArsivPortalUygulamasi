
const initial_state = {
   isLogged: false,
   role: ''
}

const AuthReducer = (state =initial_state, action)=>{
   switch(action.type){
      case "UPDATE_AUTH":
         return {
            isLogged: action.payload.isLogged,
            role: action.payload.role
         }
      default:
         return state
   }
}

export default AuthReducer