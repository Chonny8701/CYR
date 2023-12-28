import React,{useState} from 'react'
import Form from 'react-bootstrap/Form';
import '../scss/components/BarraBusqueda.scss'
import { IoIosSearch } from "react-icons/io";

const BarraBusqueda = ({listaNegocios, setListaNegocios}) => {
  const [palabraBusqueda,setPalabraBusqueda] = useState ("")
  const [selectorBusqueda, setSelectorBusqueda] = useState ("all")
  const [miListaNegocios,setMiListaNegocios] = useState (listaNegocios)

  const filtrarListaNegocios = (e) => {
    let negociosFiltrados;
    setSelectorBusqueda(e.target.value)

    if (e.target.value !== "all"){
      negociosFiltrados = listaNegocios.filter((negocio) => {
        return negocio.categoria === e.target.value;
      });
    } else {
      negociosFiltrados = listaNegocios
    }

    setListaNegocios(negociosFiltrados);
    setMiListaNegocios(negociosFiltrados);
    console.log(negociosFiltrados)
  };

  const filtrarPorBuscador = (e) => {
    setPalabraBusqueda(e.target.value)

    let negociosFiltrados;

    if (selectorBusqueda !== "all"){
      negociosFiltrados = listaNegocios.filter((negocio) => {
        return negocio.categoria === e.target.value;
      });
    } else {
      negociosFiltrados = listaNegocios
    }

    setMiListaNegocios(negociosFiltrados);

    const miListaNegociosFiltrada = miListaNegocios.filter((negocio) => {
      return negocio.nombre.toLowerCase().includes(palabraBusqueda.toLowerCase())
    })

    setListaNegocios(miListaNegociosFiltrada);
  }

  return ( 
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

      <Form.Select aria-label="Default select example" className='elemento-busqueda' style={{maxWidth:"300px"}} onChange={filtrarListaNegocios}>
        <option value="all">Filtrar por tipo de negocio</option>
        <option value="all">Todos</option>
        <option value="Peluquerias / Barberias">Peluquerias / Barberias</option>
        <option value="Oficinas">Oficinas</option>
      </Form.Select>

    </div>
   );
}
 
export default BarraBusqueda;