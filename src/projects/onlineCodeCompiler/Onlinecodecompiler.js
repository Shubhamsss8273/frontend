import React, { useState, useEffect, useRef } from 'react';
import styles from './Onlinecodecompiler.module.css';
import Modal from '../../components/modal/Modal';
import useNetworkCall from '../../hooks/useNetworkCall';
import { useNavigate } from 'react-router-dom';


const Onlinecodecompiler = () => {

    const [input, setInput] = useState({ language: 'nodejs', version: 'latest', code: ``, input: null });
    const [result, setResult] = useState(``);
    const [apiSecurityKey, setApiSecurityKey] = useState({ apiKey: '', apiHost: '' })
    const fetchData = useNetworkCall();
    const navigate = useNavigate();
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
        const fetchKeys = async () => {
            const response = await fetchData('api/admin/fetchkeys', controller.signal)
            if (response.error) {
                return setModal({ ...modal, visible: true, message: `You can not use Online Code Compiler right now. Please try again later. Error: ${response.error}`, okClick: () => navigate('/work'), closeModal: () => navigate('/work') })
            }
            setApiSecurityKey({ apiHost: response.apiHost, apiKey: response.apiKey })
        }
        fetchKeys();
        return () => controller.abort();
    }, [])

    const languageChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const runClick = async () => {
        if (!input.language) { return setModal({ ...modal, visible: true, message: 'Please choose your language', okClick: modal.closeModal }) }
        setResult('Loading...')
        try {
            const response = await fetch('https://online-code-compiler.p.rapidapi.com/v1/', {
                method: 'POST',
                signal: signalRef.current,
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': apiSecurityKey.apiKey,
                    'X-RapidAPI-Host': apiSecurityKey.apiHost
                },
                body: JSON.stringify(input)
            })
            const output = await response.json();
            setResult(output.output)
        } catch (error) {
            setModal({ ...modal, visible: true, message: 'Uh-Oh! Some error occurred.', okClick: modal.closeModal })
        }
    }



    return (
        <>{modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
            <div className={styles.container}>

                <div className={styles.languagelist}>
                    Select your language:
                    <div className={styles.listitem}>
                        <input type="radio" name="language" id="c" value='c' onChange={languageChange} />
                        <label htmlFor="c">C</label>
                    </div>
                    <div className={styles.listitem}>
                        <input type="radio" name="language" id="cpp" value='cpp' onChange={languageChange} />
                        <label htmlFor="cpp">C++</label>
                    </div>
                    <div className={styles.listitem}>
                        <input type="radio" name="language" id="python" value='python3' onChange={languageChange} />
                        <label htmlFor="python">Python</label>
                    </div>
                    <div className={styles.listitem}>
                        <input type="radio" name="language" id="php" value='php' onChange={languageChange} />
                        <label htmlFor="php">PHP</label>
                    </div>
                    <div className={styles.listitem}>
                        <input type="radio" name="language" id="java" value='java' onChange={languageChange} />
                        <label htmlFor="java">Java</label>
                    </div>
                    <div className={styles.listitem}>
                        <input type="radio" name="language" id="csharp" value='csharp' onChange={languageChange} />
                        <label htmlFor="csharp">C#</label>
                    </div>
                    <div className={styles.listitem}>
                        <input type="radio" name="language" id="ruby" value='ruby' onChange={languageChange} />
                        <label htmlFor="ruby">Ruby</label>
                    </div>
                    <div className={styles.listitem}>
                        <input type="radio" name="language" id="nodejs" value='nodejs' onChange={languageChange} checked={input.language === 'nodejs'} />
                        <label htmlFor="nodejs">NodeJs</label>
                    </div>
                </div>

                <div className={styles.codecontainer}>
                    <div className={styles.editor}>
                        <label htmlFor="editor">Write Your code below: </label>
                        <textarea name="editor" id="editor" cols="100" rows="20" value={input.code}
                            onChange={(e) => {
                                setInput({ ...input, code: e.target.value })
                            }}></textarea>
                    </div>
                    {input.code && <button onClick={runClick}>Run</button>}
                    {input.code && <button onClick={() => setInput({ ...input, code: `` })}>Clear</button>}
                    <div className={styles.result}>
                        <label htmlFor="result">Output: </label>
                        <textarea name="result" id="result" cols="100" rows="5" value={result} readOnly={true}>hello</textarea>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Onlinecodecompiler
