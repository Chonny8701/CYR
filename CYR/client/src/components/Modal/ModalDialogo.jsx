import React from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import '../../scss/components/Modal/ModalDialogo.scss'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const Modal = ({ isOpen, closeModal, actualizarInfoUsuarioServidor,actualizarOriginalPassword }) => {
  const handleModalContainerClick = (e) => e.stopPropagation();

  return (
    <article className={`modal ${isOpen ? 'is-open' : ''}`} onClick={closeModal}>
      <div className="modalDialogo-container" onClick={handleModalContainerClick}>
        <AiOutlineCloseCircle color="black" size={30} className="modal-close" onClick={closeModal} />
        <h4>Confirmar:</h4>
        <p>Desea guardar las modificaciones realizadas? Ingrese su contraseña original</p>

        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          <Form className="d-flex flex-column signup-formulario" >
            <Form.Group className="mb-3 flex-grow-1" controlId="password-usuario" style={{ width: "300px", textAlign:"left"}}>
                <Form.Control
                  onChange={actualizarOriginalPassword}
                  type="password"
                  placeholder="Ingrese su contraseña original"
                  // value={passwordUsuario}
                  required
                />
            </Form.Group>
          </Form>

          <div className="d-flex gap-4">
            <Button onClick={actualizarInfoUsuarioServidor} style={{ width: "100px" }}>
              Aceptar
            </Button>
            <Button onClick={closeModal} style={{ width: "100px" }}>
              Cancelar
            </Button>
          </div>

        </div>
      </div>
    </article>
  );
};

export default Modal;