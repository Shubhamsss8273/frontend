import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notebooks: []
}

const notebookSlice = createSlice({
    name: 'notebook',
    initialState,
    reducers: {
        fetchNotebooks: (state, action) => {
            state.notebooks = action.payload
        },
        createNotebook: (state, action) => {
            state.notebooks.push(action.payload)
        },
        editNotebook: (state, action) => {
            state.notebooks = state.notebooks.map(notebook => {
                if (notebook._id === action.payload.id) {
                    notebook.title = action.payload.title
                    return notebook
                }
                else {
                    return notebook
                }
            })
        },
        deleteNotebook: (state, action) => {
            state.notebooks = state.notebooks.filter(notebook => notebook._id !== action.payload)
        },
        createNote: (state, action) => {
            state.notebooks = state.notebooks.map(notebook => {
                if (notebook._id === action.payload._id) {
                    notebook = action.payload;
                    return notebook;
                } else {
                    return notebook
                }
            })
        },
        editNote: (state, action) => {
            state.notebooks = state.notebooks.map(notebook => {
                if (notebook._id === action.payload._id) {

                    notebook = action.payload
                    return notebook;
                } else {
                    return notebook;
                }
            })
        },
        deleteNote: (state, action) => {
            state.notebooks = state.notebooks.map(notebook => {
                if (notebook._id === action.payload.notebookId) {
                    notebook.notes = notebook.notes.filter(note => note._id !== action.payload.noteId)
                    return notebook;
                } else {
                    return notebook;
                }
            })
        }
    }
})

export default notebookSlice.reducer;
export const { fetchNotebooks, editNotebook, createNotebook, deleteNotebook, createNote, editNote, deleteNote } = notebookSlice.actions;