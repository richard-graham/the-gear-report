import { 
  SET_USER_LOCATION, 
  SET_USER_COUNTRY,
  SET_USER, 
  SET_ERRORS, 
  CLEAR_ERRORS, 
  LOADING_UI, 
  SET_UNAUTHENTICATED, 
  LOADING_USER, 
  MARK_NOTIFICATIONS_READ 
} from '../types'
import axios from 'axios'

export const updateUserLocation = () => (dispatch) => {
  fetch('https://ipapi.co/json') // grab country name
      .then(res => res.json())
      .then(position => {
        updateUserCountry({
          countryName: position.country_name,
          regionName: position.region 
        })
      navigator.geolocation.getCurrentPosition((userPosition) => { 
        dispatch({ // user agrees to sharing location
          type: SET_USER_LOCATION,
          payload: {
            lat: userPosition.coords.latitude,
            lng: userPosition.coords.longitude,
            zoom: 11,
            haveUsersLocation: true
          }
        })
    }, () => { // if user says no to tracking location use api
      fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(position => {
          dispatch({ 
            type: SET_USER_LOCATION,
            payload: {
              lat: position.latitude,
              lng: position.longitude,
              zoom: 5,
              haveUsersLocation: false,
              countryName: position.country_name,
              regionName: position.region 
            }
          })
        })
      });
    })
}

export const updateUserCountry = (location) => (dispatch) => {
  dispatch({
    type: SET_USER_COUNTRY,
    payload: {
      country: location.countryName,
      region: location.regionName
    }
  })
}


export const loginUser = (userData, history) => (dispatch) => { //where is history coming from?
  dispatch({ type: LOADING_UI })
  axios.post('/login', userData)
      .then(res => {
        setAuthorizationHeader(res.data.token)
        dispatch(getUserData())
        dispatch({ type: CLEAR_ERRORS })
        history.push('/')
      })
      .catch(err => {
        dispatch({ 
          type: SET_ERRORS, 
          payload: err.response.data 
        })
      })
}

export const signupUser = (newUserData, history) => (dispatch) => { //where is history coming from?
  dispatch({ type: LOADING_UI })
  console.log(newUserData );
  axios.post('/signup', newUserData)
      .then(res => {
        console.log(res);
        setAuthorizationHeader(res.data.token)
        dispatch(getUserData())
        dispatch({ type: CLEAR_ERRORS })
        history.push('/')
      })
      .catch(err => {
        console.log(err.response.data);
        dispatch({ 
          type: SET_ERRORS, 
          payload: err.response.data 
        })
      })
}

export const logoutUser = () => (dispatch) => {
  console.log('pinged');
  localStorage.removeItem('FBIdToken')
  delete axios.defaults.headers.common['Authorization']
  dispatch({ type: SET_UNAUTHENTICATED })
}


export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER })
  axios.get('/user')
    .then(res => {
      dispatch({ 
        type: SET_USER,
        payload: res.data
      })
    })
    .catch(err => {
      console.log(err);
    })
}

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER })
  axios.post('/user/image', formData)
    .then(() => {
      dispatch(getUserData())
    })
    .catch(err => {
      console.log(err);
    })
}

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER })
  axios.post('/user', userDetails)
    .then(() => {
      dispatch(getUserData()) 
    })
    .catch(err => {
      console.log(err);
    })
}

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios.post('/notifications', notificationIds)
    .then(res => {
      dispatch({ type: MARK_NOTIFICATIONS_READ })
    })
    .catch(err => console.log(err))
}

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`
        localStorage.setItem('FBIdToken', FBIdToken) // saves token to local storage in case of page refresh etc
        axios.defaults.headers.common['Authorization'] = FBIdToken
}