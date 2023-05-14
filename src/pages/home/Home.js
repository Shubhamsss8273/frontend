import React from 'react';
import styles from './Home.module.css';
import homeImage from '../../images/mypic.jpg';
import { HiCursorArrowRays } from "react-icons/hi2";
import { useNavigate } from 'react-router-dom';
import { Slide, Zoom } from "react-awesome-reveal";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homepage}>
      <div className={styles.left}>
        <Slide cascade direction='left' delay={100} duration={500}>
          <h1>Hi There, <br />I'm <span>Shubham</span> Sharma</h1>
          <p>I'm a <span>MERN </span>stack developer.</p>
          <p><br />Please checkout my projects <br /></p>
          <button onClick={() => { navigate('/work') }}><HiCursorArrowRays style={{verticalAlign: 'bottom'}}/> My Projects</button>
        </Slide>
      </div>
      <div className={styles.right}>
        <Zoom delay={100} duration={1500}>
          <img src={homeImage} alt="mypic" />
        </Zoom>
      </div>
    </div>
  )
}

export default Home