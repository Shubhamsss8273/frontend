const useValidator = () => {

  const emailValidator = (email) => {
    if (!email) {
      return true;
    } else {
      const result = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
      return !result;
    }
  }

  const stringValidator = (value, length = 1, pattern = null) => {
    if (value.length < length) {
      return true;
    } else if (pattern) {
      const result = pattern.test(value);
      return result;
    } else {
      return false;
    }
  }
  return { emailValidator, stringValidator }
}

export default useValidator;