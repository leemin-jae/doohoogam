import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";
import { v4 } from "uuid";
import Image from "next/image";
import defaultDog from "../../public/icons/defaultDog.svg";
import styles from "./DogProfile.module.scss";

// import SimpleSlider from "./Carousel";

function DogProfile() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const Dogs = [
    {
      name: "뭉크",
      gender: "남",
      birth: "2016년 4월 3일",
      character: "온순"
    },
    {
      name: "동띵이",
      gender: "남",
      birth: "1997년 4월 8일",
      character: "말이 많고 귀여움"
    },
    {
      name: "햄솜",
      gender: "남",
      birth: "1996년 12월 25일",
      character: "말이 별로 업쑴"
    }
  ];
  return (
    <div>
      <Slider {...settings}>
        {Dogs.map((dog) => {
          return (
            <div key={v4()} className={`${styles.dogProfileBox}`}>
              <div className={`${styles.profileBox}`}>
                <div className={`${styles.imgBox}`}>
                  <div className={`${styles.dogImg}`}>
                    <Image src={defaultDog} />
                  </div>
                </div>
                <div className={`${styles.dogName}`}>{dog.name}</div>
              </div>
              <div className={`${styles.dogTextBox}`}>
                <p className={`${styles.dogTextBox}`}>안녕</p>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default DogProfile;
