import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/user/userSlice';
import LoadingBar from 'react-top-loading-bar';
import useNetworkCall from '../../hooks/useNetworkCall';
import useValidator from '../../hooks/useValidator';
import Modal from '../../components/modal/Modal';


const Login = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.user.isLoggedin);
    const [passwordType, setPasswordType] = useState('password');
    const [cred, setCred] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const fetchData = useNetworkCall();
    const barRef = useRef(null);
    const { emailValidator, stringValidator } = useValidator();
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        okClick: () => setModal({ ...modal, visible: false }),
        closeModal: () => setModal({ ...modal, visible: false }),
        title: 'Error'
    });
    const [error, setError] = useState({ email: "", password: "" });
    const signalRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        signalRef.current = controller.signal;
        return () => controller.abort();
    }, [])


    useEffect(() => {
        if (loggedIn) {
            setModal({
                visible: true,
                message: 'You are already Logged in. You want to logout ?',
                okClick: () => navigate('/userhome'),
                closeModal: () => navigate('/'),
                title: 'Access denied !'
            })
        } else {
            setModal({ ...modal, visible: false })
        }
        // eslint-disable-next-line
    }, [loggedIn])


    const handleClick = async (e) => {
        e.preventDefault();
        const lowerCaseCred = {
            email: cred.email.trim().toLowerCase(),
            password: cred.password.trim()
        }

        if (!error.email && !error.password) {
            barRef.current.continuousStart();
            const userData = await fetchData('api/auth/login', signalRef.current, 'POST', lowerCaseCred);
            barRef.current.complete();
            if (userData.error) {
                setModal({ ...modal, visible: true, message: `${userData.error}` })
            } else {
                dispatch(loginUser(userData.user));
                navigate('/userhome', { replace: true });
            }
        } else {
            setModal({ ...modal, visible: true, message: 'Please fill all required fields correctly.' });
        }
    }

    return (
        <>
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <LoadingBar color='rgb(220, 216, 216)' ref={barRef} />
            <div className={styles.container}>
                <div className={styles.login}>
                    <h1>Login</h1>
                    <form onSubmit={handleClick}>
                        <input type='email' name='email' placeholder='Enter Your Email *' autoComplete='email' value={cred.email} onChange={(e) => {
                            setCred({ ...cred, email: e.target.value });
                            const emailError = emailValidator(e.target.value);
                            setError({ ...error, email: emailError });
                        }} required={true} />
                        <input type={passwordType} name='password' placeholder='Password *' autoComplete='current-password' value={cred.password} onChange={(e) => {
                            setCred({ ...cred, password: e.target.value });
                            const passwordError = stringValidator(e.target.value);
                            setError({ ...error, password: passwordError });
                        }} required={true} minLength='1' />
                        <i onClick={() => {
                            passwordType === 'password' ? setPasswordType('text') : setPasswordType('password');
                        }}>{passwordType === 'password' ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</i>
                        <button type='submit' disabled={cred.email && cred.password ? false : true}>Login</button>
                    </form>
                    <p>Don't have an account?</p>
                    <Link to='/register' >Sign up</Link>
                </div>
            </div>
        </>
    )
}

export default Login;