import { configureStore } from '@reduxjs/toolkit'
import teamReducer from "./teamSlice"

export default configureStore({
    reducer: {
        team: teamReducer
    }
})