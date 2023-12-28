import { useState, useEffect } from 'react';
import Modal from './Modal/Modal';
import ModalMessage from './Modal/ModalMessage';
import Reservas from './Reservas';
import reservaService from '../helpers/reservaService';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaPhoneAlt } from 'react-icons/fa';

const Negocio = ({ id, nombre, telefono, email, ubicacion, hora_inicio, hora_fin, intervalo, url_imagen, filtro }) => {
  const [isOpenModalReserva, setIsOpenModalReserva] = useState(false);
  const [isOpenModalMessage, setIsOpenModalMessage] = useState(false);
  const [headerMessage, setHeaderMessage] = useState('');
  const [textMessage, setTextMessage] = useState('');
  const [listaReservas, setListaReservas] = useState([]);

  useEffect(() => {
    const peticionFetch = async () => {
      try {
        const respuesta = await reservaService.get_all_reservas_from_negocio(id);
        if (respuesta.error) {
          throw new Error(`Error de red: ${respuesta.error}`);
        }
        setListaReservas(respuesta.data || []);
      } catch (error) {
        console.error(error);
        setListaReservas([]);
      }
    };

    peticionFetch();
  }, [id]);

  const eliminarNegocio = async () => {
    try {
      const url = import.meta.env.VITE_SERVER_ROUTE + '/negocios/delete/' + id;
      const requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, '$1')}`,
        },
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        console.log(`Estado de la respuesta: ${response.status}`);
        if (response.status === 401) {
          // Realizar acciones específicas para un error de autenticación, si es necesario
        }
        throw new Error(`Error de red: ${response.status} ${response.statusText}`);
      }

      // Si todo está bien, recargar la página
      window.location.reload();
    } catch (error) {
      // Mostrar un mensaje de error
      setHeaderMessage('Error en la eliminación del negocio');
      setTextMessage(error.message);
      setIsOpenModalMessage(true);
    }
  };

  return (
    <>
      <Card style={{ width: '15rem', overflow: 'hidden' }}>
        <Card.Img variant="top" src={url_imagen} style={{ width: '15rem', height: '15rem' }} />
        <Card.Body>
          <Card.Title style={{ height: '50px', overflow: 'hidden' }}>{nombre}</Card.Title>
          <Card.Text>
            <FaPhoneAlt
              style={{
                backgroundColor: '#094067',
                borderRadius: '50%',
                color: 'white',
                margin: '3px',
                padding: '3px',
                width: '20px',
                height: '20px',
              }}
            />{' '}
            {telefono}
          </Card.Text>
          {filtro === 'all' ? (
            <Button variant="dark" onClick={() => setIsOpenModalReserva(true)}>
              Reservar
            </Button>
          ) : (
            <Button variant="danger" onClick={eliminarNegocio} style={{ width: '100px' }}>
              Eliminar
            </Button>
          )}
        </Card.Body>
      </Card>

      {/* Ventana Modal Visualizar Reservas */}
      <Modal isOpen={isOpenModalReserva} closeModal={() => setIsOpenModalReserva(false)}>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Reservas lista_reservas={listaReservas} />
          <Button variant="dark" style={{ marginTop: '20px', width: '400px' }} onClick={() => setIsOpenModalReserva(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>

      {/* Ventana Modal Mensaje Peticion OK / Error */}
      <ModalMessage isOpen={isOpenModalMessage} closeModal={() => setIsOpenModalMessage(false)} headerMessage={headerMessage} contentMessage={textMessage} />
    </>
  );
};

export default Negocio;
