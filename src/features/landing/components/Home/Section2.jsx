import React from "react";
import backgroundImage from "../../assets/section2.png";

const KeyRouteApp = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center -mt-[200px] lg:mt-0 mb-0 md:mb-0">
      <img
        src={backgroundImage}
        alt="Background"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default KeyRouteApp;
