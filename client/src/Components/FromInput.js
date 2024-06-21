import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const FromInput = () => {
   const [userName, setUserName] = useState('')
   const [password, setPassword] = useState('')
   const [disabled,setDisabled] = useState(false)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const userNameHandler = (e)=>{
      setUserName(e.target.value)
   }
   const passwordHandler = (e)=>{
      setPassword(e.target.value)
   }
   
   const loginHandler = (e)=>{
      e.preventDefault()
      if(!userName.length || !password.length) return

      axios.post('http://localhost:5184/api/document/login', {
         userName,
         password
      },
      {
         withCredentials: true
      })
      .then((res) => {
         let userRole = res.data
         let sessionData = {
            isLogged: true,
            role: userRole
         }
         dispatch({
            type: "UPDATE_AUTH",
            payload: sessionData
         })
         navigate('/home')
      })
      .catch((err) => console.log(err))
   }

   const resetStates = ()=>{
      setUserName('')
      setPassword('')
      setDisabled(false)
   }
   const suggestUserHandler = (e) => {
      e.preventDefault()
      setUserName('exampleuser')
      setPassword('123')
      setDisabled(true)
   }
   return <form className='w-50 bg-light p-5 m-auto mt-5 border border-light rounded-3'>
      <div className="mb-3">
         <label htmlFor="input" className="form-label">Kullanıcı Adı</label>
         <div className='d-flex relative'>
            <input disabled={disabled} value={userName} onChange={userNameHandler} type="text" className="form-control" id="exampleInput" aria-describedby="input" />
            {
               disabled && <svg onClick={resetStates} className='cancel-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
            }
         </div>
      </div>
      <div className="mb-3">
         <label htmlFor="exampleInputPassword1" className="form-label">Şifre</label>
         <input disabled={disabled} value={password} onChange={passwordHandler} type="password" className="form-control" id="exampleInputPassword1" />
      </div>
      <div className="d-flex gap-3">
         <button onClick={loginHandler} type="submit" className="btn btn-primary w-50 d-flex justify-content-center gap-2 align-items-center">
            <span className='span-styles'>Giriş</span>
            <svg className='svg-styles' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" /></svg>
         </button>
         <button onClick={suggestUserHandler} type="submit" className="btn btn-primary w-50 d-flex justify-content-center gap-2 align-items-center">
            <span className='span-styles'>Kullanıcı Öner</span>
         </button>
      </div>
   </form>
}

export default FromInput