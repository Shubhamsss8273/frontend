import React, { useEffect, useState, useRef } from 'react';
import styles from './Editprofile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/modal/Modal';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import useValidator from '../../hooks/useValidator';
import useNetworkCall from '../../hooks/useNetworkCall';
import { loginUser } from '../../features/user/userSlice';



const Editprofile = () => {

    const [userDetails, setUserDetails] = useState({ firstName: "", lastName: "", gender: "", adminKey: "" });
    const navigate = useNavigate();
    const fetchData = useNetworkCall();
    const barRef = useRef(null);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { stringValidator } = useValidator();
    const params = useParams();
    const { state } = useLocation();
    const [error, setError] = useState({ firstName: false, gender: false })
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
            return setModal({
                visible: true,
                message: 'You are not Loggedin. Please login and try again',
                okClick: () => navigate('/login'),
                closeModal: () => navigate('/'),
                title: 'Unauthorized'
            })
        } else if (!params.userId) {
            setModal({ ...modal, visible: false })
            setUserDetails({ ...userDetails, firstName: user.user.firstName, lastName: user.user.lastName, gender: user.user.gender })
        } else if (params.userId && !user.user.isAdmin) {
            setModal({
                visible: true,
                message: 'You are not an admin user. Access denied !',
                okClick: () => navigate('/userhome'),
                closeModal: () => navigate('/userhome'),
                title: 'Unauthorized'
            })
        } else {
            setModal({ ...modal, visible: false });
            setUserDetails({ ...userDetails, firstName: state.user.firstName, lastName: state.user.lastName, gender: state.user.gender })
        }
    }, [user])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (error.firstName || error.gender) {
            return setModal({
                ...modal,
                visible: true,
                message: 'Please fill all required fields correctly.',
                okClick: () => setModal({ ...modal, visible: false }),
                closeModal: () => navigate('/userhome')
            })
        }
        barRef.current.continuousStart();
        const lowerCaseDetails = {
            firstName: userDetails.firstName.trim().toLowerCase(),
            lastName: userDetails.lastName.trim().toLowerCase(),
            gender: userDetails.gender,
            adminKey: userDetails.adminKey.trim()
        }
        if (!params.userId) {
            const response = await fetchData('api/auth/updateuser', signalRef.current, 'PUT', lowerCaseDetails);
            barRef.current.complete();
            if (response.error) {
                return setModal({ ...modal, visible: true, title: 'Error', message: response.error, okClick: () => navigate('/userhome'), closeModal: () => navigate('/userhome') })
            }
            dispatch(loginUser(response.user))
            navigate('/userhome')
        } else {
            const response = await fetchData(`api/admin/updateuser/${params.userId}`, signalRef.current, 'PUT', lowerCaseDetails)
            barRef.current.complete();
            if (response.error) {
                return setModal({ ...modal, visible: true, title: 'Error', message: response.error, okClick: () => navigate('/userhome'), closeModal: () => navigate('/userhome') })
            }
            dispatch(loginUser(response.user))
            navigate('/users')
        }
    }


    return (
        <>
            <LoadingBar color='rgb(220, 216, 216)' ref={barRef} />
            {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <div className={styles.container}>
                <div className={styles.formcontainer}>
                    <h1>Edit your profile</h1>
                    <form onSubmit={submitHandler}>
                        <div className={styles.input}>
                            <label htmlFor='firstName'>First Name* : </label>
                            <input type='text' name='firstName' id='firstName' autoComplete='first-name'
                                onChange={e => {
                                    const namePattern = /[0-9!#$%^&*_\-+=()\\|@`~{}[\]/,";:?.<>\s]/g
                                    const nameError = stringValidator(e.target.value, 3, namePattern);
                                    setUserDetails({ ...userDetails, firstName: e.target.value });
                                    setError({ ...error, firstName: nameError });
                                }} value={userDetails.firstName} required={true} minLength={3} />
                            {error.firstName && <p style={{ color: 'red' }}>Name must be at least 3 characters and no special characters or numbers allowed</p>}
                        </div>
                        <div className={styles.input}>
                            <label htmlFor='lastName'>Last Name : </label>
                            <input type='text' name='lastName' id='lastName' autoComplete='family-name'
                                onChange={e => {
                                    setUserDetails({ ...userDetails, lastName: e.target.value })
                                }} value={userDetails.lastName} />
                        </div>
                        {(params.userId ? !state.user.isAdmin : user.user && !user.user.isAdmin) && <div className={styles.input}>
                            <label htmlFor='adminKey'>Admin Key : </label>
                            <input type='password' name='adminKey' id='adminKey'
                                onChange={e => {
                                    setUserDetails({ ...userDetails, adminKey: e.target.value });
                                }} value={userDetails.adminKey} />
                            <p>To switch from a general user to admin user, Admin Key is required. Leave it empty if you don't have admin key.</p>
                        </div>}
                        <div className={styles.radiocontainer}>
                            <div className={styles.radio}>
                                <input type='radio' name='gender' id='male' value='male' onChange={e => setUserDetails({ ...userDetails, gender: e.target.value })}
                                    checked={userDetails.gender === 'male'} />
                                <label htmlFor='male'>Male</label>
                            </div>
                            <div className={styles.radio}>
                                <input type='radio' name='gender' id='female' value='female' onChange={e => setUserDetails({ ...userDetails, gender: e.target.value })}
                                    checked={userDetails.gender === 'female'} />
                                <label htmlFor='female'>Female</label>
                            </div>
                            <div className={styles.radio}>
                                <input type='radio' name='gender' id='other' value='other' onChange={e => setUserDetails({ ...userDetails, gender: e.target.value })}
                                    checked={userDetails.gender === 'other'} />
                                <label htmlFor='other'>Other</label>
                            </div>
                        </div>
                        <button type='submit' disabled={userDetails.firstName && userDetails.gender ? false : true} >Save</button>
                        <button type='button' onClick={() => params.userId ? navigate('/users') : navigate('/userhome')}>Go Back</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Editprofile