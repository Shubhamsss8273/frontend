import React from 'react';
import styles from './List.module.css';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';

const List = ({ id, name, email, description, date, editItem, deleteItem, view, viewButton, editIcon }) => {

    return (
        <div className={styles.listcontainer}>
            <div className={styles.listItem}>
                <p>{name}</p>
            </div>

            <div className={styles.listItem}>
                <p>{email}</p>
            </div>

            <div className={styles.listItem}>
                <p>{description}</p>
            </div>

            <div className={styles.listItem}>
                <p>{date}</p>
            </div>
            <div className={styles.options}>
                <div className={styles.button}>
                    <button type='button' onClick={() => view(id)}>{viewButton}</button>
                </div>
                <div className={styles.iconcontainer}>
                    {editIcon && <span className={styles.icon} onClick={() => editItem(id)}><FiEdit style={{ verticalAlign: 'bottom' }} size={'1.3em'} /></span>}
                    <span className={styles.icon} onClick={() => deleteItem(id)}><RiDeleteBin5Line style={{ verticalAlign: 'bottom' }} size={'1.3em'} /></span>
                </div>
            </div>
        </div>
    )
}

export default List