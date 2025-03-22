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
            <Col className="text-center">
              <p>
                <FaPhoneVolume />   Hotline: 012.345.6789
              </p>
            </Col>
            <Col className="text-center" xs={8}>
              <p>Chào mừng bạn đến với Han Florist</p>
            </Col>
            <Col className="text-center">
              <NavDropdown title="Settings">
                <NavDropdown.Item href="#action/3.1">
                  Action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
              </NavDropdown>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Header;
