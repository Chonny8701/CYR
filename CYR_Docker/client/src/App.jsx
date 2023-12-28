import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CuentaUsuario from './pages/CuentaUsuario'
import Error404 from './pages/Error404'

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/App.scss'

const App = () => {
  const [id, setId] = useState (null)
  const [nombre, setNombre] = useState(null);
  const [telefono, setTelefono] = useState(null);
  const [email, setEmail] = useState(null);
  const [contraseña, setContraseña] = useState(null);
  const [cuentaBancaria, setCuentaBancaria] = useState(null);

  const actualizarUsuarioGeneral = (usuario) => {
    const {id, nombre, telefono, email, contraseña, cuenta_bancaria} = usuario
    setId(id)
    setNombre(nombre);
    setTelefono(telefono);
    setEmail(email);
    setContraseña(contraseña)
    setCuentaBancaria(cuenta_bancaria)
    console.log(email)
  }

  return (
    <>
      <Header email= {email}/>
      <div className='app-info-contenedor'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login actualizarUsuarioGeneral={actualizarUsuarioGeneral}/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/usuario/cuenta" element={<CuentaUsuario/>}/>
            <Route path="*" element={<Error404/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      <Footer/>
    </>
  )
}

export default App
