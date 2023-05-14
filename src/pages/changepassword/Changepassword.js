import React, { useEffect, useState, useRef } from 'react';
import styles from './changepassword.module.css';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import useValidator from '../../hooks/useValidator';
import LoadingBar from 'react-top-loading-bar';
import useNetworkCall from '../../hooks/useNetworkCall';
import Modal from '../../components/modal/Modal';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Changepassword = () => {
    const [passwordType, setPasswordType] = useState({ password: 'password', newPassword: 'password' });
    const { stringValidator } = useValidator();
    const [data, setData] = useState({ password: '', newPassword: '' });
    const [error, setError] = useState({ password: false, newPassword: false });
    const barRef = useRef(null);
    const fetchData = useNetworkCall();
    const [modal, setModal] = useState({
        visible: false,
        title: '',
        message: '',
        okClick: () => setModal({ ...modal, visible: false }),
        closeModal: () => setModal({ ...modal, visible: false })
    });
    const isLoggedin = useSelector(state => state.user.isLoggedin);
    const navigate = useNavigate();
    const signalRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        signalRef.current = controller.signal;
        return () => controller.abort();
    }, [])


    useEffect(() => {
        if (!isLoggedin) {
            setModal({
                visible: true,
                title: 'Unauthorized !',
                message: 'Access denied! You need to login for access.',
                okClick: () => navigate('/login'),
                closeModal: () => navigate('/')
            })
        } else {
            setModal({ ...modal, visible: false })
        }
        // eslint-disable-next-line
    }, [isLoggedin])



    const submitHandler = async (e) => {
        e.preventDefault();
        if (!error.password && !error.newPassword) {
            barRef.current.continuousStart();
            const response = await fetchData('api/auth/updatepassword', signalRef.current, 'PUT', data);
            barRef.current.complete();
            if (!response.error) {
                setModal({ ...modal, title: 'Success', visible: true, message: 'Your password has been changed successfully.', okClick: () => navigate('/userhome') })
                setData({ password: '', newPassword: '' })
            } else {
                setModal({ ...modal, title: 'Error', visible: true, message: response.error })
            }
        } else {
            setModal({ ...modal, title: 'Error', visible: true, message: 'Please fill all fields correctly' });
        }

    }

    return (
        <div className={styles.container}>
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <LoadingBar ref={barRef} color='rgb(220, 216, 216)' />
            <h1>Change your password</h1>
            <div className={styles.form}>
                <form onSubmit={submitHandler}>
                    <div className={styles.input}>
                        <input type={passwordType.password} name='password' placeholder='Enter your old password' minLength='6'
                            onChange={(e) => {
                                setData({ ...data, password: e.target.value })
                                const result = stringValidator(e.target.value, 6);
                                setError({ ...error, password: result })
                            }}
                            value={data.password} required={true} />

                        <span
                            onClick={() => {
                                passwordType.password === 'password' ?
                                    setPasswordType({ ...passwordType, password: 'text' }) :
                                    setPasswordType({ ...passwordType, password: 'password' })
                            }}>
                            {passwordType.password === 'password' ? <AiOutlineEye size='1.2rem' /> : <AiOutlineEyeInvisible size='1.2rem' />}
                        </span>

                        {error.password && <p>Password must be atleast six characters</p>}
                    </div>

                    <div className={styles.input}>
                        <input type={passwordType.newPassword} name='newPassword' placeholder='Enter your new password' minLength='6'
                            onChange={(e) => {
                                setData({ ...data, newPassword: e.target.value });
                                const result = stringValidator(e.target.value, 6);
                                setError({ ...error, newPassword: result })
                            }}
                            value={data.newPassword} required={true} />
                        <span
                            onClick={() => {
                                passwordType.newPassword === 'password' ?
                                    setPasswordType({ ...passwordType, newPassword: 'text' }) :
                                    setPasswordType({ ...passwordType, newPassword: 'password' })
                            }}>
                            {passwordType.newPassword === 'password' ? <AiOutlineEye size='1.2rem' /> : <AiOutlineEyeInvisible size='1.2rem' />}
                        </span>

                        {error.newPassword && <p>Password must be atleast six characters</p>}
                    </div>
                    <button type='submit' disabled={data.password && data.newPassword ? false : true} >Change</button>
                </form>
            </div>
        </div>
    )
}

export default Changepassword;