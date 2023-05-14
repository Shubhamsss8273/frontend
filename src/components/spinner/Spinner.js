import React from 'react';
import spinner from '../../images/spinner.gif';
import styles from './spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.spinnercontainer}>
      <div className={styles.spinner}>
        <img src={spinner} alt="Loading..." />
        <h1>Loading...</h1>
      </div>
    </div>
  )
}

export default Spinner;