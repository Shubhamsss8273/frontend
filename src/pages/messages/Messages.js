import React, { useEffect, useRef, useState } from 'react';
import styles from './Messages.module.css';
import useNetworkCall from '../../hooks/useNetworkCall';
import List from '../../components/list/List';
import Modal from '../../components/modal/Modal';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { useSelector } from 'react-redux';

const Messages = () => {

    const [messages, setMessages] = useState([]);
    const fetchData = useNetworkCall();
    const user = useSelector(state => state.user);
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        okClick: '',
        closeModal: () => setModal({ ...modal, visible: false }),
        title: 'Error'
    });
    const navigate = useNavigate();
    const barRef = useRef(null);
    const signalRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        signalRef.current = controller.signal;
        return () => controller.abort();
    }, [])

    useEffect(() => {
        if (!user.isLoggedin) {
            setModal({
                visible: true,
                message: 'You are not Loggedin. Please login and try again',
                okClick: () => navigate('/login'),
                closeModal: () => navigate('/'),
                title: 'Unauthorized'
            })
        } else if (!user.user.isAdmin) {
            setModal({
                visible: true,
                message: 'You are not an admin user. Access denied !',
                okClick: () => navigate('/userhome'),
                closeModal: () => navigate('/userhome'),
                title: 'Unauthorized'
            })
        } else {
            setModal({ ...modal, visible: false })
            barRef.current.continuousStart();
            const fetchMessages = async () => {
                const response = await fetchData('api/message/fetchmessages', signalRef.current);
                setMessages(response.message)
            }
            fetchMessages();
            barRef.current.complete();
        }
    }, [user])

    const deleteItem = async (id) => {
        barRef.current.continuousStart();
        const response = await fetchData(`api/message/deletemessage/${id}`, signalRef.current, 'DELETE')
        barRef.current.complete();
        if (response.error) {
            return setModal({
                ...modal,
                visible: true,
                message: response.error,
                okClick: () => setModal({ ...modal, visible: false }),
                closeModal: () => navigate('/userhome')
            })
        }
        setMessages(messages.filter(message => message._id !== id))
    }

    const viewMessage = (id) => {
        const foundMessage = messages.find(message => message._id === id)
        navigate('/viewmessage', { state: { message: foundMessage } })
    }

    return (
        <>
            <LoadingBar ref={barRef} color='rgb(220, 216, 216)' />
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <div className={styles.messageListContainer}>
                <h1>Total Messages - {messages.length}</h1>
                {messages.map(message => <List key={message._id} id={message._id} name={message.name.charAt(0).toUpperCase() + message.name.slice(1)} email={message.email} description={message.message.slice(0, 30)} date={new Date(message.date).toLocaleDateString()} editIcon={false} viewButton='View' deleteItem={deleteItem} view={viewMessage} />)}
            </div>
        </>
    )
}

export default Messages