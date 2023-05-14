import React, { useEffect, useRef, useState } from 'react';
import Notebookandnote from '../../components/notebookandnote/Notebookandnote';
import { useDispatch, useSelector } from 'react-redux';
import useNetworkCall from '../../hooks/useNetworkCall';
import { fetchNotebooks, createNotebook, editNotebook, deleteNotebook } from '../../features/notebooks/notebookSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Modal from '../../components/modal/Modal';


const Notebooks = () => {
    const notebooks = useSelector(state => state.notebooks.notebooks);
    const user = useSelector(state => state.user)
    const dispatch = useDispatch();
    const fetchData = useNetworkCall();
    const navigate = useNavigate();
    const params = useParams();
    const barRef = useRef(null);
    const { state } = useLocation();
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        okClick: '',
        closeModal: () => setModal({ ...modal, visible: false }),
        title: 'Error'
    });
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
        } else if (!params.userId) {
            setModal({ ...modal, visible: false })
            const notebookData = async () => {
                const response = await fetchData('api/notebook/fetchnotebook', signalRef.current);
                if (!response.error) {
                    dispatch(fetchNotebooks(response.notebooks))

                } else {
                    setModal({ ...modal, visible: true, message: response.error, okClick: modal.closeModal })
                }
            }
            notebookData();
        } else if (params.userId && !user.user.isAdmin) {
            setModal({
                visible: true,
                message: 'You are not an admin user. Access denied !',
                okClick: () => navigate('/userhome'),
                closeModal: () => navigate('/userhome'),
                title: 'Unauthorized'
            })
        } else {
            const notebookData = async () => {
                const response = await fetchData(`api/admin/fetchnotebook/${params.userId}`, signalRef.current);
                if (!response.error) {
                    dispatch(fetchNotebooks(response.notebooks))
                } else {
                    setModal({ ...modal, visible: true, message: response.error, okClick: modal.closeModal })
                }
            }
            notebookData();
        }
    }, [user])

    const addNotebook = async (title) => {
        if (params.userId) {
            barRef.current.continuousStart();
            const response = await fetchData(`api/admin/addnotebook/${params.userId}`, signalRef.current, 'POST', { title: title })
            barRef.current.complete();
            if (response.error) {
                return setModal({ ...modal, visible: true, message: response.error, okClick: modal.closeModal })
            }
            dispatch(createNotebook(response.notebook))
        } else {
            barRef.current.continuousStart();
            const response = await fetchData('api/notebook/addnotebook', signalRef.current, 'POST', { title: title })
            barRef.current.complete();
            if (response.error) {
                return setModal({ ...modal, visible: true, message: response.error, okClick: modal.closeModal })
            }
            dispatch(createNotebook(response.notebook))
        }
    }

    const viewNotebook = (id) => {
        navigate(`/notebook/${id}`)
    }

    const deleteHandler = (id) => {
        setModal({
            ...modal,
            visible: true,
            title: 'Confirmation!',
            message: 'Are you sure you want to delete this notebook ?',
            okClick: () => deleteTheNotebook(id)
        })
    }

    const deleteTheNotebook = async (id) => {
        setModal({ ...modal, visible: false })
        barRef.current.continuousStart();
        const response = await fetchData(`api/notebook/deletenotebook/${id}`, signalRef.current, 'DELETE')
        barRef.current.complete();
        if (!response.error) {
            dispatch(deleteNotebook(id))
        } else {
            setModal({ ...modal, visible: true, message: response.error, okClick: modal.closeModal })
        }
    }

    const updateNotebook = async (id, title) => {
        barRef.current.continuousStart();
        const response = await fetchData(`api/notebook/updatenotebook/${id}`, signalRef.current, 'PUT', { title: title });
        barRef.current.complete();
        if (!response.error) {
            dispatch(editNotebook({ id: response.notebook._id, title: response.notebook.title }))
        } else {
            setModal({ ...modal, visible: true, message: response.error, okClick: modal.closeModal })
        }
    }

    return (
        <>
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <LoadingBar ref={barRef} color='rgb(220, 216, 216)' />
            {user.user && <Notebookandnote items={notebooks} noteComponent={false} viewItem={viewNotebook} addNotebook={addNotebook} editItem={updateNotebook} deleteItem={deleteHandler} pageTitle={(params.userId ? `${state.firstName.charAt(0).toUpperCase() + state.firstName.slice(1)}` : `${user.user.firstName.charAt(0).toUpperCase() + user.user.firstName.slice(1)}`) + "'s Notebooks"} />}
        </>
    )
}

export default Notebooks;