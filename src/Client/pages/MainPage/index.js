import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.css";
import CarouselMain from "../../components/layout/Carousel";
import MainContent from "../../components/MainContent";

function MainPage() {
  return (
    <>
      <div>
        <CarouselMain />
        <MainContent/>
      </div>
    </>
  );
}

export default MainPage;
