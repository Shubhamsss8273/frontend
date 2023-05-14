import React, { useState } from 'react';
import styles from './Projecthome.module.css';
import { useNavigate } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";

const Projecthome = () => {
    const navigate = useNavigate();
    const [project, setProject] = useState({ title: 'TextUtils', details: 'Text Utils - It is a text utility tool. You can change cases(Uppercase, Lowercase or Titlecase) of text. You can count words or characters in a paragraph.', view: () => navigate('/textutils') })

    const textutils = () => {
        setProject({ title: 'TextUtils', details: 'Text Utils - It is a text utility tool. You can change cases(Uppercase, Lowercase or Titlecase) of text. You can count words or characters in a paragraph.', view: () => navigate('/textutils') })
    }

    const onlineNotepad = () => {
        setProject({ title: 'Online Notepad', details: 'It is an online notepad. You can create, update or delete a note or notebook and everything will be saved on the cloud. So you can get all your notes wherever you want.', view: () => navigate('/notebook') })
    }

    const compiler = () => {
        setProject({ title: 'Online Code Compiler', details: 'It is an online code compiler. You can write your code and choose your preferred language and your code will be executed on the server.', view: () => navigate('/compiler') })
    }

    return (
        <div className={styles.container} style={{ overflow: 'hidden' }}>
            <Fade direction='down' duration={500}>
                <h1>My Projects</h1>
            </Fade>
            <Fade cascade direction='up' delay={100} duration={500}>
                <div className={styles.projectContainer}>

                    <div className={styles.projectDetails}>
                        <h3>{project.title}</h3>
                        <p>{project.details}</p>
                        <button type='button' onClick={project.view}>View</button>
                    </div>

                    <div className={styles.projectName}>
                        <button type='button' className={styles.textUtilsButton} onClick={textutils}>Text Utils</button>
                        <button type='button' className={styles.onlineNotepadButton} onClick={onlineNotepad}>Online Notepad</button>
                        <button type='button' className={styles.compilerButton} onClick={compiler}>Online IDE</button>
                    </div>

                </div>
            </Fade>
        </div>
    )
}

export default Projecthome