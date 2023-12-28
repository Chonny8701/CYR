import React from 'react';
import '../../scss/components/Modal/Modal.scss'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const Modal = ({ children, isOpen, closeModal }) => {
  const handleModalContainerClick = (e) => e.stopPropagation();

  return (
    <article className={`modal ${isOpen ? 'is-open' : ''}`} onClick={closeModal}>
      <div className="modal-container" onClick={handleModalContainerClick}>
        <AiOutlineCloseCircle color="black" size={30} className="modal-close" onClick={closeModal} />
        {children}
      </div>
    </article>
  );
};

export default Modal;