import {Carousel} from 'react-bootstrap';

function CarouselMain() {
  return (
    <>
      <div className="container" >
        <div className="">
          <div className="">
            <Carousel>
              <Carousel.Item interval={5000}>
                <img
                  className="d-block w-100 h-auto" 
                  src="/img/carousel_1.png"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={5000}>
                <img
                  className="d-block w-100 h-auto" 
                  src="/img/carousel_2.png"
                  alt="Second slide"
                />
              </Carousel.Item>
              <Carousel.Item interval={5000}>
                <img
                  className="d-block w-100 h-auto" 
                  src="/img/carousel_3.png"
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
