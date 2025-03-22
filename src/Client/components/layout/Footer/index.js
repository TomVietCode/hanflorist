import { Container, Row, Col } from "react-bootstrap";
import { FaLocationDot, FaFacebook, FaInstagram } from "react-icons/fa6";
import { FaPhoneSquareAlt } from "react-icons/fa";


function Footer() {
  return (
    <>
      <footer className="fixed-footer bg-dark text-light py-3 mt-7">
        <Container className="p-1 container-fluid mt-5">
          <Row>
            <Col md={3} className="mb-4">
              <a href="/" style={{color: 'white'}} className="text-decoration-none"><h5 className="fw-bold mb-3 ">HAN FLORIST</h5></a>
              <p className="mb-3">
                Tất cả hình ảnh sản phẩm sử dụng trên Website đều do team Han
                thực hiện và chụp hình, vậy nên quý khách có thể yên tâm về chất
                lượng sản phẩm và kỹ năng của Florist.
              </p>
              <a href="https://www.facebook.com/" className="p-2 mt-2"><FaFacebook size={30} color="#1877F2"/></a>
              <a href="https://www.instagram.com/" className="p-2 mt-2"><FaInstagram size={30} color="#E4405F"/></a>
            </Col>

            <Col md={3} className="mb-4">
              <h5 className="fw-bold mb-3">Services</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">Wishlist</li>
                <li className="mb-2">
                  Hướng dẫn đặt hàng và phương thức thanh toán
                </li>
                <li className="mb-2">Chính sách giao hàng</li>
              </ul>
            </Col>

            <Col md={3} className="mb-4">
              <h5 className="fw-bold mb-3">Company</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">Home</li>
                <li className="mb-2">About us</li>
                <li className="mb-2">Blog</li>
              </ul>
            </Col>

            <Col md={3} className="mb-4">
              <h5 className="fw-bold mb-3">Contact</h5>
              <p className="mb-2">
              <FaLocationDot size={30} style={{marginRight: '14px'}}/><strong>Đại học Phenikaa</strong>
              </p>
              <div className="d-flex align-items-center">
                <div style={{marginRight: '14px'}}><FaPhoneSquareAlt size={30}/></div>
                <div>
                <p className="mb-0"><strong>012.3456.789</strong></p>
                <p className="mb-0"><strong>Mon - Sun: 00:00 AM - 23:59 PM   </strong></p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
