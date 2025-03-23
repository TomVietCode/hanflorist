import {Carousel} from 'react-bootstrap';
import imgCarousel1 from "../../assets/carousel_1.png";
import imgCarousel2 from "../../assets/carousel_2.png";
import imgCarousel3 from "../../assets/carousel_3.png";

function CarouselMain() {
  return (
    <>
      <div className="container" style={{paddingTop: 80}}>
        <div className="">
          <div className="">
            <Carousel>
              <Carousel.Item interval={5000}>
                <img
                  className="d-block w-100 h-auto" 
                  src={imgCarousel1}
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={5000}>
                <img
                  className="d-block w-100 h-auto" 
                  src={imgCarousel2}
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={5000}>
                <img
                  className="d-block w-100 h-auto" 
                  src={imgCarousel3}
                  alt="Third slide"
                />
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}

export default CarouselMain;
