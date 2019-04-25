import { 
  SET_USER, 
  SET_ERRORS, 
  CLEAR_ERRORS, 
  LOADING_UI, 
  SET_UNAUTHENTICATED, 
  LOADING_USER, 
  MARK_NOTIFICATIONS_READ,
  SET_LOCATION
} from '../types'
import axios from 'axios'

export const getUserLocation = (position) => (dispatch) => {
  console.log(position);
    dispatch({ 
      type: SET_LOCATION,
      payload: {
        ...position
      }
    })
}

// export const loginUser = (userData, history) => (dispatch) => { //where is history coming from?
//   dispatch({ type: LOADING_UI })
//   axios.post('/login', userData)
//       .then(res => {
//         setAuthorizationHeader(res.data.token)
//         dispatch(getUserData())
//         dispatch({ type: CLEAR_ERRORS })
//         history.push('/')
//       })
//       .catch(err => {
//         dispatch({ 
//           type: SET_ERRORS, 
//           payload: err.response.data 
//         })
//       })
// }

// export const signupUser = (newUserData, history) => (dispatch) => { //where is history coming from?
//   dispatch({ type: LOADING_UI })
//   axios.post('/signup', newUserData)
//       .then(res => {
//         setAuthorizationHeader(res.data.token)
//         dispatch(getUserData())
//         dispatch({ type: CLEAR_ERRORS })
//         history.push('/')
//       })
//       .catch(err => {
//         dispatch({ 
//           type: SET_ERRORS, 
//           payload: err.response.data 
//         })
//       })
// }

// export const logoutUser = () => (dispatch) => {
//   localStorage.removeItem('FBIdToken')
//   delete axios.defaults.headers.common['Authorization']
//   dispatch({ type: SET_UNAUTHENTICATED })
// }


// export const getUserData = () => (dispatch) => {
//   dispatch({ type: LOADING_USER })
//   axios.get('/user')
//     .then(res => {
//       dispatch({ 
//         type: SET_USER,
//         payload: res.data
//       })
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }

// export const uploadImage = (formData) => (dispatch) => {
//   dispatch({ type: LOADING_USER })
//   axios.post('/user/image', formData)
//     .then(() => {
//       dispatch(getUserData())
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }

// export const editUserDetails = (userDetails) => (dispatch) => {
//   dispatch({ type: LOADING_USER })
//   axios.post('/user', userDetails)
//     .then(() => {
//       dispatch(getUserData()) 
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }

// export const markNotificationsRead = (notificationIds) => (dispatch) => {
//   axios.post('/notifications', notificationIds)
//     .then(res => {
//       dispatch({ type: MARK_NOTIFICATIONS_READ })
//     })
//     .catch(err => console.log(err))
// }

// const setAuthorizationHeader = (token) => {
//   const FBIdToken = `Bearer ${token}`
//         localStorage.setItem('FBIdToken', FBIdToken) // saves token to local storage in case of page refresh etc
//         axios.defaults.headers.common['Authorization'] = FBIdToken
// }