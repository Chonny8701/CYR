import React, {useState} from 'react'
import Reserva from './Reserva';

import Form from "react-bootstrap/Form";

const formatearFecha = (fechaDate) => {
  const year = fechaDate.getFullYear();
  const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
  const day = fechaDate.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`
};

const Reservas = ({lista_reservas}) => {
  // console.log(JSON.stringify(lista_reservas))
  const today = new Date();
  const fechaActual = formatearFecha(today)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaActual);

  // Filtrar las reservas por la fecha seleccionada en el input
  const reservasFiltradas = lista_reservas.filter((reserva) => {
    const fechaReserva = formatearFecha(new Date(reserva.fecha));
    return fechaReserva === fechaSeleccionada;
  });

  const reservasFiltradasOrdenadas = reservasFiltradas.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
  
    return fechaA - fechaB;
  });

  const actualizarFechaSeleccionada = (e) => {
    console.log("Actualizando fecha")
    setFechaSeleccionada(e.target.value)
  }

  return ( 
    <div className='container d-flex flex-column gap-0 align-items-center'>
      <Form.Group className="mb-3" controlId="email-usuario" style={{width:"100%", maxWidth: "400px", textAlign:"left"}}>
        <Form.Label>Seleccione una fecha para la cita</Form.Label>
        <Form.Control
          onChange={actualizarFechaSeleccionada}
          type="date"
          value={fechaSeleccionada}
        />
      </Form.Group>
      <p style={{fontSize: "20px"}}>Reservas para el día: <b>{fechaSeleccionada}</b></p>

      <div className='reservas-contenedor ' >
        {reservasFiltradasOrdenadas && reservasFiltradasOrdenadas.length > 0 ? (
          reservasFiltradasOrdenadas.map((reserva) => (
            <Reserva key = {reserva.id} id = {reserva.id} fecha = {reserva.fecha} estado = {reserva.estado}/>
          ))
        ) : (
          <p>No hay reservas disponibles.</p>
        )}
      </div>
    </div>
   );
}
 
export default Reservas;