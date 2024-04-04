import React from 'react';
import styles from './clientConnected.module.css';


const ClientConnected = ({children}) => (
  <div className={styles.ClientConnected}>
    {children}
  </div>
);

ClientConnected.propTypes = {};

ClientConnected.defaultProps = {};

export default ClientConnected;
