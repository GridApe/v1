import Image from 'next/image';
import React from 'react';

const Rocket = () => {
  return (
    <>
      <Image
        src="/rocket.svg"
        alt="rocket"
        width={50}
        height={50}
        className="absolute top-16 right-44"
      />
      <Image
        src="/rocket.svg"
        alt="rocket"
        width={24}
        height={24}
        className="absolute top-5 right-40"
      />
      <Image
        src="/rocket.svg"
        alt="rocket"
        width={24}
        height={24}
        className="absolute top-20 right-28"
      />
    </>
  );
};

export default Rocket;
