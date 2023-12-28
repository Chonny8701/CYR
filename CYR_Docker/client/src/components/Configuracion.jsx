import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import authService from "../helpers/authService";

import ModalLoading from './Modal/ModalLoading'
import ModalMessage from "./Modal/ModalMessage";
import ModalDialogo from "./Modal/ModalDialogo";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../scss/components/Configuracion.scss";

const Configuracion = () => {

  // Estados variables del usuario
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [newPasswordUsuario, setNewPasswordUsuario] = useState("");
  const [originalPasswordUsuario, setOriginalPasswordUsuario] = useState("");
  const [cuentaBancariaUsuario, setCuentaBancariaUsuario] = useState("");

  // Estado para controlar la visibilidad ventana modal de Loading ...
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const closeLoadingModal = () => { setIsLoadingModal(false); };
  const openLoadingModal = () => { setIsLoadingModal(true); };

  // Estado para controlar la visibilidad ventana modal de Dialogo (Aceptar / Cancelar) ...
  const [isOpenModalDialogo, setIsOpenModalDialogo] = useState(false);
  const openModal = () => { setIsOpenModalDialogo(true); };
  const closeModal = () => { setIsOpenModalDialogo(false); };

  // Estado para controlar la visibilidad ventana modal de Mensaje ...
  const [isOpenModalMessage, setIsOpenModalMessage] = useState(false)
  const [headerMessage, setHeaderMessage] = useState ("")
  const [textMessage, setTextMessage] = useState ("")
  const openModalMessage = () => { setIsOpenModalMessage(true) }
  const closeModalMessage = () =>{
    setHeaderMessage ("");
    setTextMessage("");
    setIsOpenModalMessage(false)

    // actualizarUsuarioGeneral(usuario)
    window.location.reload()
  }
 
  // Actualizar campos de entrada de datos
  const actualizarNombre = (event) => {
    setNombreUsuario(event.target.value);
  };
  const actualizarTelefono = (event) => {
    setTelefonoUsuario(event.target.value);
  };
  const actualizarEmail = (event) => {
    setEmailUsuario(event.target.value);
  };
  const actualizarNewPassword = (event) => {
    setNewPasswordUsuario(event.target.value);
  };
  const actualizarOriginalPassword = (event) => {
    setOriginalPasswordUsuario(event.target.value);
  };
  const actualizarCuentaBancaria = (event) => {
    setCuentaBancariaUsuario(event.target.value);
  };

  // Actualizar informacion en el servidor
  const actualizarInfoUsuarioServidor = async () =>{
    openLoadingModal();
    const datosActualizados = await authService.actualizarInfoUsuarioDB(nombreUsuario, telefonoUsuario, emailUsuario, newPasswordUsuario, originalPasswordUsuario,cuentaBancariaUsuario)
    closeLoadingModal()

    if (datosActualizados.message){
      setHeaderMessage("Confirmacion:")
      setTextMessage(datosActualizados.message)

      if (datosActualizados.data){
        Cookies.set("nombre", datosActualizados.data.nombre)
        Cookies.set("email", datosActualizados.data.email)
        Cookies.set("telefono", datosActualizados.data.telefono)
        Cookies.set("contraseña", datosActualizados.data.contraseña)
        Cookies.set("cuenta_bancaria", datosActualizados.data.cuenta_bancaria)
      }
    }
    else if (datosActualizados.error){
      setHeaderMessage("Error en la actualización del usuario:")
      setTextMessage(datosActualizados.message)
    }
    else{
      setHeaderMessage("Error en la actualización del usuario:")
      setTextMessage("No se ha podido completar la actualizacion del usuario")
    }
    openModalMessage()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const respuesta = await authService.checkAccessToken(); // Llama a la función de authService
        console.log(respuesta)
        if (respuesta){
          setNombreUsuario(respuesta.nombre);
          setTelefonoUsuario(respuesta.telefono);
          setEmailUsuario(respuesta.email);
          setCuentaBancariaUsuario(respuesta.cuenta_bancaria);
        }
        
      } catch (error) {
        console.error("Error al verificar el token de acceso:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="configuracion-contenedor">
      <h3>AJUSTES DEL PERFIL</h3>
      <hr />
      <Form className="d-flex flex-column signup-formulario">
        <Form.Group className="mb-3" controlId="nombre-usuario" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Nombre completo<b className="asterisco">*</b>
          </Form.Label>
            <Form.Control
              onChange={actualizarNombre}
              type="text"
              placeholder="Ingrese su nombre"
              value={nombreUsuario}
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
                value={telefonoUsuario}
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
                value={emailUsuario}
                required
              />
          </Form.Group>
        </div>

        <div className="d-flex usuario-form-contacto">
          <Form.Group className="mb-3 flex-grow-1" controlId="password-usuario" style={{ width: "400px", textAlign:"left"}}>
            <Form.Label>
              Nueva Contraseña
            </Form.Label>
              <Form.Control
                onChange={actualizarNewPassword}
                type="password"
                placeholder="Ingrese su contraseña"
              />
          </Form.Group>

          <Form.Group className="mb-3 flex-grow-1" controlId="cuenta-bancaria" style={{ width: "400px", textAlign:"left"}}>
            <Form.Label>Cuenta bancaria</Form.Label>
              <Form.Control
                onChange={actualizarCuentaBancaria}
                type="text"
                placeholder="Ingrese su número de cuenta bancaria"
                value={cuentaBancariaUsuario}
              />
          </Form.Group>
        </div>

        <Button variant="primary"  onClick={openModal}>
          Guardar Cambios
        </Button>
      </Form>

      {/* ---------------------------------Ventana Modal Verificacion--------------------------------- */}
      <ModalDialogo isOpen={isOpenModalDialogo} closeModal={closeModal} actualizarInfoUsuarioServidor={actualizarInfoUsuarioServidor} actualizarOriginalPassword={actualizarOriginalPassword}/>

      {/* ---------------------------------Ventana Modal Mensaje--------------------------------- */}
      <ModalMessage isOpen={isOpenModalMessage} closeModal={closeModalMessage} headerMessage = {headerMessage} contentMessage = {textMessage}/>

      {/* ---------------------------------Ventana Modal Loading--------------------------------- */}
      <ModalLoading isOpen={isLoadingModal} />

    </div>
  );
};

export default Configuracion;
