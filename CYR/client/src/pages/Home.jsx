
import {useState}from 'react'
import Negocios from "../components/Negocios";
import Reservas from "../components/Reservas";
import '../scss/pages/Home.scss'

const Home = () => {
  const [reservas_negocio , setReservas] = useState([
    { id: 1, id_negocio: 101, fecha: '2023-01-01 08:00:00', estado: true },
    { id: 2, id_negocio: 101, fecha: '2023-01-01 12:00:00', estado: true },
    { id: 3, id_negocio: 101, fecha: '2023-01-01 16:00:00', estado: false },
    { id: 4, id_negocio: 101, fecha: '2023-01-01 20:00:00', estado: false },
    { id: 5, id_negocio: 101, fecha: '2023-01-02 00:00:00', estado: true },
  ]);
  
  return ( 
    <div className='d-flex flex-column justify-content-between' style={{height:"100%"}}>
      <Negocios filtro = 'all'/>
      {/* <Reservas lista_reservas = {reservas_negocio}/> */}
    </div>
   );
}
 
export default Home;