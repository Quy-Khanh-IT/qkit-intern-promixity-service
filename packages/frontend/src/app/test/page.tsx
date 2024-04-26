"use client";

import Slider from "react-slick";
import ServiceSlick from "@/app/components/ServiceSlick";

export default function TestPage() {
  let settings = {
    infinite: true,
    autoplay: true,
    cssEase: "linear",
    autoplaySpeed: 3000,
    speed: 8000,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page for the application.</p>
      <div style={{ color: "white !important" }}>
        <Slider {...settings}>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
          <ServiceSlick></ServiceSlick>
        </Slider>
      </div>
    </div>
  );
}
