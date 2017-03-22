import React, { PropTypes } from 'react';
import Spinner from './Spinner';

const ModalOverlay = (props) => {
  const isActive = props.active ? 'active' : '';
  const spinner = props.spinner ? <Spinner /> : '';

  return (


    <div id="modal-overlay" className={isActive}>
      {spinner}
    </div>
  );
};

ModalOverlay.propTypes = {
  active: PropTypes.bool,
  spinner: PropTypes.bool,
};

export default ModalOverlay;
