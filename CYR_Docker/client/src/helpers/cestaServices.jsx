const get_all_products = async () => {
  try {
    // Construir la URL de la solicitud GET
    let url = import.meta.env.VITE_SERVER_ROUTE + '/cesta/usuario';

    // Realizar la solicitud POST al servidor con el access_token
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
    });

    if (!res.ok) {
      console.log(res.error);
      return {"status":res.status, "error": res.statusText,"data":[] }
    }

    // Analizar la respuesta del servidor en formato JSON
    const respuestaServidor = await res.json();

    // Comprobar que existan datos validos en data
    if (!respuestaServidor.data) {
      return {"status": res.status, "data":[]};
    }

    return {"status":res.status, "data": respuestaServidor.data};

  } catch (error) {
    return {"status": res.status, "error": error};
  }
}

const add_product_to_basketDB = async (new_product) => {
  try{
    // Enviar la solicitud POST al servidor
    const res = await fetch(import.meta.env.VITE_SERVER_ROUTE + '/cesta/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
      body: new_product ,
    });

    // Obtener datos del servidor en formato JSON
    const data = await res.json();

    // Comprobar si hubo errores en la peticion
    if (!res.ok) {
      return { "status": res.status, "error": res.statusText };

    // El producto fue agregado correctamente
    } else {
      return { "status": res.status, "message": data.message };
    }

  } catch (error) {
    return { "status": res.status, "error": res.statusText };
  }
}

const delete_product_from_basket = async (product_id) => {
  try{
    // Enviar la solicitud POST al servidor
    const res = await fetch(import.meta.env.VITE_SERVER_ROUTE + '/cesta/delete/' + product_id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
    });

    // Obtener datos del servidor en formato JSON
    const data = await res.json();

    // El producto no fue agregado correctamente
    if (!res.ok) {
      const errorMessage = data.error || 'Error al eliminar producto';
      return { error: errorMessage }; // Devuelve el mensaje de error como objeto

    // El producto fue eliminado correctamente
    } else {
      console.log('Producto eliminardo correctamente');
      return { message: data.message }; // Devuelve un mensaje de producto agregado correctamente
    }

  } catch (error) {
    console.error('Error en la solicitud:', error);
    return { error: 'Error en la solicitud' }; // Manejo de errores generales
  }
}

const cestaServices = {
  get_all_products,
  add_product_to_basketDB,
  delete_product_from_basket
};

export default cestaServices;