import Cookies from "js-cookie";
import authService from "../helpers/authService";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../images/logo.png'
import '../scss/components/Header.scss'

const Header = () => {

  const emailUsuario = Cookies.get("email")

  return (
    <Navbar expand="lg" className="barra-navegacion"  style={{backgroundColor: "#90b4ce", fontSize: "18px"}}>
      <Container>
        <Navbar.Brand href="/"><img src={logo} id="header-logo" className="img-fluid rounded-start logo-image" alt="Imagen del logo" width={"80px"} /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{color:"#094067"}}/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" >
            <Nav.Link href="/" style={{color:"#094067"}} >Home</Nav.Link>
            {emailUsuario ? (
              // Si el emailUsuario existe, mostrar el NavDropdown
              <NavDropdown title={emailUsuario} id="basic-nav-dropdown" style={{ color: "#094067 !important" }} >
                <NavDropdown.Item href="/usuario/cuenta" >Usuario</NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={authService.handleLogout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              // Si el emailUsuario no existe, mostrar el enlace de sesión
              <Nav.Link href="/login" style={{color:"#094067"}}>Sesión</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;