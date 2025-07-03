import React from "react";
import img1 from "../assets/kidt-shirt1.jpg";
import img2 from "../assets/kidswear1.jpg";
import img3 from "../assets/pantman1.jpg";
import img4 from "../assets/manlower1.jpg";

const Background = ({ heroCount }) => {
  if (heroCount === 0) {
    return (
      <img
        src={img1}
        alt="img1"
        className="h-[100%] w-[100%] float-left overflow-auto object-cover"
      />
    );
  } else if (heroCount === 1) {
    return (
      <img
        src={img2}
        alt="img2"
        className="h-[100%] w-[100%] float-left overflow-auto object-cover"
      />
    );
  } else if (heroCount === 2) {
    return (
      <img
        src={img3}
        alt="img3"
        className="h-[100%] w-[100%] float-left overflow-auto object-cover"
      />
    );
  } else if (heroCount === 3) {
    return (
      <img
        src={img4}
        alt="img4"
        className="h-[100%] w-[100%] float-left overflow-auto object-cover"
      />
    );
  }
};

export default Background;
