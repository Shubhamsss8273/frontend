import React, { useEffect, useState } from 'react'
import styles from './viewnote.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import Modal from '../../components/modal/Modal';


const Viewnote = (props) => {

    const params = useParams();
    const notebooks = useSelector(state => state.notebooks.notebooks);
    const user = useSelector(state => state.user)
    const [note, setNote] = useState({});
    const navigate = useNavigate();
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        okClick: '',
        closeModal: () => setModal({ ...modal, visible: false }),
        title: 'Error'
    });
    const { state } = useLocation();


    useEffect(() => {
        if (!params.notebookId || !params.noteId) { return }
        if (!user.isLoggedin) {
            setModal({
                visible: true,
                message: 'You are not Loggedin. Please login and try again',
                okClick: () => navigate('/login'),
                closeModal: () => navigate('/'),
                title: 'Unauthorized'
            })
        } else if (notebooks.length !== 0) {
            setModal({ ...Modal, visible: false })
            const foundNotebook = notebooks.find(notebook => notebook._id === params.notebookId)
            if (!foundNotebook) {
                return setModal({
                    visible: true, message: 'The requested notebook was not found', okClick: () => navigate('/notebook'), closeModal: () => navigate('/userhome'), title: 'Error'
                })
            }
            const foundNote = foundNotebook.notes.find(item => item._id === params.noteId)
            if (!foundNote) {
                return setModal({
                    visible: true,
                    message: 'The requested note was not found',
                    okClick: () => navigate(`/notebook/${params.notebookId}`),
                    closeModal: () => navigate('/userhome'),
                    title: 'Error'
                })
            }
            setNote(foundNote)
        } else {
            setModal({
                visible: true,
                message: "You don't have any notebooks !",
                okClick: () => navigate('/notebook'),
                closeModal: () => navigate('/userhome'),
                title: 'Error'
            })
        }
    }, [notebooks, user])

    useEffect(() => {
        if (params.noteId || params.notebookId) { return }
        
        if (!user.user.isAdmin) {
            return setModal({
                visible: true,
                message: 'You are not an admin user. Access denied !',
                okClick: () => navigate('/userhome'),
                closeModal: () => navigate('/userhome'),
                title: 'Unauthorized'
            })
        } else {
            setModal({ ...modal, visible: false })
            setNote(state.message)
        }
    }, [user])

    const button1 = () => {
        if (!params.notebookId || !params.noteId) {
            navigate('/userhome');
        } else {
            navigate('/notebook')
        }
    }

    const button2 = () => {
        if (!params.notebookId || !params.noteId) {
            navigate('/messages');
        } else {
            navigate(`/notebook/${params.notebookId}`)
        }
    }

    return (
        <>
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <div className={styles.container}>
                <div className={styles.textcontainer}>
                    <div className={styles.title}>
                        <h1>{(!params.noteId || !params.notebookId) ? 'Name' : 'Title'}</h1>
                        <p>{(!params.noteId || !params.notebookId) ? note.name : note.title}</p>
                    </div>

                    <div className={styles.tags}>
                        <h1>{(!params.noteId || !params.notebookId) ? 'Email' : 'Tags'}</h1>
                        <p>{(!params.noteId || !params.notebookId) ? note.email : note.tags}</p>
                    </div>

                    <div className={styles.description}>
                        <h1>{(!params.noteId || !params.notebookId) ? 'Message' : 'Description'}</h1>
                        <p>{(!params.noteId || !params.notebookId) ? note.message : note.description}</p>
                    </div>
                    <button type='button' onClick={button1}>{(!params.noteId || !params.notebookId) ? 'Back to Home' : 'Back to Books'}</button>
                    <button type='button' onClick={button2}>{(!params.noteId || !params.notebookId) ? 'Back to Messages' : 'Back to Notes'}</button>
                </div>
            </div>
        </>
    )
}

export default Viewnote