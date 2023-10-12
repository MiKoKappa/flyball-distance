import { createSlice } from '@reduxjs/toolkit'

export const teamSlice = createSlice({
    name: 'team',
    initialState: {
        value: [{ handler: "-", dog: "-" },
        { handler: "-", dog: "-" },
        { handler: "-", dog: "-" },
        { handler: "-", dog: "-" }]
    },
    reducers: {
        add: (state, action) => {
            state.value = state.value.append(action.payload);
        },
        remove: (state, action) => {
            state.value -= state.value.filter(el => el.dog != action.payload.dog);
        },
        set: (state, action) => {
            state.value = action.payload;
        },
        swap: (state, action) => {
            let temp = state.value[action.payload[0]];
            let arr = state.value;
            arr[action.payload[0]] = arr[action.payload[1]];
            arr[action.payload[1]] = temp;
            state.value = arr;
        }
    }
})

export const { add, remove, set, swap } = teamSlice.actions

export default teamSlice.reducer