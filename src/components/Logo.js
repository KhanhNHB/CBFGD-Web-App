import React from 'react';

const Logo = (props) => {
  return (
    <img
      alt="GDS"
      style={{height:60, width: 60}}
      src={require("../images/logo_gds.png")}
      {...props}
    />
  );
};

export default Logo;
