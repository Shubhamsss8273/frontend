import React from 'react';
import styles from './Error.module.css';
import { useNavigate } from 'react-router-dom';

const Error = () => {

    const navigate = useNavigate();
    return (
        <div className={styles.error}>
            <div className={styles.errormessage}>
                <h1>Uh-Oh ! This page does not exist.</h1>
                <button onClick={() => navigate('/')}>Home Page</button>
            </div>
        </div>
    )
}

export default Error