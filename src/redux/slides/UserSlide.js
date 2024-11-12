import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  access_token: '',
  refresh_token: '',
  id: '',
  isAdmin: false,
  city: '',

}

export const UserSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
        const { name = '', email = '', access_token = '', phone = '', address = '', avatar = '', _id = '', isAdmin, city = '', refresh_token = ''} = action.payload
        state.name = name;
        state.email = email;
        state.address = address;
        state.phone = phone;
        state.avatar = avatar;
        state.id = _id;
        state.access_token = access_token; 
        state.isAdmin = isAdmin; 
        state.city = city; 
        state.refresh_token = refresh_token;


    },
    resetUser: (state) => {
        state.name = '';
        state.email = '';
        state.address = '';
        state.phone = '';
        state.avatar = '';
        state.id = '';
        state.access_token = '';
        state.isAdmin = false;
        state.city = ''; 


    }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = UserSlide.actions

export default UserSlide.reducer