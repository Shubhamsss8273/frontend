import React, { useEffect } from 'react';
import styles from './navbar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../images/logo.jpg'
import useNetworkCall from '../../hooks/useNetworkCall';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/user/userSlice';
import { SlUser, SlUserFemale } from 'react-icons/sl';
import { fetchNotebooks } from '../../features/notebooks/notebookSlice';

const Navbar = () => {

  const fetchData = useNetworkCall();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    response(controller.signal);
    // eslint-disable-next-line
    return () => {
      controller.abort();
    }
  }, []);


  const response = async (signal) => {
    const response = await fetchData('api/auth/user', signal);
    if (response.login) {
      dispatch(loginUser(response.user));
      const notebooks = await fetchData('api/notebook/fetchnotebook', signal);
      if (!notebooks.error) { return dispatch(fetchNotebooks(notebooks.notebooks)) }
    }
  }


  const changeStyle = ({ isActive }) => {
    return {
      fontWeight: isActive ? 'bolder' : 'normal',
      borderBottom: isActive ? '2px solid' : 'none',
      borderTop: isActive ? '2px solid' : 'none',
    }
  }


  return (
    <div className={styles.header}>
      <div className={styles.logocontainer} >
        <img src={logo} alt="logo" onClick={() => navigate('/')} /><span>Shubham</span>
      </div>
      <div className={styles.navbar}>
        <nav>
          <ul>
            <li><NavLink to='/' style={changeStyle}>Home</NavLink></li>
            <li><NavLink to='/work' style={changeStyle} >My Work</NavLink></li>
            <li><NavLink to='/contact' style={changeStyle} >Contact</NavLink></li>
            {!user.isLoggedin && <li><NavLink to='/login' style={changeStyle}>Login</NavLink></li>}
            {user.isLoggedin && user.user.gender !== 'female' && <li><NavLink to='/userhome'><SlUser size='1.4rem' style={{ verticalAlign: 'bottom' }} /></NavLink></li>}
            {user.isLoggedin && user.user.gender === 'female' && <li><NavLink to='/userhome'><SlUserFemale size='1.4rem' style={{ verticalAlign: 'bottom' }} /></NavLink></li>}
          </ul>
        </nav>
      </div>
    </div >
  )
}

export default Navbar
