import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { IUsersActionTypes } from './types'
import { fetchError, fetchTokenSuccess, fetchUserSuccess } from './actions'
import callApi from '../../utils/callApi'
import { AnyAction } from 'redux';

const API_ENDPOINT = 'https://api.github.com'

// DEVELOPMENT ADDRESS
const HOME_URL = "http://localhost:1234/#/";
const REDIRECT_URI = "http://localhost:1234/#/";

// PRODUCTION ADDRESS
// const HOME_URL = 'https://robjleonard.github.io/';
// const REDIRECT_URI = 'https://robjleonard.github.io/';



function* handleFetchToken(action: AnyAction) {
  try {
    // To call async functions, use redux-saga's `call()`.
    //const res = yield call(callApi, 'get', AUTH_API_ENDPOINT, action.payload)

    const res = yield fetch('https://git-access-trinity.herokuapp.com/authenticate/' + action.payload)
      .then(res => res.json())

    if (res.error) {
      yield put(fetchError(res.error))
    } else {
      yield put(fetchTokenSuccess(res.token))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err.stack!))
    } else {
      yield put(fetchError('An unknown error occured.'))
    }
  }
}

function* handleFetchUser(action: AnyAction) {
  try {
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(callApi, 'get', API_ENDPOINT, '/user?access_token=' + action.payload)

    if (res.error) {
      yield put(fetchError(res.error))
    } else {
      yield put(fetchUserSuccess(res))
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err.stack!))
    } else {
      yield put(fetchError('An unknown error occured.'))
    }
  }
}

// This is our watcher function. We use `take*()` functions to watch Redux for a specific action
// type, and run our saga, for example the `handleFetch()` saga above.
function* watchFetchTokenRequest() {
  yield takeEvery(IUsersActionTypes.FETCH_TOKEN_REQUEST, handleFetchToken)
}

function* watchFetchUserRequest() {
  yield takeEvery(IUsersActionTypes.FETCH_USER_REQUEST, handleFetchUser)
}

// We can also use `fork()` here to split our saga into multiple watchers.
function* usersSaga() {
  yield all([fork(watchFetchTokenRequest), fork(watchFetchUserRequest)])
}

export default usersSaga
