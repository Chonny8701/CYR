import React from 'react';
import Button from "react-bootstrap/Button";
import '../../scss/components/Modal/Modal.scss'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const ModalMessage = ({ isOpen, closeModal, headerMessage, contentMessage }) => {
  const handleModalContainerClick = (e) => e.stopPropagation();

  return (
    <article className={`modal ${isOpen ? 'is-open' : ''}`} onClick={closeModal}>
      <div className="modal-container" onClick={handleModalContainerClick}>
        <AiOutlineCloseCircle color="black" size={30} className="modal-close" onClick={closeModal} />
        <h4>{headerMessage}</h4>
        <p>{contentMessage}</p>
        <Button onClick={closeModal}>Cerrar</Button>
      </div>
    </article>
  );
};

export default ModalMessage;