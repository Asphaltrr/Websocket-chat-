import React from 'react';
import PropTypes from 'prop-types';
import styles from './welcome.module.css';

const Welcome = () => (
  <div className={styles.Welcome}>
    Welcome Component
  </div>
);

Welcome.propTypes = {};

Welcome.defaultProps = {};

export default Welcome;
