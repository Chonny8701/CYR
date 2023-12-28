import { useEffect, useState } from 'react';
import ModalMessage from '../components/Modal/ModalMessage'
import ModalLoading from '../components/Modal/ModalLoading'
import Negocio from '../components/Negocio';
import '../scss/components/Negocios.scss'
import imagenBlanco from "../images/imagen-blanco.webp";
import Form from 'react-bootstrap/Form';
import { IoIosSearch } from "react-icons/io";


const Negocios = ({filtro}) => {
  const [palabraBusqueda,setPalabraBusqueda] = useState ("")
  const [selectorBusqueda, setSelectorBusqueda] = useState ("all")

  const [allNegocios, setAllNegocios] = useState ([])
  const [listaNegociosFiltrados, setListaNegociosFiltrados] = useState ([])

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

  useEffect (() =>{

    // Realizar peticion para obtener todos los negocios
    try{
      // Visualizar Modal is Loading
      openLoadingModal()

      // Hacer petición GET para obtener informacion de todos los negocios
      const url = import.meta.env.VITE_SERVER_ROUTE + '/negocios/'+ filtro;
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
      };

      fetch(url, requestOptions)
        .then((response) => {

          // Comprobar errores en la petición
          if(!response.ok){
            throw new Error(`Error de red: ${response.status} ${response.statusText }`);
          }
          return response.json();
        })

        // Procesar datos recibidos
        .then (data => {
          setAllNegocios(data.data || [])
          setListaNegociosFiltrados(data.data || [])
          closeLoadingModal ();
        })

        // En caso de errores configurar ModalMessage para visualizar errores
        .catch (error => {
          setHeaderMessage ("Error en la petición: ");
          setTextMessage(error);

          closeLoadingModal ();
          openModalMessage();
        })

    } catch(error) {
      setHeaderMessage ("Error en la petición: ");
      setTextMessage(error);

      closeLoadingModal ();
      openModalMessage();
    }

  }, [])

  const filtrarListaNegocios = (e) => {
    let negociosFiltrados;
    setSelectorBusqueda(e.target.value);
    setPalabraBusqueda("");

    if (e.target.value !== "all"){
      negociosFiltrados = allNegocios.filter((negocio) => {
        return negocio.categoria === e.target.value;
      });
    } else {
      negociosFiltrados = allNegocios
    }

    setListaNegociosFiltrados(negociosFiltrados);
    console.log(negociosFiltrados)
  };

  const filtrarPorBuscador = (e) => {
    setPalabraBusqueda(e.target.value)

    let negociosFiltradosSelect;
    let negociosFiltradosBuscador;

    if (selectorBusqueda !== "all"){
      console.log("All Negocios: "+JSON.stringify(allNegocios)+"\n\n")
      negociosFiltradosSelect = allNegocios.filter((negocio) => {
        return negocio.categoria === selectorBusqueda;
      });
    } else {
      negociosFiltradosSelect = allNegocios
    }

    // setMiListaNegocios(negociosFiltrados);
    console.log("Negocios Filtrados Select: "+JSON.stringify(allNegocios)+"\n\n")

    negociosFiltradosBuscador = negociosFiltradosSelect.filter((negocio) => {
      return negocio.nombre.toLowerCase().includes(e.target.value.toLowerCase())
    })

    setListaNegociosFiltrados(negociosFiltradosBuscador);
  }

  return ( 
    <div className='d-flex flex-column justify-content-between' style={{height:"100%"}}>

      <div className='barra-busqueda-contenedor'>
        <Form.Group controlId="formBuscador" className="input-con-icono elemento-busqueda" style={{maxWidth:"300px"}} >
          <IoIosSearch className="icono-input" />
          <Form.Control
            onChange={filtrarPorBuscador}
            type="text"
            placeholder="Buscador"
            aria-describedby="passwordHelpBlock"
            value = {palabraBusqueda}
          />
        </Form.Group>

        <Form.Select aria-label="Default select example" className='elemento-busqueda' style={{maxWidth:"300px"}} onChange={filtrarListaNegocios} defaultValue="all">
          {/* <option value="all">Filtrar por tipo de negocio</option> */}
          <option value="all">Mostrar Todos</option>
          <option value="Peluquerias / Barberias">Peluquerias / Barberias</option>
          <option value="Oficinas">Oficinas</option>
        </Form.Select>
      </div>

      <div className="negocios-contenedor">
        {listaNegociosFiltrados.length > 0 ? (
          listaNegociosFiltrados.map((negocio) => {
            const url_imagen_server = negocio.url_imagen
              ? `${import.meta.env.VITE_SERVER_ROUTE}/negocios/uploads/images/${negocio.url_imagen}`
              : imagenBlanco;

            return (
              <Negocio
                key={negocio.id}
                id={negocio.id}
                nombre={negocio.nombre}
                telefono={negocio.telefono}
                email={negocio.email}
                ubicacion={negocio.ubicacion}
                hora_inicio={negocio.hora_inicio}
                hora_fin={negocio.hora_fin}
                intervalo={negocio.intervalo}
                url_imagen={url_imagen_server}
                filtro = {filtro}
              />
            );
          })
        ) : (
          <p>No existen negocios disponibles.</p>
        )}
      </div>

      {/* ---------------------------------Ventana Modal Loading--------------------------------- */}
      <ModalLoading isOpen={isLoadingModal} />

    </div>
   );
}
 
export default Negocios;