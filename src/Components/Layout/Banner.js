import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import banner1 from '../../assests/banner/202406_banner_1.jpg';
import banner2 from '../../assests/banner/202406_banner_2.jpg';

function Banner() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img src= {banner1} className="d-block w-100" alt='first banner' thumbnail/>
        <Carousel.Caption>
          {/* <h3></h3>
          <p></p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src= {banner2} className="d-block w-100" alt='second banner' thumbnail/>
        <Carousel.Caption>
          {/* <h3></h3>
          <p></p> */}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Banner;