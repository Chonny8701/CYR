import React from 'react';
import '../scss/components/Footer.scss'
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaGithub, FaLinkedin  } from 'react-icons/fa';
import imagenFooter from "../images/wave.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer-container bg-body-tertiary" style={{backgroundImage: `url(${imagenFooter.toString()})`}}>
      <p><b>Contacto:</b></p>
      <footer className="footer">
        <div className="footer-item">
          <FaMapMarkerAlt className="footer-icon" />
          <div className="footer-data">
            <p><b>Francesc Macia 08402 Barcelona</b></p>
          </div>
        </div>
        <div className="footer-item">
          <FaEnvelope className="footer-icon" />
          <div className="footer-data">
            <p><b>pirolsaens@yahoo.es</b></p>
          </div>
        </div>
        <div className="footer-item">
          <FaPhone className="footer-icon" />
          <div className="footer-data">
            <p><b>+34 698 245 390</b></p>
          </div>
        </div>
      </footer>
      <div className="follow-us">
          <p><b>Sígueme:</b></p>
          <div className="social-icons">
            <a href="https://github.com/Chonny8701" target="_blank" rel="noopener noreferrer"><FaGithub className="footer-icon" /></a>
            <a href="https://www.linkedin.com/in/jos%C3%A9-daniel-rodr%C3%ADguez-chong-077485161/" target="_blank" rel="noopener noreferrer"><FaLinkedin className="footer-icon" /></a>
          </div>
        </div>
      <div className="copyrights">
        <p><b>&copy; {currentYear} Todos los derechos reservados.</b></p>
      </div>
    </div>
  );
};

export default Footer;
