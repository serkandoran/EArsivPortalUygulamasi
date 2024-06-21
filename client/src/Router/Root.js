import { Outlet } from 'react-router-dom'
import Header from '../Components/Header'

function RootLayout(){
   return <>
      <main>
         <Header />
         <Outlet />
      </main>
   </>
}

export default RootLayout
