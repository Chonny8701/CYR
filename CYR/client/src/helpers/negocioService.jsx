import Cookies from "js-cookie"; // Importa la librería Cookies

const get_all_negocios = async () => {
  try {
    // Construir la URL de la solicitud GET
    const url = import.meta.env.VITE_SERVER_ROUTE + '/negocios/all';

    // Realizar la solicitud GET al servidor
    fetch(url)
      .then(response => {
        // Verificar si la respuesta es exitosa (código de estado 200-299)
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
        // Parsear la respuesta JSON
        return response.json();
      })
      .then(data => {
        // Manejar los datos recibidos
        console.log('Datos recibidos:', data);
        return {"data": data};
      })
      .catch(error => {
        // Capturar y manejar errores
        console.error('Error en la petición:', error);
        return {"error": error, "data":[]};
      });
    
  } catch (error) {
    return {"error": error, "data":[]};
  }
}

const get_all_negocios_from_user = async () => {
  try {
    // Construir la URL de la solicitud GET
    const url = import.meta.env.VITE_SERVER_ROUTE + '/negocios/usuario';
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
    }

    // Realizar la solicitud POST al servidor con el access_token
    fetch(url, requestOptions)
      .then (response => {
        // Verificar si la respuesta es exitosa (código de estado 200-299)
        if(!response.ok){

          // Si devuelve error 401 es que la sesion del usuario ha caducado entonces eliminamos cookies
          if(response.status === 401){
            // Array con los nombres de las cookies que deseas eliminar
            const cookiesToDelete = ['access_token', 'refresh_token', 'id', 'nombre', 'telefono', 'email', 'cuenta_bancaria', 'contraseña'];

            // Recorre el array y elimina cada cookie
            cookiesToDelete.forEach(cookieName => {
              Cookies.remove(cookieName);
            });
          }
          throw new Error(`Error de red: ${response.status}`)
        }

        // Parsear la respuesta JSON
        return response.json()
      })
      .then (data => {
        console.log('Datos recibidos:', data);
        return {"data": data};
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

const add_new_negocio = async (formData) => {
  try {
    console.log(formData)
    // Enviar la solicitud POST al servidor
    const url = import.meta.env.VITE_SERVER_ROUTE + '/negocios/add';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
      body: formData,
    };

    return fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          // Si devuelve error 401 es que la sesión del usuario ha caducado, entonces eliminamos cookies
          if (response.status === 401 || response.status === 422) {
            // Array con los nombres de las cookies que deseas eliminar
            const cookiesToDelete = ['access_token', 'refresh_token', 'id', 'nombre', 'telefono', 'email', 'cuenta_bancaria', 'contraseña'];

            // Recorre el array y elimina cada cookie
            cookiesToDelete.forEach(cookieName => {
              Cookies.remove(cookieName);
            });

            // Redireccionar a Login
            window.location.href = '/login';
          }
          throw new Error(`Error de red: ${response.status} ${response.statusText }`);
        }

        return response.json();
      })
      .then( () => {
        return { "message": "Negocio añadido correctamente", "status": true };
      })
      .catch(error => {
        return { "error": error, "status": false };
      });
  } catch (error) {
    return { "error": error, "status": false };
  }
}

const edit_user_negocio = async (edited_negocio) => {
  try{
    const url = import.meta.env.VITE_SERVER_ROUTE + '/negocios/edit';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
      body: edited_negocio ,
    }
    // Enviar la solicitud POST al servidor
    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok){
          // Si devuelve error 401 es que la sesion del usuario ha caducado entonces eliminamos cookies
          if(response.status === 401){
            // Array con los nombres de las cookies que deseas eliminar
            const cookiesToDelete = ['access_token', 'refresh_token', 'id', 'nombre', 'telefono', 'email', 'cuenta_bancaria', 'contraseña'];

            // Recorre el array y elimina cada cookie
            cookiesToDelete.forEach(cookieName => {
              Cookies.remove(cookieName);
            });
          }
          throw new Error(`Error de red: ${response.status}`)
        }

        return response.json()
      })
      .then(data => {
        console.log('Negocio editado correctamente');
        return { "message": "data.message" };
      })
      .catch(error => {
        console.error('Error en la solicitud:', error.message);
        return {"error": error.message}
      })

  } catch (error) {
    console.error('Error en la solicitud:', error.message);
    return { "error": 'Error en la solicitud' };
  }
}

const delete_user_negocio = async (negocio_id) => {
  try{

    const url = import.meta.env.VITE_SERVER_ROUTE + '/negocioos/delete/' + negocio_id;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
    }

    // Enviar la solicitud POST al servidor
    fetch(url, requestOptions )
      .then(response => {
        if (!response.ok){
          // Si devuelve error 401 es que la sesion del usuario ha caducado entonces eliminamos cookies
          if(response.status === 401){
            // Array con los nombres de las cookies que deseas eliminar
            const cookiesToDelete = ['access_token', 'refresh_token', 'id', 'nombre', 'telefono', 'email', 'cuenta_bancaria', 'contraseña'];

            // Recorre el array y elimina cada cookie
            cookiesToDelete.forEach(cookieName => {
              Cookies.remove(cookieName);
            });
          }
          throw new Error(`Error de red: ${response.status}`)
        }

        return response.json()
      })
      .then( data => {
        console.log('Negocio eliminardo correctamente');
        return { "message": data.message };
      })
      .catch( error =>{
        console.error('Error en la solicitud:', error);
        return { error: 'Error en la solicitud' };
      })

  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: 'Error en la solicitud' };
  }
}

const negocioService = {
  get_all_negocios,
  get_all_negocios_from_user,
  add_new_negocio,
  edit_user_negocio,
  delete_user_negocio,
};

export default negocioService;