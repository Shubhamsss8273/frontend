import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice.js'
import notebookReducer from '../features/notebooks/notebookSlice.js'

const store = configureStore({
    reducer: {
        user: userReducer,
        notebooks: notebookReducer
    }
})

export default store;