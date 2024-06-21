import { combineReducers, legacy_createStore as createStore } from "redux";
import auth from "./auth.js";

const rootReducer = combineReducers({
   auth
})

const store = createStore(rootReducer)

export default store
