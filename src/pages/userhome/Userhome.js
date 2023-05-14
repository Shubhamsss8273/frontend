import React, { useRef, useState, useEffect } from 'react';
import styles from './userhome.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosLogOut } from 'react-icons/io';
import { FiEdit2, FiMessageSquare } from 'react-icons/fi';
import { GiNotebook } from 'react-icons/gi';
import { FaUsers } from 'react-icons/fa';
import { CgPassword } from 'react-icons/cg';
import useNetworkCall from '../../hooks/useNetworkCall';
import Modal from '../../components/modal/Modal';
import { logoutUser } from '../../features/user/userSlice';
import LoadingBar from 'react-top-loading-bar'


const Userhome = () => {
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const fetchData = useNetworkCall();
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        okClick: '',
        closeModal: () => setModal({ ...modal, visible: false }),
        title: 'Error'
    });
    const dispatch = useDispatch()
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
        } else {
            setModal({ ...modal, visible: false })
        }
        // eslint-disable-next-line
    }, [user.isLoggedin])

    const handleLogout = (e) => {
        e.preventDefault();
        setModal({
            ...modal,
            visible: true,
            message: 'Are you sure ?',
            title: 'Confirmation !',
            okClick: logout
        })
    }

    const logout = async () => {
        barRef.current.continuousStart();
        const response = await fetchData('api/auth/logout', signalRef.current);
        barRef.current.complete();
        if (!response.error) {
            dispatch(logoutUser());
            navigate('/login', { replace: true });

        } else {
            setModal({ ...modal, visible: true, message: response.error, okClick: modal.closeModal })
        }
    }

    const editProfile = () => {
        navigate('/editprofile')
    }

    return (
        <>
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <div><LoadingBar
                color='rgb(220, 216, 216)'
                ref={barRef} /></div>
            {!modal.visible && <div className={styles.container} >
                <div className={styles.usergreet}>
                    <h1>Hi, <span>{user.isLoggedin ? user.user.firstName.charAt(0).toUpperCase() + user.user.firstName.slice(1) : 'There'}</span></h1>
                    <div className={styles.buttons}>
                        <button onClick={editProfile}><div style={{ display: 'flex', alignItems: 'center' }}><FiEdit2 style={{ marginRight: '10px' }} /> Edit Your Profile</div></button>
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={() => navigate('/notebook')}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <GiNotebook style={{ marginRight: '10px' }} />
                                Your Online Notepad
                            </div>
                        </button>
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={() => navigate('/updatepassword')}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <CgPassword style={{ marginRight: '10px' }} />
                                Change Your Password
                            </div>
                        </button>
                    </div>

                    {user.user && user.user.isAdmin && <div className={styles.buttons}>
                        <button onClick={() => navigate('/messages')}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FiMessageSquare style={{ marginRight: '10px' }} />
                                View Messages
                            </div>
                        </button>
                    </div>}

                    {user.user && user.user.isAdmin && <div className={styles.buttons}>
                        <button onClick={() => navigate('/users')}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaUsers style={{ marginRight: '10px' }} />
                                View All Users
                            </div>
                        </button>
                    </div>}

                    <div className={styles.buttons}>
                        <button onClick={handleLogout}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <IoIosLogOut style={{ marginRight: '10px' }} />
                                Logout
                            </div>
                        </button>
                    </div>
                </div>
            </div >}
        </>
    )
}

export default Userhome;