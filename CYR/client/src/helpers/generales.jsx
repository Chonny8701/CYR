

class MiErrorPersonalizado extends Error {
  constructor(message) {
    super(message);
    this.name = "MiErrorPersonalizado";
  }
}

const resumirTexto = (texto) => {
  // Verificar si el texto es más largo que 50 caracteres
  if (texto.length > 100) {
    // Si es más largo, acortarlo a 50 caracteres y agregar "..."
    const textoRecortado = texto.slice(0, 100) + '...';
    return textoRecortado;

  } else {
    // Si no es más largo, mostrar el texto completo
    return texto;
  }
};

const generarFechasConIntervaloTiempo = (dia, horaInicio, horaFin, intervalo) => {
  const fechas = [];
  let fechaNueva = new Date(`${dia}T${horaInicio}`);
  const fechaFinObj = new Date(`${dia}T${horaFin}`);

  fechas.push(new Date(fechaNueva));

  while (fechaNueva <= fechaFinObj) {
    fechaNueva.setHours(fechaNueva.getHours() + intervalo.getHours());
    fechaNueva.setMinutes(fechaNueva.getMinutes() + intervalo.getMinutes());

    fechas.push(new Date(fechaNueva));
  }

  return fechas;
};

export { MiErrorPersonalizado, resumirTexto, generarFechasConIntervaloTiempo};