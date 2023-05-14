import React, { useEffect, useRef, useState } from 'react';
import styles from './createnote.module.css';
import useValidator from '../../../hooks/useValidator'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createNote, editNote } from '../../../features/notebooks/notebookSlice';
import useNetworkCall from '../../../hooks/useNetworkCall';
import Modal from '../../../components/modal/Modal';
import LoadingBar from 'react-top-loading-bar';


const Createnote = () => {

  const [note, setNote] = useState({ title: ``, tags: ``, description: `` });
  const [error, setError] = useState({ title: false, description: false });
  const { stringValidator } = useValidator();
  const params = useParams();
  const notebooks = useSelector(state => state.notebooks.notebooks);
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const barRef = useRef(null);
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
    } else if (notebooks.length !== 0) {
      setModal({ ...Modal, visible: false })
      const foundNotebook = notebooks.find(notebook => notebook._id === params.notebookId);
      if (!foundNotebook) {
        return setModal({
          visible: true, message: 'The requested notebook was not found', okClick: () => navigate('/notebook'), closeModal: () => navigate('/userhome'), title: 'Error'
        })
      }
      if (params.noteId) {
        const foundNote = foundNotebook.notes.find(item => item._id === params.noteId)
        if (!foundNote) {
          return setModal({
            visible: true,
            message: 'The requested note was not found',
            okClick: () => navigate(`/notebook/${params.notebookId}`),
            closeModal: () => navigate('/userhome'),
            title: 'Error'
          })
        }
        setNote({ title: foundNote.title, tags: foundNote.tags, description: foundNote.description })
      }
    } else {
      setModal({
        visible: true,
        message: "You don't have any notebooks !",
        okClick: () => navigate('/notebook'),
        closeModal: () => navigate('/userhome'),
        title: 'Error'
      })
    }

  }, [notebooks, user])

  const saveNote = async (e) => {
    e.preventDefault();
    if (!params.noteId) {
      barRef.current.continuousStart();
      const response = await fetchData(`api/notebook/${params.notebookId}/addnote`, signalRef.current, 'POST', note)
      barRef.current.complete();
      if (!response.error) {
        dispatch(createNote(response.notebook));
        navigate(`/notebook/${params.notebookId}`)
      }
    } else {
      barRef.current.continuousStart();
      const response = await fetchData(`api/notebook/${params.notebookId}/updatenote/${params.noteId}`, signalRef.current, 'PUT', note)
      barRef.current.complete();
      if (!response.error) {
        dispatch(editNote(response.notebook))
        navigate(`/notebook/${params.notebookId}`)
      }
    }
  }

  return (
    <>
      {modal.visible && <Modal closeModal={modal.closeModal} title={modal.title} message={modal.message} okClick={modal.okClick} />}
      <LoadingBar ref={barRef} color='rgb(220, 216, 216)' />
      <div className={styles.createnote}>

        <div className={styles.formcontainer}>
          <h1>{params.noteId ? "Edit Note" : "Create New Note"}</h1>
          <form onSubmit={saveNote}>
            <div className={styles.title}>
              <input type='text' name='title' id='title' placeholder='Title*' required={true} minLength='3' maxLength='50'
                onChange={e => {
                  setNote({ ...note, title: e.target.value });
                  const titleError = stringValidator(e.target.value, 3)
                  setError({ ...error, title: titleError })
                }} value={note.title} />
              {error.title && <p>Title must be at least 3 characters</p>}
            </div>

            <div className={styles.tags}>
              <input type='text' name='tags' id='tags' placeholder='Tags'
                onChange={e => {
                  setNote({ ...note, tags: e.target.value });
                }} value={note.tags} />
            </div>

            <div className={styles.description}>
              <textarea placeholder='Write Your Note Here*' id='description' rows={10} cols={100} required={true}
                onChange={e => {
                  setNote({ ...note, description: e.target.value });
                  const descError = stringValidator(e.target.value, 10)
                  setError({ ...error, description: descError })
                }} value={note.description}></textarea>
              {error.description && <p>Note must be at least 10 characters</p>}
            </div>
            <button type='submit'>Save</button>
            <button type='reset' onClick={() => setNote({ title: "", tags: "", description: "" })}>Clear All</button>
            <button type='button' onClick={() => navigate(`/notebook/${params.notebookId}`)}>Cancel</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Createnote