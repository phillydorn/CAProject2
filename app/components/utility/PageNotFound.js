'use strict';

import React from 'react';

const PageNotFound = () => {
  return (
    <div className="pnf-container pnf-page search-page">
      <div className="header-section">
        <h1 className="main-header">The page you're looking was not found!</h1>
        <div className="pnf-image-container">
          <div className="pnf-image" />
          <div className="pnf-text">404</div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
