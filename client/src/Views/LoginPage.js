import React, { useEffect } from 'react'
import FromInput from '../Components/FromInput'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    protectEndPoints();
  },[])

  function protectEndPoints(){
    let token = Cookies.get("Token")
    axios.get('http://localhost:5184/api/document/protect',{
      withCredentials:true,
      headers:{
        "Authorization": `Bearer ${token}`
      }
    })
    .then((res) => {
      let userRole = res.data
      let sessionData = {
        isLogged: true,
        role: userRole
      }
      dispatch({
        type:"UPDATE_AUTH",
        payload: sessionData
      })
      navigate('/home')
    })
    .catch((err) => console.log(err))
  }


  return <FromInput />
}

export default LoginPage