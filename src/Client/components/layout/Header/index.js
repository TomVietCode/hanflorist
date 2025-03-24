import { FaPhoneVolume } from "react-icons/fa6";
// import { IoIosArrowDown } from "react-icons/io";
import NavDropdown from "react-bootstrap/NavDropdown";

import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

function Header() {
  return (
    <>
      <div className="fixed-header bg-dark text-light">
        <Container>
          <Row>
            <Col className="text-center" >
              <p style={{color: 'white', fontSize: 20}}>Chào mừng bạn đến với Han Florist</p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Header;
