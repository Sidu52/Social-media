import { createSlice } from '@reduxjs/toolkit';

// Initial state for the datareducer
const initialState = {
    posts: [],
    reels: [],
    saved: [],
    user: {},
    loading: false,
    sidebartoggle: true,
    error: null,
};

// Create a datareducer slice using createSlice from Redux Toolkit
const datareducer = createSlice({
    name: 'user',// Name of the slice
    initialState: initialState,// Initial state
    reducers: {
        setLoading: (state, action) => {
            const data = action.payload;
            state.loading = data; // Update the loading state with the payload
        }, setsideToggle: (state, action) => {
            const data = action.payload;
            state.sidebartoggle = data; // Update the toggle state with the payload
        },
        addData: (state, action) => {
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
            state.posts = data// Update the posts array with the payload
        },
        addtoreel: (state, action) => {
            const data = action.payload;
            const post = data.filter((item) => {
                // Check if the fileType is one of the specified types and the user matches data._id
                return (
                    (item.fileType === 'mp4' || item.fileType === 'avi' ||
                        item.fileType === 'mov' || item.fileType === 'wmv') &&
                    item.user === data._id
                );
            });
            state.reels.push(item);
        },
    },
});

export const { addData, add, addtopost, addtoreel, savePost, setLoading, setsideToggle } = datareducer.actions;
export default datareducer.reducer;
