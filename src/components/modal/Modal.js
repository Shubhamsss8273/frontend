import React from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.css';

const Modal = (props) => {

    const { closeModal, title, message, okClick } = props;

    return ReactDOM.createPortal(
        (<div className={styles.modalcontainer} onClick={closeModal}>
            <div className={styles.modalcontent}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }} >
                <h1>{title}</h1>
                <p>{message}</p>
                <div className={styles.buttoncontainer}>
                <button className={styles.button} onClick={okClick}>OK</button>
                <button className={styles.button} onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>),
        document.body
    )
}

export default Modal
