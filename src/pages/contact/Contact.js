import React, { useRef, useState } from 'react';
import styles from './Contact.module.css'
import { TfiLinkedin, TfiInstagram, TfiEmail } from "react-icons/tfi";
import { SlPhone } from "react-icons/sl";
import { BsGithub } from "react-icons/bs";
import useNetworkCall from '../../hooks/useNetworkCall';
import Modal from '../../components/modal/Modal';
import LoadingBar from 'react-top-loading-bar';
import useValidator from '../../hooks/useValidator';
import { useEffect } from 'react';


const Contact = () => {

    const [message, setMessage] = useState({ name: "", email: "", message: `` });
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        title: 'Error',
        okClick: () => setModal({ ...modal, visible: false }),
        closeModal: () => setModal({ ...modal, visible: false })
    });
    const [error, setError] = useState({ name: false, email: false, message: false })
    const fetchData = useNetworkCall();
    const { emailValidator, stringValidator } = useValidator();
    const barRef = useRef(null);
    const signalRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        signalRef.current = controller.signal;
        return () => controller.abort();
    }, [])


    const submit = (e) => {
        e.preventDefault();
        //To prevent the message with validation errors from sending to server and for user confirmation:
        if (error.name || error.email || error.message) {
            setModal({ ...modal, visible: true, message: "Please fill all the details correctly" })
        } else {
            setModal({ ...modal, visible: true, message: "Are you sure ?", title: 'Confirm !', okClick: sendMessage })
        }
    }

    const sendMessage = async () => {
        setModal({ ...modal, visible: false })
        barRef.current.continuousStart();
        const response = await fetchData('api/message', signalRef.current, 'POST', message);
        barRef.current.complete();
        if (!response.error) {
            setModal({ ...modal, visible: true, message: `Your message ${response.message.message} has been sent successfully.`, title: 'Success !' });
            setMessage({ name: "", email: "", message: `` });
        } else {
            setModal({ ...modal, visible: true, message: `Uh-Oh ${response.error}`, title: 'Error !' });
        }
    }


    return (
        <>
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <LoadingBar ref={barRef} color='rgb(220, 216, 216)' />
            <div className={styles.container}>
                <h1>Contact Me</h1>
                <div className={styles.formcontainer}>
                    <div className={styles.left}>
                        <h3><TfiEmail /></h3>
                        <p> shubhamsss8273@gmail.com</p>
                        <h3><br /><SlPhone /></h3>
                        <p>6397507590</p>
                        <div className={styles.icons}>
                            <a href='https://linkedin.com/in/shubham-sharma-58006717a' target='_blank' rel="noreferrer" ><TfiLinkedin /></a>
                            <a href='https://instagram.com/shubhamsss8273' target='_blank' rel="noreferrer" ><TfiInstagram /></a>
                            <a href='https://github.com/Shubhamsss8273' target='_blank' rel="noreferrer" ><BsGithub /></a>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <h2>Leave a message</h2>
                        <form onSubmit={submit}>
                            <input type='text' name='name' placeholder='Enter Your Name *'
                                onChange={(e) => {
                                    setMessage({ ...message, name: e.target.value });
                                    const nameError = stringValidator(e.target.value, 3);
                                    setError({ ...error, name: nameError })
                                }} autoComplete='name' required={true} value={message.name} minLength='3' />
                            <input type='email' name='email' placeholder='Enter your Email *' onChange={(e) => {
                                setMessage({ ...message, email: e.target.value });
                                const emailError = emailValidator(e.target.value);
                                setError({ ...error, email: emailError })
                            }} autoComplete='email' required={true} value={message.email} />
                            <textarea type='text' name='message' placeholder='Enter Your Message *' rows='3' cols='20' onChange={(e) => {
                                setMessage({ ...message, message: e.target.value });
                                const messageError = stringValidator(e.target.value, 5);
                                setError({ ...error, message: messageError })
                            }} required={true} minLength='5' value={message.message}></textarea><br />
                            <button type='submit' disabled={message.name && message.email && message.message ? false : true} >Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact
