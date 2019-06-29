import { 
  SET_USER, 
  SET_ERRORS, 
  CLEAR_ERRORS, 
  LOADING_UI, 
  SET_UNAUTHENTICATED, 
  LOADING_USER, 
  MARK_NOTIFICATIONS_READ,
  SET_MESSAGE,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
} from '../types'
import axios from 'axios'

export const loginUser = (userData, history) => (dispatch) => { 
  dispatch({ type: LOADING_UI })
  axios.post('/login', userData)
      .then(res => {
        setAuthorizationHeader(res.data.token)
        dispatch(getUserData())
        dispatch({ type: CLEAR_ERRORS })
        history.goBack()
      })
      .catch(err => {
        dispatch({ 
          type: SET_ERRORS, 
          payload: err.response.data 
        })
      })
}

export const signupUser = (newUserData, history) => (dispatch) => { 
  dispatch({ type: LOADING_UI })
  axios.post('/signup', newUserData)
      .then(res => {
        setAuthorizationHeader(res.data.token)
        dispatch(getUserData())
        dispatch({ type: CLEAR_ERRORS })
        dispatch({
          type: SET_MESSAGE,
          payload: 'Sign up successful'
        })
        history.goBack()
      })
      .catch(err => {
        console.log(err);
        dispatch({ 
          type: SET_ERRORS, 
          payload: err
        })
      })
}

export const logoutUser = () => (dispatch) => {
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

export const uploadUserImage = (formData) => (dispatch) => {  
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
  axios.post('/user', userDetails)
    .then((res) => {
      dispatch(getUserData()) 
      dispatch({ type: SET_MESSAGE, payload: res.data.message })
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

export const setError = (error) => (dispatch) => {
  dispatch({
    type: SET_ERRORS,
    payload: error
  })
}

export const subscribeToCrag = (cragDetails) => dispatch => {
  axios.post('/subscribe/crag', cragDetails)
    .then(res => {
      if(res.data.error) dispatch({ type: SET_ERRORS, payload: res.data.error })
      if(res.data.message) dispatch({ type: SET_MESSAGE, payload: res.data.message })
      dispatch(getUserData())
    })
}

export const unsubscribeFromCrag = (cragDetails) => dispatch => {
  axios.post('/unsubscribe/crag', cragDetails)
    .then(res => {
      if(res.data.error) dispatch({ type: SET_ERRORS, payload: res.data.error })
      if(res.data.message) dispatch({ type: SET_MESSAGE, payload: res.data.message })
      dispatch(getUserData())
    })
}

export const likeComment = messageId => dispatch => {
  dispatch({ 
    type: LIKE_COMMENT,
    payload: { commentId: messageId }
  })
  axios.get(`/comment/${messageId}/like`)
    .then(res => {
      if(res.data.error) {
        dispatch({ type: SET_ERRORS, payload: res.data.error })
        dispatch({ type: UNLIKE_COMMENT, payload: { commentId: messageId } })
      }
      if(res.data.message) dispatch({ type: SET_MESSAGE, payload: res.data.message })

    })
    .catch(err => {
      console.log(err);
    })
}

export const unlikeComment = messageId => dispatch => {
  dispatch({
    type: UNLIKE_COMMENT,
    payload: { commentId: messageId }
  })
  axios.get(`/comment/${messageId}/unlike`)
  .then(res => {
    if(res.data.error){
      dispatch({ type: SET_ERRORS, payload: res.data.error })
      dispatch({ type: LIKE_COMMENT, payload: { commentId: messageId } })
    }
    if(res.data.message) dispatch({ type: SET_MESSAGE, payload: res.data.message })
  })
  .catch(err => {
    console.log(err);
  })
}

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`
        localStorage.setItem('FBIdToken', FBIdToken) // saves token to local storage in case of page refresh etc
        axios.defaults.headers.common['Authorization'] = FBIdToken
}