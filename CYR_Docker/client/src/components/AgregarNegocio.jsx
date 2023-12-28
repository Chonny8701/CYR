import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie"; // Importa la librería Cookies

import ModalMessage from '../components/Modal/ModalMessage'
import ModalLoading from '../components/Modal/ModalLoading'
import negocioService from "../helpers/negocioService"

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import '../scss/components/AgregarNegocio.scss'
import imagenBlanco from "../images/imagen-blanco.webp";

const AgregarNegocio = () => {
  const [categoria, setCategoria] = useState("Peluquerias / Barberias")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const [horaInicio, setHoraInicio] = useState("10:00")
  const [horaFin, setHoraFin] = useState("22:00")
  const [intervalo, setIntervalo] = useState("01:00")
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(imagenBlanco);

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
    setEmail("");
    setUbicacion("");
    setHoraInicio("10:00");
    setHoraFin("22:00");
    setIntervalo("01:00");
    window.location.reload()
  }
  const actualizarCategoria = (event) => {
    setCategoria(event.target.value)
  }
  const actualizarNombre = (event) => {
    setNombre(event.target.value)
  }
  const actualizarTelefono = (event) => {
    const nuevoTelefono = event.target.value;
  
    // Validar si el nuevoTeléfono es un número o tiene el símbolo '+'
    if (/^\+?\d+$/.test(nuevoTelefono) || nuevoTelefono === "") {
      // Limitar la longitud a un máximo de 15 caracteres
      if (nuevoTelefono.length <= 15) {
        setTelefono(nuevoTelefono);
      }
    }
  };
  const actualizarEmail = (event) => {
    setEmail(event.target.value)
  }
  const actualizarUbicacion = (event) => {
    setUbicacion(event.target.value)
  }
  const actualizarHoraInicio = (event) => {
    console.log(event.target.value)
    setHoraInicio(event.target.value)
  }
  const actualizarHoraCierre = (event) => {
    setHoraFin(event.target.value)
  }
  const actualizarIntervalo = (event) => {
    console.log(event.target.value)
    setIntervalo(event.target.value)
  }
  // Manejar el cambio en el campo de entrada de archivo
  const actualizarImagen = (e) => {
    const file = e.target.files[0];
    setImagen(file);

    // Mostrar la vista previa de la imagen
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Crear un objeto FormData para enviar datos de formulario, incluida la imagen
    const formData = new FormData();
    formData.append('categoria', categoria);
    formData.append('nombre', nombre);
    formData.append('telefono', telefono);
    formData.append('email', email);
    formData.append('ubicacion', ubicacion);
    formData.append('imagen', imagen); // Agregar la imagen al formulario
    formData.append('hora_inicio', horaInicio);
    formData.append('hora_fin', horaFin);
    formData.append('intervalo', intervalo);
    formData.append('id_usuario', Cookies.get("access_token"));
  
    try {
      openLoadingModal()
      const resultado = await negocioService.add_new_negocio(formData)
      console.log(resultado)
      if (!resultado.status) {
        setHeaderMessage("Error agregando negocio: ")
        setTextMessage(resultado.error.message)
      } else {
        setHeaderMessage("Confirmación: ")
        setTextMessage(resultado.message)
      }
  
    } catch (error) {
      setHeaderMessage("Error agregando negocio: ")
      setTextMessage(error.message)
  
    } finally {
      closeLoadingModal()
      openModalMessage()
    }
  }
  
  return ( 
    <div className='agregar-negocio-contenedor'>
      <h3>AGREGAR NEGOCIO</h3>
      <hr style={{width: "100%"}}/>
      <Form className="d-flex flex-column signup-formulario" onSubmit={handleSubmit}>

        {previewUrl && (
          <div>
            <img src={previewUrl} alt="Vista previa" style={{ maxWidth: "400px" }} />
          </div>
        )}
        <Form.Group controlId="formFile" className="mb-3" style={{ width: "400px", textAlign:"left"}}>
          <Form.Control type="file" accept="image/*" onChange={actualizarImagen} />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
              Categoria del negocio:<b className="asterisco">*</b>
            </Form.Label>
          <Form.Select aria-label="Default select example" onChange={actualizarCategoria} value = {categoria}>
            <option value="Peluquerias / Barberias">Peluquerias / Barberias</option>
            <option value="Oficinas">Oficinas</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="nombre-negocio" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Nombre del negocio:<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarNombre}
            value = {nombre}
            type="text"
            placeholder="Ingrese su nombre"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="telefono-negocio" style={{ width: "400px", textAlign:"left"}}>
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

        <Form.Group className="mb-3" controlId="email-negocio" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Email de contacto:<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarEmail}
            value = {email}
            type="text"
            placeholder="Ingrese su email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="direccion-negocio" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Ubicación:<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarUbicacion}
            type="text"
            value = {ubicacion}
            placeholder="Ingrese su dirección"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="hora-inicio" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Hora de apertura:<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarHoraInicio}
            value = {horaInicio}
            type="time"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="hora-cierre" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Hora de cierre:<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarHoraCierre}
            value = {horaFin}
            type="time"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="intervalo" style={{ width: "400px", textAlign:"left"}}>
          <Form.Label>
            Tiempo entre citas:<b className="asterisco">*</b>
          </Form.Label>
          <Form.Control
            onChange={actualizarIntervalo}
            value = {intervalo}
            type="time"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ width: "400px"}}>
          Añadir Negocio
        </Button>

        {/* -----------------------------------Ventana Modal de Loading----------------------------------- */}
        <ModalLoading isOpen={isLoadingModal} />

        {/* ---------------------------Ventana Modal Mensaje Peticion OK / Error--------------------------- */}
        <ModalMessage isOpen={isOpenModalMessage} closeModal={closeModalMessage} headerMessage = {headerMessage} contentMessage = {textMessage}/>

      </Form>
    </div>
   );
}
 
export default AgregarNegocio;