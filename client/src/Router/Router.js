import Admin from "../Views/Admin";
import HomePage from "../Views/HomePage"
import LoginPage from "../Views/LoginPage"
import RootLayout from './Root'
import { createBrowserRouter} from 'react-router-dom';



const Router = createBrowserRouter([
   {
      path: '/',
      element: <RootLayout />,
      children: [
         { path: '/', element: <LoginPage /> },
         { path: '/home', element: <HomePage /> },
         { path: '/admin', element: <Admin /> },
      ]
   }
])
export default Router