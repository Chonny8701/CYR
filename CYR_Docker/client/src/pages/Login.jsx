import { useState } from "react";
import { Link } from 'react-router-dom';

import authService from "../helpers/authService";
import {MiErrorPersonalizado} from "../helpers/generales"
import ModalMessage from '../components/Modal/ModalMessage'
import ModalLoading from '../components/Modal/ModalLoading'

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../scss/pages/Login.scss";

const Login = () => {
  const [emailUsuario, setEmailUsuario] = useState("");
  const [passwordUsuario, setPasswordUsuario] = useState("");

  // Estado para controlar la visibilidad ventana modal de Loading ...
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const closeLoadingModal = () => {setIsLoadingModal(false)};
  const openLoadingModal = () => {setIsLoadingModal(true)};

  // Estado para controlar la visibilidad ventana modal de Mensaje ...
  const [isOpenModalMessage, setIsOpenModalMessage] = useState(false)
  const [headerMessage, setHeaderMessage] = useState ("")
  const [textMessage, setTextMessage] = useState ("")
  const openModalMessage = () => { setIsOpenModalMessage(true) }
  const closeModalMessage = () =>{
    setHeaderMessage ("");
    setTextMessage("");
    setIsOpenModalMessage(false)
    // navigate('/login');
    // window.location.reload()
  }

  // Actualizar valor de los inputs
  const actualizarEmail = (event) => {
    setEmailUsuario(event.target.value);
    console.log(event.target.value);
  };
  const actualizarPassword = (event) => {
    setPasswordUsuario(event.target.value);
    console.log(event.target.value);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Crear un objeto con los datos del formulario
    const formData = {
      emailUsuario,
      passwordUsuario,
    };
  
    try{
      // Mostrar ventana modal de loading en lo que se procesa la peticion
      openLoadingModal();

      // Realizar la peticion http para loguear usuario
      const res = await authService.handleLogin(formData);

      // Si hubo errores en la peticion
      if (!res.status)
        throw new MiErrorPersonalizado(res.error || "Error en el inicio de sesión del usuario");
      
      closeLoadingModal()

      window.location.href = '/usuario/cuenta';

    } catch (error) {
      // Configurar mensaje de finalizacion cuando hubo errores
      setHeaderMessage("Error en el inicio de sesión del usuario:")
      setTextMessage(error.message)

      // Cerrar ventana modal de Loading ...
      closeLoadingModal()

      // Abrir ventana modal de Mensaje
      openModalMessage()
    }
  };

  return (
    <div className="login-contenedor">
      <h3>INICIO DE SESIÓN</h3>
      <hr/>
        <Form className="login-formulario container" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email-usuario" style={{width:"100%", maxWidth: "400px", textAlign:"left"}}>
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              onChange={actualizarEmail}
              type="email"
              placeholder="Ingrese su correo electrónico"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 flex-grow-1" controlId="password-usuario" style={{width:"100%", maxWidth: "400px", textAlign:"left"}}>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              onChange={actualizarPassword}
              type="password"
              placeholder="Ingrese su contraseña"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" style={{width:"100%", maxWidth: "400px"}}>
            Iniciar Sesión
          </Button>
        </Form>
        <div className="d-flex justify-content-center">
          No tiene una cuenta? <Link to="/signup" className="login-linkTo"><b>Regístrate</b></Link>
        </div>

        {/* -----------------------------------Ventana Modal de Loading----------------------------------- */}
        <ModalLoading isOpen={isLoadingModal} />

        {/* ---------------------------Ventana Modal Mensaje Peticion OK / Error--------------------------- */}
        <ModalMessage isOpen={isOpenModalMessage} closeModal={closeModalMessage} headerMessage = {headerMessage} contentMessage = {textMessage}/>

      </div>
  );
};

export default Login;
