import React, { useState } from 'react';
import styles from './Textutils.module.css';


const TextUtils = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const handleOnChange = (e) => {
    setText(e.target.value);
  }

  const upperCase = () => {
    setResult(text.toUpperCase());

  }

  const lowerCase = () => {
    setResult(text.toLowerCase());
  }

  const titleCase = () => {

    const dotArray = text.split('.');
    const newText = dotArray.map((value) => {
      const trimmedString = value.trim();
      const titledString = trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1).toLowerCase();
      return titledString;
    })

    const newString = newText.join('. ');
    const questionArray = newString.split('?');
    const newQuestionArray = questionArray.map((value) => {
      const trimmedString = value.trim();
      const titledString = trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);
      return titledString;
    })

    setResult(newQuestionArray.join('? '))
  }

  const clearClick = () => {
    setText('');
    setResult('');
  }

  const copyClick = () => {
    navigator.clipboard.writeText(result);
  }

  const removeSpaces = () => {
    const textArray = text.split(/[ ]+/);
    const newText = textArray.join(' ');
    setText(newText);
    setResult(newText);
  }

  const wordCount = () => {
    setResult(`${text.split(/\s+/).filter((value) => value.length !== 0).length} Words & ${text.split(/\s+/).filter((value) => value.length !== 0).join('').length} Letters.`)

  }

  return (
    <div className={styles.container}>
      <h1>Welcome! This is Text-utility App! </h1>
      <div className={styles.textutils}>
        <div className={styles.left}>
          <h2>Enter your text:</h2>
          <textarea name="input" id="input" cols="80" rows="12" onChange={handleOnChange} value={text}></textarea>
          <button type='button' disabled={text === '' ? true : false} onClick={upperCase}>Convert to Uppercase</button>
          <button type='button' disabled={text === '' ? true : false} onClick={titleCase}>Convert to Titlecase</button>
          <button type='button' disabled={text === '' ? true : false} onClick={wordCount}>Word Counter</button>
          <button type='button' disabled={text === '' ? true : false} onClick={lowerCase}>Convert to Lowercase</button>
          <button type='button' disabled={text === '' ? true : false} onClick={removeSpaces}>Remove Extra Spaces</button>
          <button type='button' disabled={text === '' ? true : false} onClick={() => { setResult(text) }}>Preview</button>
          <button type='button' disabled={text === '' ? true : false} onClick={copyClick}>Copy</button>
          <button type='button' disabled={text === '' ? true : false} onClick={clearClick}>Clear All</button>
        </div>
        <div className={styles.right}>
          <h2>Result:</h2>
          <p>{result}</p>
        </div>
      </div>
    </div>
  )
}

export default TextUtils;