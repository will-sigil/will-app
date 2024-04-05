import { Layout } from "../common/Layout/Layout";
import { Login } from "../Auth/Login/Login";
import { Signup } from "../Auth/Signup/Signup";
import { PrivateRoute } from '../Auth/PrivateRoute/PrivateRoute'
import { AuthProvider } from '../Auth/AuthProvider/AuthProvider';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "../Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Layout></Layout>}>
            <Route index element={<Login></Login>}></Route>
            <Route path='/signup' element={<Signup></Signup>}></Route>
            <Route path='/dashboard' element={
              <PrivateRoute>
                <Dashboard></Dashboard>
              </PrivateRoute>
            }>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
