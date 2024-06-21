
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'


  const Admin = () => {
    const navigate = useNavigate()
    const [desc,setDesc] = useState('')
    const dispatch = useDispatch()

    useEffect(()=>{
      protectEndPoints()
    },[])

    function protectEndPoints() {
      let token = Cookies.get("Token")
      axios.get('http://localhost:5184/api/document/protect', {
        withCredentials: true,
        headers: {
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
            type: "UPDATE_AUTH",
            payload: sessionData
          })
          if (sessionData.role && sessionData.role === "member") navigate('/home')
        })
        .catch((err) => {
          console.log(err);
          navigate('/')
        })
    }

    const addDocument = ()=>{
        if(!desc.length) return

        let token = Cookies.get("Token")

        axios.post('http://localhost:5184/api/document/insertdocument',
          {
            documentDescription: desc
          },
          {
            withCredentials:true,
            headers:{
              "Authorization": `Bearer ${token}`
            }
          })
        .then((res)=>{
          if(res.status === 200) navigate('/home')
        })
        .catch((err)=>console.log(err))
    }

  return <div className="input-group w-75 border border-secondary-subtle p-4 mx-auto mt-5 rounded-3 min-width">
  <input onChange={(e)=>setDesc(e.target.value)} type="text" className="form-control rounded-3" placeholder="Döküman Açıklaması Gir" aria-label="Description" aria-describedby="basic-addon2" />
  <div onClick={addDocument} className="input-group-append">
    <button className="btn btn-outline-secondary margin-left w-50" type="button">Kaydet</button>
  </div>
</div>
}

export default Admin