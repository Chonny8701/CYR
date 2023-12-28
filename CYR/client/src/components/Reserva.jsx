import React, {useState} from 'react'
import Modal from "./Modal/Modal"; // Importa el componente Modal
import Button from 'react-bootstrap/Button';
import EditarReserva from './EditarReserva';

const formatearFechaHora = (fechaDate) => {
  const year = fechaDate.getFullYear();
  const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
  const day = fechaDate.getDate().toString().padStart(2, '0');
  const hour = fechaDate.getUTCHours().toString().padStart(2, '0');
  const minutes = fechaDate.getMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day} - ${hour}:${minutes}`;
};

const Reserva = ({id,  fecha, estado }) => {

  // console.log(JSON.stringify(fecha))
  const fechaDate = new Date(fecha);

  // Estado para controlar la visibilidad ventana modal de Mensaje ...
  const [isOpenModalReserva, setIsOpenModalReserva] = useState(false)
  const openModalReserva = () => { setIsOpenModalReserva(true) }
  const closeModalReserva = () =>{ setIsOpenModalReserva(false)  }

  const estiloCita = {
    backgroundColor: estado ? 'gray' : 'green',
    padding: '10px',
    color: 'white',
    cursor: estado ? 'default' : 'pointer',
    border: '2px solid',
    borderRadius: '10px',
    width: '400px'
  };

  return (
    <div className='d-flex flex-column justify-content-center align-items-center' style={estiloCita} onClick={openModalReserva}>
      {formatearFechaHora(fechaDate)} - Estado: {estado ? 'Reservado' : 'Disponible'}

        {/* ---------------------------Ventana Modal Visualizar Reservas--------------------------- */}
      <Modal isOpen={isOpenModalReserva} closeModal={closeModalReserva} >
        <div className='d-flex flex-column justify-content-center align-items-center'>
          {/* Contenido del modal */}
          <EditarReserva id = {id} estado = {estado}/>
          <Button variant="secondary" style={{marginTop:"20px", width:"400px"}} onClick={closeModalReserva}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Reserva