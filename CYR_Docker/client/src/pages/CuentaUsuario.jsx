import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import AgregarNegocio from "../components/AgregarNegocio";
import Negocios from "../components/Negocios";
import Configuracion from "../components/Configuracion";

import Button from "react-bootstrap/Button";
import { FiSettings } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { BiBuildingHouse } from "react-icons/bi";
import Row from "react-bootstrap/Row";

import "../scss/pages/CuentaUsuario.scss";

const CuentaUsuario = () => {
  const [visualizar, setVisualizar] = useState("Mostrar Negocios");
  const mostrarAjustes = () => {
    setVisualizar("Mostrar Ajustes");
  };

  const añadirNegocio = () => {
    setVisualizar("Agregar Negocio");
  };

  const mostrarNegocios = () => {
    setVisualizar("Mostrar Negocios");
  };

  useEffect(() => {
    // Verificar token de autenticacion. Si no es válido redireccionar a /login
    const url = import.meta.env.VITE_SERVER_ROUTE + "/usuarios/cuenta";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${document.cookie.replace(
          /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        )}`,
      },
    };

    fetch(url, requestOptions).then((response) => {
      if (!response.ok) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("id");
        Cookies.remove("nombre");
        Cookies.remove("telefono");
        Cookies.remove("email");
        Cookies.remove("contraseña");
        Cookies.remove("cuenta_bancaria");
        window.location.href = "/login";
      }
    });
  }, []);

  return (
    <div>
      <Row
        className="container d-flex justify-content-center"
        style={{ marginBottom: "20px" }}
      >
        <div>
          <p style={{ fontSize: "26px" }}>
            Bienvenido <b>{Cookies.get("nombre")}</b>
          </p>
        </div>

        <div className="d-flex justify-content-center align-items-center gap-2">
          <Button
            variant="secondary"
            className={`button-menu d-flex justify-content-start align-items-center ${
              visualizar === "Mostrar Negocios" ? "custom-active" : ""
            }`}
            onClick={mostrarNegocios}
          >
            <BsBoxSeam style={{ marginRight: "10px" }} />{" "}
            {/* Utiliza FiSettings como un componente independiente */}
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                margin: "0",
                padding: "0",
              }}
            >
              Mis negocios
            </p>
          </Button>

          <Button
            variant="secondary"
            className={`button-menu d-flex justify-content-start align-items-center ${
              visualizar === "Agregar Negocio" ? "custom-active" : ""
            }`}
            onClick={añadirNegocio}
          >
            <BiBuildingHouse style={{ marginRight: "10px" }} />{" "}
            {/* Utiliza FiSettings como un componente independiente */}
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                margin: "0",
                padding: "0",
              }}
            >
              Añadir negocio
            </p>
          </Button>

          <Button
            variant="secondary"
            className={`button-menu d-flex justify-content-start align-items-center ${
              visualizar === "Mostrar Ajustes" ? "custom-active" : ""
            }`}
            onClick={mostrarAjustes}
          >
            <FiSettings style={{ marginRight: "10px" }} />{" "}
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                margin: "0",
                padding: "0",
              }}
            >
              Ajustes de perfil
            </p>
          </Button>
        </div>
      </Row>
      <Row className="container d-flex justify-content-center">
        <main className="contenedor-contenido d-flex flex-column justify-content-center align-items-center">
          {/* Declaración condicional para mostrar el componente correcto */}
          {visualizar === "Mostrar Ajustes" && <Configuracion />}
          {visualizar === "Agregar Negocio" && <AgregarNegocio />}
          {visualizar === "Mostrar Negocios" && <Negocios filtro="usuario" />}
        </main>
      </Row>
    </div>
  );
};

export default CuentaUsuario;
