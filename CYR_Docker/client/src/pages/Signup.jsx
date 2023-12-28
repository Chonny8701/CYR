import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import authService from "../helpers/authService";
import ModalMessage from '../components/Modal/ModalMessage'
import ModalLoading from '../components/Modal/ModalLoading'
import { MiErrorPersonalizado} from "../helpers/generales";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../scss/pages/Signup.scss";

const Signup = () => {
  // Para redireccionar
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [passwordUsuario, setPasswordUsuario] = useState("");
  const [cuentaBancariaUsuario, setCuentaBancariaUsuario] = useState("");

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
    navigate('/login');
    // window.location.reload()
  }

  // Actualizar valor de los inputs
  const actualizarNombre = (event) => {
    setNombreUsuario(event.target.value);
    console.log(event.target.value);
  };
  const actualizarTelefono = (event) => {
    setTelefonoUsuario(event.target.value);
    console.log(event.target.value);
  };
  const actualizarEmail = (event) => {
    setEmailUsuario(event.target.value);
    console.log(event.target.value);
  };
  const actualizarPassword = (event) => {
    setPasswordUsuario(event.target.value);
    console.log(event.target.value);
  };
  const actualizarCuentaBancaria = (event) => {
    setCuentaBancariaUsuario(event.target.value);
    console.log(event.target.value);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Crear un objeto con los datos del formulario
    const formData = {
      nombreUsuario,
      telefonoUsuario,
      emailUsuario,
      passwordUsuario,
      cuentaBancariaUsuario,
    };

    try{
      // Mostrar ventana modal de loading en lo que se procesa la peticion
      openLoadingModal();

      // Realizar la peticion http para añadir usuario
      const res = await authService.handleSignUp(formData)

      // Si hubo errores en la peticion
      if (!res.status)
        throw new MiErrorPersonalizado(res.error || "Error en la peticion al servidor para el registro del nuevo usuario");

      // Si la petición finalizó correctamente configurar mensaje de finalizacion
      setHeaderMessage("Confirmacion:")
      setTextMessage(res.message || "Usuario registrado correctamente")

    } catch (error){
        // Configurar mensaje de finalizacion cuando hubo errores
        setHeaderMessage("Error en registro de usuario:")
        setTextMessage(error.message)

    } finally{
      // Cerrar ventana modal de Loading ...
      closeLoadingModal()

      // Abrir ventana modal de Mensaje
      openModalMessage()
    }
  };
  
  return (
    <div className="signup-contenedor">
      <h3>REGISTRO DE USUARIO</h3>
      <hr />

      <Form className="d-flex flex-column signup-formulario" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nombre-usuario" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Nombre completo<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarNombre}
            type="text"
            placeholder="Ingrese su nombre"
            required
          />
        </Form.Group>

        <div className="d-flex usuario-form-contacto">
          <Form.Group className="mb-3 flex-grow-1" controlId="telefono-usuario" style={{ width: "400px", textAlign:"left"}}>
            <Form.Label>
              Teléfono<b className="asterisco">*</b>
            </Form.Label>
            <Form.Control
              onChange={actualizarTelefono}
              type="text"
              placeholder="Ingrese su teléfono"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 flex-grow-1" controlId="email-usuario" style={{ width: "400px", textAlign:"left"}}>
            <Form.Label>
              E-mail<b className="asterisco">*</b>
            </Form.Label>
            <Form.Control
              onChange={actualizarEmail}
              type="email"
              placeholder="Ingrese su correo electrónico"
              required
            />
          </Form.Group>
        </div>
        <div className="d-flex usuario-form-contacto">
          <Form.Group className="mb-3 flex-grow-1" controlId="password-usuario" style={{ width: "400px", textAlign:"left"}}>
            <Form.Label>
              Contraseña<b className="asterisco">*</b>
            </Form.Label>
            <Form.Control
              onChange={actualizarPassword}
              type="password"
              placeholder="Ingrese su contraseña"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 flex-grow-1" controlId="cuenta-bancaria" style={{ width: "400px", textAlign:"left"}}>
            <Form.Label>Cuenta bancaria</Form.Label>
            <Form.Control
              onChange={actualizarCuentaBancaria}
              type="text"
              placeholder="Ingrese su número de cuenta bancaria"
            />
          </Form.Group>
        </div>

        <Button variant="primary" type="submit" style={{ width: "400px"}}>
          Registrarse
        </Button>
        
      </Form>
      <div>
        Ya tienes una cuenta? <Link to="/login" className="signup-linkTo"><b>Iniciar Sesión</b></Link>
      </div>

      {/* -----------------------------------Ventana Modal de Loading----------------------------------- */}
      <ModalLoading isOpen={isLoadingModal} />

      {/* ---------------------------Ventana Modal Mensaje Peticion OK / Error--------------------------- */}
      <ModalMessage isOpen={isOpenModalMessage} closeModal={closeModalMessage} headerMessage = {headerMessage} contentMessage = {textMessage}/>

    </div>
  );
};

export default Signup;
