import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    reels: [],
    saved: [],
    user: {},
    loading: false,
    error: null,
};

const datareducer = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        addData: (state, action) => {
            // const data = action.payload;
            // console.log("ss", data)
            state.user = action.payload; // Update the user object with the payload
        },
        savePost: (state, action) => {
            const data = action.payload;
            data.forEach((item) => {
                // Check if item.id already exists in state.items
                // const isItemExist = state.saved.some((existingItem) => existingItem.id === item.id);
                if (item.saved) {
                    state.saved.push(item);
                }
            });

        },
        addtopost: (state, action) => {
            const data = action.payload;
            state.posts = data
        },
        addtoreel: (state, action) => {
            const data = action.payload;
            data.forEach((item) => {
                // Check if item.id already exists in state.items
                const isItemExist = state.reels.some((existingItem) => existingItem.id === item.id);
                if (!isItemExist && item.fileType == "mp4") {
                    state.reels.push(item);
                }
            });
        },
    },
});

export const { addData, add, addtopost, addtoreel, savePost } = datareducer.actions;
export default datareducer.reducer;
