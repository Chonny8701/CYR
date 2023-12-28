// Funcion para peticion al servidor de todas las reservas de un negocio
const get_all_reservas_from_negocio = async (id_negocio) => {
  try {
    const url = import.meta.env.VITE_SERVER_ROUTE + '/reservas/negocio/' + id_negocio
    const requestOptions = {
      method: 'GET',
    }

    // Realizar la solicitud GET para obtener reservas de ese negocio
    return fetch(url, requestOptions)
    
            // Verificar si la respuesta es exitosa (código de estado 200-299)
            .then(response => {
              if (!response.ok){
                throw new Error(`Error de red: ${response.status} ${response.statusText }`);
              }
              // Parsear la respuesta JSON
              return response.json();
            })

            .then(data => {
              // Manejar los datos recibidos
              console.log('Datos recibidos:', data);
              return data;
            })

            .catch(error => {
              // Capturar y manejar errores
              console.error('Error en la petición:', error);
              return {"error": error, "data":[]};
            });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    return {"error": error, "data":[]}
  }
}

// Funcion para peticion al servidor de añadir una nueva reserva (No se usa, las nuevas reservas las crea automaticamente el servidor)
const add_user_event = async (new_event) => {
  try{
    // Enviar la solicitud POST al servidor
    const res = await fetch(import.meta.env.VITE_SERVER_ROUTE + '/eventos/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
      body: new_event ,
    });

    // Obtener datos del servidor en formato JSON
    const data = await res.json();

    // El evento no fue agregado correctamente
    if (!res.ok) {
      const errorMessage = data.error || 'Error al agregar evento';
      return { "error": errorMessage }; // Devuelve el mensaje de error como objeto
    }

    // El evento fue agregado correctamente
    console.log('Evento agregado correctamente');
    return { "message": data.message }; // Devuelve un mensaje de evento agregado correctamente

  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { "error": error }; // Manejo de errores generales
  }
}

// Funcion para peticion al servidor de editar una reserva
const edit_reserva = async (id, editted_reserva) => {
  try{
    const url = import.meta.env.VITE_SERVER_ROUTE + '/reservas/edit/' + id;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
      body: editted_reserva,
    }

    // Enviar la solicitud POST al servidor
    return fetch(url, requestOptions)
      .then (response => {
        return response.json();
      })
      .then(data => {
        // Manejar los datos recibidos
        console.log('Datos recibidos:', data);
        return data;
      })
      .catch(error => {
        // Capturar y manejar errores
        console.error('Error en la petición:', error);
        return error;
      });

  } catch (error) {
    return error;
  }
}

const reservaService = {
  get_all_reservas_from_negocio,
  add_user_event,
  edit_reserva,
};

export default reservaService;