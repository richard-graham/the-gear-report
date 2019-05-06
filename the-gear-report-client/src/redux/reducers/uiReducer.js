import { 
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  SET_MESSAGE,
  CLEAR_MESSAGE
} from '../types'

const initialState = {
  loading: false,
  errors: {},
  message: ''
}

export default function(state = initialState, action){
  switch(action.type){
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      }
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload
      }
    case CLEAR_MESSAGE:
      return {
        ...state,
        loading: false,
        message: ''
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {}
      }
    case LOADING_UI:
      return {
        ...state,
        loading: true
      }
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}