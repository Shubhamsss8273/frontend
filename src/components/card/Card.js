import React from 'react'
import styles from './card.module.css'
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Tippy from '@tippyjs/react';

const Card = ({ id, title, description, date, viewItem, editItem, deleteItem }) => {
    return (
        <div className={styles.card}>
            <h3 className={styles.cardtitle}>{title}</h3>
            <p className={styles.cardtag}>{description}</p>
            <p className={styles.carddate}>{date}</p>
            <div className={styles.iconcontainer}>
                <button onClick={() => viewItem(id)}>View</button>
                <div>
                    <Tippy content='Edit' theme='mywebsite' >
                        <span onClick={() => editItem(id)}><FiEdit size={'1.1rem'} /></span></Tippy>
                    <Tippy content='Delete' theme='mywebsite'>
                        <span onClick={() => deleteItem(id)}><RiDeleteBin5Line size={'1.1rem'} /></span></Tippy>
                </div>
            </div>
        </div >
    )
}

export default Card;
