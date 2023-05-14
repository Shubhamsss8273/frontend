import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { loginUser } from '../../features/user/userSlice';
import LoadingBar from 'react-top-loading-bar';
import useNetworkCall from '../../hooks/useNetworkCall';
import useValidator from '../../hooks/useValidator';
import Modal from '../../components/modal/Modal';

const Signup = () => {
    const [user, setUser] = useState({ firstname: "", lastname: "", email: "", password: "", repassword: "", gender: 'male' });
    const [formError, setFormError] = useState({})
    const barRef = useRef(null);
    const dispatch = useDispatch();
    const loggedIn = useSelector(state => state.user.isLoggedin);
    const navigate = useNavigate();
    // Custom Hook to make network request
    const fetchData = useNetworkCall();
    // Custom Hook to perform form validation
    const { emailValidator, stringValidator } = useValidator();
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        okClick: () => setModal({ ...modal, visible: false }),
        closeModal: () => setModal({ ...modal, visible: false }),
        title: 'Error'
    })
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = formError.name || formError.email || formError.password || formError.repassword;
        if (error) { setModal({ ...modal, visible: true, message: 'Please fill all required fields correctly.' }) }
        else {
            // Start the top loading bar
            barRef.current.continuousStart();

            const cred = {
                firstName: user.firstname.trim().toLowerCase(),
                lastName: user.lastname.trim().toLowerCase(),
                email: user.email.trim().toLowerCase(),
                password: user.password.trim(),
                gender: user.gender
            }

            const response = await fetchData('api/auth/register', signalRef.current, 'POST', cred);
            barRef.current.complete();
            if (response.error) {
                setModal({ ...modal, visible: true, message: `${response.error}` })
            } else {
                dispatch(loginUser(response.user));
                navigate('/userhome', { replace: true });
            }
        }
    }

    return (
        <>
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <div className={styles.container}>
                <div>
                    <LoadingBar color='rgb(220, 216, 216)' ref={barRef} />
                </div>
                <div className={styles.signup}>
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.name}>
                            <input style={formError.name ? { borderColor: 'red' } : {}} type='text' name='firstname' autoComplete='first-name' placeholder='First Name *'
                                onChange={(e) => {
                                    const namePattern = /[0-9!#$%^&*_\-+=()\\|@`~{}[\]/,";:?.<>\s]/g
                                    const nameError = stringValidator(e.target.value, 3, namePattern);
                                    setUser({ ...user, firstname: e.target.value });
                                    setFormError({ ...formError, name: nameError });
                                }}
                                required={true} value={user.firstname} />
                            <input type='text' name='lastname' autoComplete='family-name' placeholder='Last Name' onChange={(e) => {
                                setUser({ ...user, lastname: e.target.value });
                            }} value={user.lastname} />
                            <p className={styles.error} style={formError.name ? {} : { display: 'none' }}>Name must be at least 3 characters and no special characters or numbers allowed</p>
                        </div>

                        <div className={styles.input}>
                            <input style={formError.email ? { borderColor: 'red' } : {}} type='email' name='email' autoComplete='email' placeholder='Email *'
                                onChange={(e) => {
                                    setUser({ ...user, email: e.target.value });
                                    const emailError = emailValidator(e.target.value)
                                    setFormError({ ...formError, email: emailError });
                                }}
                                required={true} value={user.email} />
                            <p className={styles.error} style={formError.email ? {} : { display: 'none' }}>Enter a valid email</p>
                        </div>

                        <div className={styles.input}>
                            <input style={formError.password ? { borderColor: 'red' } : {}} type='password' name='password' autoComplete='new-password' placeholder='Password *'

                                onChange={(e) => {
                                    setUser({ ...user, password: e.target.value });
                                    const passwordError = stringValidator(e.target.value, 6);
                                    setFormError({ ...formError, password: passwordError });
                                }} required={true} value={user.password} />
                            <p className={styles.error} style={formError.password ? {} : { display: 'none' }}>Password must be at least 6 characters</p>
                        </div>

                        <div className={styles.input}>
                            <input type='password' style={formError.repassword ? { borderColor: 'red' } : {}} name='repassword' placeholder='Confirm Your Password *'
                                onChange={(e) => {

                                    setUser({ ...user, repassword: e.target.value });
                                    user.password === e.target.value ? setFormError({ ...formError, repassword: false }) : setFormError({ ...formError, repassword: true })
                                }} required={true} value={user.repassword} />
                            <p className={styles.error} style={formError.repassword ? {} : { display: 'none' }}>Password did not match</p>
                        </div>

                        <div>
                            <div className={styles.radiocontainer}>
                                <input type='radio' id='male' name='gender' value='male' onChange={e => setUser({ ...user, gender: e.target.value })} checked={user.gender === 'male'} />
                                <label htmlFor='male'>Male</label>
                            </div>

                            <div className={styles.radiocontainer}>
                                <input type='radio' id='female' name='gender' value='female' onChange={e => setUser({ ...user, gender: e.target.value })} />
                                <label htmlFor='female'>Female</label>
                            </div>

                            <div className={styles.radiocontainer}>
                                <input type='radio' id='other' name='gender' value='other' onChange={e => setUser({ ...user, gender: e.target.value })} />
                                <label htmlFor='other'>Other</label>
                            </div>

                        </div>
                        <button type='submit' disabled={user.firstname && user.email && user.password && user.repassword && user.gender ? false : true}>Sign Up</button>
                    </form>
                    <p>Already have an account?</p><Link to='/login'>Login</Link>
                </div>
            </div>
        </>
    )
}

export default Signup;