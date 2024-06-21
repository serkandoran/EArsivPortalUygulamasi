import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Header = () => {
   const navigate = useNavigate()
   const auth = useSelector(state => state.auth)
   const dispatch = useDispatch()

   const routeAdminPage = ()=>{
      navigate('/admin')
   }
   const logOutHandler = ()=>{
      document.cookie = `Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      navigate('/')
      dispatch({
         type:"UPDATE_AUTH",
         payload:{
            isLogged: false,
            role: ''
         }
      })
   }

   return <nav className="navbar d-flex nav-color fix-height">
      {
         auth.isLogged && auth.role === 'admin' && <div className="dropdown w-50 margin-left">
            <button className="btn btn-secondary dropdown-toggle px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
               Admin Features
            </button>
            <ul className="dropdown-menu dropdown-menu-dark cursor-pointer p-2">
               <li onClick={routeAdminPage}><a className="dropdown-item active disable-a" href="#">Döküman Ekle</a></li>
            </ul>
         </div>
      }
      {
         auth.isLogged && <div onClick={logOutHandler} className="container p-3 w-25 ms-auto me-0 justify-content-center hover" role="button">
            <svg style={{ height: '40px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg>
         </div>
      }
   </nav>
}

export default Header