import Slider from 'react-slick'
import ServiceSlick from './ServiceSlick'

export default function ServiceSlider(): React.ReactNode {
  const settings = {
    pauseOnHover: true,
    infinite: true,
    autoplay: true,
    cssEase: 'linear',
    autoplaySpeed: 3000,
    speed: 1500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 922,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576,

        settings: {
          slidesToShow: 1
        }
      }
    ]
  }

  const services = [
    { name: 'Restaurant', image: './images/services/restaurant.png' },
    { name: 'Hotel', image: './images/services/hotel.png' },
    { name: 'Sight seeing', image: './images/services/sight_seeing.png' },
    { name: 'Museum', image: './images/services/museum.png' },
    {
      name: 'Transport',
      image: './images/services/public_transport.png'
    },
    {
      name: 'Pharmacies',
      image: './images/services/pharmacies.png'
    },
    {
      name: 'ATM',
      image: './images/services/ATM.png'
    },
    {
      name: 'Super market',
      image: './images/services/super_market.png'
    },
    {
      name: 'Bank',
      image: './images/services/bank.png'
    },
    {
      name: 'Airport',
      image: './images/services/airport.png'
    },
    {
      name: 'Hospital',
      image: './images/services/hospital.png'
    },
    {
      name: 'School',
      image: './images/services/school.png'
    }
  ]

  return (
    <Slider className='mt-5' {...settings}>
      {services.map((service) => {
        return <ServiceSlick key={service.name} service={service} />
      })}
    </Slider>
  )
}
