import React, { useState, useRef, useEffect } from 'react';
import styles from './notebook.module.css';
import Card from '../card/Card';
import { BsSearch, BsSortDown } from 'react-icons/bs';
import { AiOutlinePlus, AiOutlineDown } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Tippy from '@tippyjs/react';


const Notebookandnote = (props) => {

  const [style, setStyle] = useState({ height: '40px', addNotebook: 'none' });
  const [sortStyle, setSortStyle] = useState({ alphabetically: '', newer: '', older: '' })
  const [items, setItems] = useState();
  const { viewItem, deleteItem, editItem, addNotebook, pageTitle, noteComponent } = props;
  const [notebook, setNotebook] = useState({ title: 'Untitled', create: false, edit: false, id: '' });
  const inputRef = useRef(null);
  const notebooks = useSelector(state => state.notebooks.notebooks);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    setItems(props.items)
  }, [props.items])


  const viewSortingTools = (e) => {
    style.height === '40px' ? setStyle({ ...style, height: '213px', transform: 'rotate(180deg)' }) : setStyle({ ...style, height: '40px', transform: 'rotate(360deg)' });
  }


  const viewAddNotebook = () => {
    if (noteComponent) {
      navigate(`/createnote/${params.notebookId}`);
    } else {
      setStyle({ ...style, addNotebook: 'block' });
      setNotebook({ ...notebook, create: true, edit: false, title: 'Untitled', id: null })
      inputRef.current.focus();
    }
  }

  const editNotebook = (id) => {
    if (noteComponent) {
      navigate(`/${params.notebookId}/editnote/${id}`)
    } else {
      setStyle({ ...style, addNotebook: 'block' });
      setNotebook({
        ...notebook,
        title: notebooks.find(value => value._id === id).title,
        create: false,
        edit: true,
        id: id
      })
    }
  }

  const removeNotebook = (id) => {
    deleteItem(id);
    cancel();
  }

  const save = () => {
    if (notebook.create) {
      addNotebook(notebook.title)
      setNotebook({ ...notebook, title: 'Untitled', create: false, edit: false })
      cancel();
    } else {
      editItem(notebook.id, notebook.title);
      setNotebook({ ...notebook, title: '', create: false, edit: false })
      cancel();
    }
  }

  const cancel = () => {
    setStyle({ ...style, addNotebook: 'none' })
  }

  const alphabeticSort = () => {
    setSortStyle({ alphabetically: '#00557c' })
    const sortItems = [...props.items]
    sortItems.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1 }
      if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1 }
      return 0
    })
    setItems(sortItems)
  }

  const search = (e) => {
    if (noteComponent) {
      const filteredItems = props.items.filter(obj => {
        return obj.title.toLowerCase().includes(e.target.value.toLowerCase()) || obj.tags.toLowerCase().includes(e.target.value.toLowerCase())
      })
      setItems(filteredItems);
    } else {
      const filteredItems = props.items.filter(obj => {
        return obj.title.toLowerCase().includes(e.target.value.toLowerCase())
      })
      setItems(filteredItems);
    }
  }

  const sortNewer = () => {
    setSortStyle({ newer: '#00557c' })
    const sortItems = [...props.items]
    sortItems.sort((a, b) => {
      const dateFirst = new Date(a.createdOn).getTime()
      const dateSecond = new Date(b.createdOn).getTime()
      if (dateFirst > dateSecond) { return -1 }
      if (dateFirst < dateSecond) { return 1 }
      return 0
    })
    setItems(sortItems);
  }

  const sortOlder = () => {
    setSortStyle({ older: '#00557c' })
    const sortItems = [...props.items]
    sortItems.sort((a, b) => {
      const dateFirst = new Date(a.createdOn)
      const dateSecond = new Date(b.createdOn)
      if (dateFirst > dateSecond) { return 1 }
      if (dateFirst < dateSecond) { return -1 }
      return 0
    })
    setItems(sortItems);
  }

  const clearAll = () => {
    setSortStyle({ alphabetically: false, newer: false, older: false })
    setItems(props.items)
  }

  return (
    <div className={styles.notebookcontainer}>
      <div className={styles.left}>
        <div className={styles.searchbox}>
          <input type='search' placeholder='Search' onChange={search} /><span><BsSearch /></span>
        </div>

        <div className={styles.sortby} style={{ height: style.height }}>
          <div onClick={viewSortingTools} className={styles.sortbtn}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BsSortDown /> Sort By
            </div>
            <span style={{ transform: `${style.transform}` }}><AiOutlineDown /></span>
          </div>

          <div className={styles.sorttools}>
            <div onClick={alphabeticSort} style={{ backgroundColor: sortStyle.alphabetically }} >
              Alphabetically (A-Z)
            </div>

            <div onClick={sortNewer} style={{ backgroundColor: sortStyle.newer }}>
              Newer
            </div>

            <div onClick={sortOlder} style={{ backgroundColor: sortStyle.older }}>
              Older
            </div>

            <div onClick={clearAll}>
              Clear All
            </div>

          </div>
        </div>
        <div className={styles.plusicon}>
          <Tippy content={noteComponent ? 'New Note' : 'New Notebook'} theme='mywebsite'>
            <button onClick={viewAddNotebook}><AiOutlinePlus size='2rem' /></button>
          </Tippy>
          <div className={styles.addnotebook} style={{ display: style.addNotebook }} >
            <label htmlFor=''>Enter Notebook Name:</label>
            <input ref={inputRef} name='notebookTitle' id='notebookTitle' value={notebook.title} onChange={e => setNotebook({ ...notebook, title: e.target.value })} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type='button' onClick={save}>Save</button>
              <button type='button' onClick={cancel}>Cancel</button>
            </div>
          </div>
        </div>
        {noteComponent && <button type='button' className={styles.gotonotebook} onClick={() => navigate('/notebook')}>Back to Books</button>}

      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{pageTitle}</h1>
        <div className={styles.notebooks}>
          {items && items.length > 0 ? (items.map(item => {
            return <Card key={item._id} id={item._id} title={item.title.length < 18 ? `${item.title}` : `${item.title.slice(0, 18)}...`} description={item.description ? (item.description.length > 48 ? `${item.description.slice(0, 48)}...` : `${item.description}`) : `This book has ${item.notes.length} notes.`} date={new Date(item.createdOn).toLocaleDateString()} viewItem={viewItem} deleteItem={removeNotebook} editItem={editNotebook} />
          })) : (noteComponent ? <h1 style={{ fontSize: '3rem' }}>This notebook is empty !</h1> : <h1 style={{ fontSize: '3rem' }}>You don't have any notebook.</h1>)}
        </div>
      </div>
    </div>
  )
}

export default Notebookandnote;