import Slider from "react-slick";
import ServiceSlick from "./ServiceSlick";

export default function ServiceSlider() {
  let settings = {
    pauseOnHover: true,
    infinite: true,
    autoplay: true,
    cssEase: "linear",
    autoplaySpeed: 3000,
    speed: 10000,
    slidesToShow: 7,
    slidesToScroll: 7,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          autoplaySpeed: 2500,
          speed: 7000,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          autoplaySpeed: 2000,
          speed: 6000,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          autoplaySpeed: 1500,
          speed: 5000,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          autoplaySpeed: 1000,
          speed: 4000,
        },
      },
      {
        breakpoint: 480,

        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplaySpeed: 500,
          speed: 3000,
        },
      },
    ],
  };

  let services = [
    { name: "Restaurant", image: "./images/services/restaurant.png" },
    { name: "Hotel", image: "./images/services/hotel.png" },
    { name: "Sight seeing", image: "./images/services/sight_seeing.png" },
    { name: "Museum", image: "./images/services/museum.png" },
    {
      name: "Transport",
      image: "./images/services/public_transport.png",
    },
    {
      name: "Pharmacies",
      image: "./images/services/pharmacies.png",
    },
    {
      name: "ATM",
      image: "./images/services/ATM.png",
    },
    {
      name: "Super market",
      image: "./images/services/super_market.png",
    },
    {
      name: "Bank",
      image: "./images/services/bank.png",
    },
    {
      name: "Airport",
      image: "./images/services/airport.png",
    },
    {
      name: "Hospital",
      image: "./images/services/hospital.png",
    },
    {
      name: "School",
      image: "./images/services/school.png",
    },
  ];

  return (
    <Slider {...settings}>
      {services.map((service) => {
        return <ServiceSlick key={service.name} service={service} />;
      })}
    </Slider>
  );
}
