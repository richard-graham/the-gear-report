import { 
  SET_ALERTS,
  LOADING_DATA, 
  LIKE_ALERT, 
  UNLIKE_ALERT, 
  DELETE_ALERT, 
  LOADING_UI, 
  SET_ERRORS,
  POST_ALERT,
  CLEAR_ERRORS,
  SET_ALERT,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
  SET_ALERT_IMAGE,
  SET_MESSAGE,
  RESET_ALERT_IMAGE,
  SET_USER_ALERTS
} from '../types'
import axios from 'axios'

// Get all alerts
export const getAlerts = () => (dispatch) => {
  dispatch({ type: LOADING_DATA })
  axios.get('/alerts')
    .then(res => {
      dispatch({ 
        type: SET_ALERTS, 
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: SET_ALERTS,
        payload: []
      })
    })
}

export const getRecentAlerts = () => (dispatch) => {
  dispatch({ type: LOADING_DATA })
  axios.get('/alerts/recent')
    .then(res => {
      dispatch({ 
        type: SET_ALERTS, 
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: SET_ALERTS,
        payload: []
      })
    })
}

export const getAlert = (alertId) => dispatch => {
  dispatch({ type: LOADING_UI })
  axios.get(`/alert/${alertId}`)
    .then(res => {
      dispatch({
        type: SET_ALERT,
        payload: res.data
      })
      dispatch({ type: STOP_LOADING_UI })
    })
    .catch(err => console.log(err))
}

export const getAlertsByUser = (userHandle) => (dispatch) => {
  console.log('hit');
  axios.get(`/alerts/${userHandle}`)
  .then(res => {
    console.log(res.data);
    dispatch({
      type: SET_USER_ALERTS,
      payload: res.data
    })
  })
  .catch(err => console.log(err))
}

//Post an alert
export const postAlert = (newAlert) => dispatch => {
  dispatch({ type: LOADING_UI })
  axios.post('/alert', newAlert)

    .then(res => {
      dispatch({ 
        type: POST_ALERT, 
        payload: res.data 
      })
      dispatch(clearErrors())
      dispatch({
        type: SET_MESSAGE,
        payload: 'Alert created successfully'
      })
    })
    .catch(err => {
      console.log(err.response);
      dispatch({ 
        type: SET_ERRORS, 
        payload: { general: `Error post failed`}
      })
    })
}

export const uploadAlertImage = (formData) => (dispatch) => {  
  dispatch({ type: LOADING_DATA })
  axios.post('/alert/add/image', formData)
    .then((res) => {
      dispatch({ 
        type: SET_ALERT_IMAGE,
        payload: res.data.url
      })
    })
    .then(() => {
      dispatch({
        type: SET_MESSAGE,
        payload: 'Image uploaded successfully'
      })
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err
      })
    })
}

export const resetAlertImages = () => (dispatch) => {
  dispatch({ type: RESET_ALERT_IMAGE })
}

//Like an alert
export const likeAlert = (alertId) => (dispatch) => {
  axios.get(`/alert/${alertId}/like`)
    .then((res) => {
      dispatch({ 
        type: LIKE_ALERT,
        payload: res.data
      })
    })
    .catch(err => console.log(err))
}

//Unlike an alert
export const unlikeAlert = (alertId) => (dispatch) => {
  axios.get(`/alert/${alertId}/unlike`)
    .then((res) => {
      dispatch({ 
        type: UNLIKE_ALERT,
        payload: res.data
      })
    })
    .catch(err => console.log(err))
}

//Submit a comment
export const submitComment = (alertId, commentData) => dispatch => {
  axios.post(`/alert/${alertId}/comment`, commentData)
    .then(res => {
      dispatch({ type: SUBMIT_COMMENT, payload: res.data })
      dispatch(clearErrors())
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      })
    })
}

export const deleteAlert = (alertId) => (dispatch) => {
  axios.delete(`/alert/${alertId}`)
    .then(() => {
      dispatch({ type: DELETE_ALERT, payload: alertId })
    })
    .catch(err => console.log(err))
}

export const getUserData = (userHandle) => dispatch => {
  dispatch({ type: LOADING_DATA })
  axios.get(`/user/${userHandle}`)
    .then(res => {
      dispatch({ 
        type: SET_ALERTS,
        payload: res.data.alerts 
      })
    })
    .catch(() => {
      dispatch({
        type: SET_ALERTS,
        payload: null
      })
    })
}

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS })
}