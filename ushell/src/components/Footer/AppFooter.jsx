import React from "react";

import { BackTop } from "antd";

const AppFooter = () => {
  return (
    <div className="container-fluid">
      <div className="footer">
        <div className="logo">
          <i className="fa-brands fa-uniregistry"></i>
          Shell
        </div>
        <div className="copyright">Copyright &copy; 2022</div>
        <BackTop>
          <div className="goTop">
            <i className="fas fa-arrow-circle-up"></i>
          </div>
        </BackTop>
      </div>
    </div>
  );
};

export default AppFooter;
