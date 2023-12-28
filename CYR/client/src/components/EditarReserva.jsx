import React, {useState} from 'react'
import ModalMessage from '../components/Modal/ModalMessage'
import ModalLoading from '../components/Modal/ModalLoading'
import reservaService from '../helpers/reservaService';

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import '../scss/components/EditarReserva.scss'

const EditarReserva = ({id, estado}) => {
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [codigo, setCodigo] = useState("")

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
    setIsOpenModalMessage(false); 
    setHeaderMessage("");
    setTextMessage("")
    setNombre("");
    setTelefono("");
    window.location.reload()
  }

  const actualizarNombre = (event) => {
    setNombre(event.target.value)
  }
  const actualizarTelefono = (event) => {
    setTelefono(event.target.value)
  }
  const actualizarCodigo = (event) => {
    setCodigo(event.target.value)
  }

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();

    if(!estado){
      // Crear un objeto FormData para enviar datos de formulario, en este caso es para hacer una reserva
      formData.append('nombre', nombre);
      formData.append('telefono', telefono);
      formData.append('estado', "1");
    } else {
      // Crear un objeto FormData para enviar datos de formulario, en este caso es para cancelar una reserva
      formData.append('codigo', codigo);
      formData.append('nombre', "");
      formData.append('telefono', "");
      formData.append('estado', "");
    }
  
    try {
      openLoadingModal()
      const resultado = await reservaService.edit_reserva(id, formData)
      console.log("Datos: "+JSON.stringify(resultado))
      
      if (resultado.status === false) {
        
        setHeaderMessage("Error editando reserva: ")
        setTextMessage(resultado.error)
        throw new Error(resultado.error)
      } else {
        setHeaderMessage("Confirmación: ")
        setTextMessage(resultado.message)
      }
  
    } catch (error) {
      setHeaderMessage("Error editando reserva: ")
      setTextMessage(error.message)
  
    } finally {
      closeLoadingModal()
      openModalMessage()
    }
  }

  return ( 
    <>
      {estado?(
        
        <Form className="d-flex flex-column signup-formulario" onSubmit={handleSubmit}>
          <p style={{marginTop: "20px", fontSize: "18px", textAlign: 'justify'}}>Si desea cancelar la reserva debe ingresar el código que le fue mostrado al realizar la reserva</p>
          <Form.Group className="mb-3" controlId="codigo" style={{ width: "400px", textAlign:"left"}}>
            <Form.Label>
              Código de reserva:<b className="asterisco">*</b>
            </Form.Label>
            <Form.Control
              onChange={actualizarCodigo}
              value={codigo}
              type="text"
              placeholder="Ingrese el código"
              required
            />
          </Form.Group>

          <Button variant="danger" type="submit" style={{ width: "400px"}}>
            Cancelar Reserva
          </Button>

        </Form>
      ):(
        <Form className="d-flex flex-column signup-formulario" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nombre-cliente" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Nombre del cliente:<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarNombre}
            value = {nombre}
            type="text"
            placeholder="Ingrese su nombre"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="telefono-cliente" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Teléfono de contacto:<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarTelefono}
            value = {telefono}
            type="text"
            placeholder="Ingrese su teléfono"
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" style={{ width: "400px"}}>
          Confirmar Reserva
        </Button>

      </Form>
      )}

      {/* -----------------------------------Ventana Modal de Loading----------------------------------- */}
      <ModalLoading isOpen={isLoadingModal} />

      {/* ---------------------------Ventana Modal Mensaje Peticion OK / Error--------------------------- */}
      <ModalMessage isOpen={isOpenModalMessage} closeModal={closeModalMessage} headerMessage = {headerMessage} contentMessage = {textMessage}/>

    </>
   );
}
 
export default EditarReserva;