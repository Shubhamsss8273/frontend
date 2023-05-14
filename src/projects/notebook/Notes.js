import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Notebookandnote from '../../components/notebookandnote/Notebookandnote';
import useNetworkCall from '../../hooks/useNetworkCall';
import { deleteNote } from '../../features/notebooks/notebookSlice';
import LoadingBar from 'react-top-loading-bar'
import Modal from '../../components/modal/Modal';


const Notes = () => {
    const params = useParams();
    const notebookId = params.notebookId;
    const notebooks = useSelector(state => state.notebooks.notebooks);
    const user = useSelector(state => state.user)
    const [notebook, setNotebook] = useState({})
    const fetchData = useNetworkCall();
    const dispatch = useDispatch();
    const barRef = useRef(null);
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        okClick: '',
        closeModal: () => setModal({ ...modal, visible: false }),
        title: 'Error'
    });
    const navigate = useNavigate();
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
        } else if (notebooks.length !== 0) {
            setModal({ ...modal, visible: false })
            const foundNotebook = notebooks.find(value => value._id === notebookId)
            if (!foundNotebook) {
                return setModal({
                    visible: true,
                    message: 'The requested Notebook was not found',
                    okClick: () => navigate('/notebook'),
                    closeModal: () => navigate('/userhome'),
                    title: 'Error'
                })
            }
            setNotebook(foundNotebook)

        } else {
            setModal({
                visible: true,
                message: "You don't have any notebooks !",
                okClick: () => navigate('/notebook'),
                closeModal: () => navigate('/userhome'),
                title: 'Error'
            })
        }
    }, [notebooks, user.isLoggedin])


    const viewNote = (id) => {
        navigate(`/${notebookId}/viewnote/${id}`)
    }

    const deleteHandler = (id) => {
        setModal({
            ...modal,
            visible: true,
            title: 'Confirmation!',
            message: 'Are you sure you want to delete this note ?',
            okClick: () => deleteNoteHandler(id)
        })
    }

    const deleteNoteHandler = async (id) => {
        try {
            setModal({ ...modal, visible: false })
            barRef.current.continuousStart();
            const response = await fetchData(`api/notebook/${notebookId}/deletenote/${id}`, signalRef.current, 'DELETE');
            barRef.current.complete();
            if (!response.error) {
                dispatch(deleteNote({ notebookId: notebook._id, noteId: id }));
                setNotebook(notebook);
            } else {
                setModal({ ...modal, visible: true, message: response.error, okClick: modal.closeModal })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <LoadingBar ref={barRef} color='rgb(220, 216, 216)' />
            <Notebookandnote items={notebook.notes} viewItem={viewNote} noteComponent={true} deleteItem={deleteHandler} pageTitle={notebook.title} />
        </>
    )
}

export default Notes;