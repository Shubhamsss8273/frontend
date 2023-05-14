import React, { useEffect, useRef, useState } from 'react';
import styles from './Userlist.module.css';
import useNetworkCall from '../../hooks/useNetworkCall';
import List from '../../components/list/List';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/modal/Modal';
import LoadingBar from 'react-top-loading-bar';
import { useSelector } from 'react-redux';

const Userlist = () => {

    const fetchData = useNetworkCall();
    const [users, setUsers] = useState({ users: [], totalNotebooks: 0 });
    const navigate = useNavigate();
    const user = useSelector(state => state.user)
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        okClick: '',
        closeModal: () => setModal({ ...modal, visible: false }),
        title: 'Error'
    });
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
            const fetchUsers = async () => {
                const response = await fetchData('api/admin/fetchusers', signalRef.current);
                if (response.error) {
                    return setModal({ ...modal, visible: true, message: response.error, okClick: () => navigate('/userhome'), closeModal: () => navigate('/userhome') })
                }
                setUsers({ users: response.users, totalNotebooks: response.totalNotebooks })
            }
            fetchUsers();
            barRef.current.complete();
        }
    }, [user])

    const viewBooks = (userId) => {
        navigate(`/users/${userId}`, { state: { firstName: users.users.find(user => user._id === userId).firstName } })
    }

    const deleteHandler = (id) => {
        setModal({ visible: true, title: 'Confirm', message: 'Are you sure ?', okClick: () => deleteUser(id), closeModal: () => setModal({ ...modal, visible: false }) })
    }

    const deleteUser = async (id) => {
        setModal({ ...modal, visible: false })
        barRef.current.continuousStart();
        const response = await fetchData(`api/admin/deleteuser/${id}`, signalRef.current, 'DELETE');
        barRef.current.complete();
        if (response.error) {
            return setModal({ ...modal, visible: true, message: response.error, okClick: () => setModal({ ...modal, visible: false }), closeModal: () => navigate('/userhome') })
        }
        const filteredUsers = users.users.filter(user => user._id !== id);
        setUsers(({ ...users, users: filteredUsers, totalNotebooks: response.totalNotebooks }))
    }

    const editUser = async (id) => {
        const foundUser = users.users.find(user => user._id === id)
        navigate(`/updateuser/${id}`, { state: { user: foundUser } })
    }

    return (
        <>
            <LoadingBar ref={barRef} color='rgb(220, 216, 216)' />
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <div className={styles.userListContainer}>
                <h1>Total Users - {users.users.length}, Total notebooks - {users.totalNotebooks}</h1>
                {users.users.map(user => <List key={user._id} id={user._id} name={`${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`} email={user.email} description={user.gender} date={new Date(user.created).toLocaleDateString()} viewButton={'Books'} view={viewBooks} editIcon={true} editItem={editUser} deleteItem={deleteHandler} />)}
            </div>
        </>
    )
}

export default Userlist