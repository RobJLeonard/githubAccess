import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { MetricsActionTypes } from './types'
import { fetchError, fetchReposSuccess } from './actions'
import callApi from '../../utils/callApi'
import { AnyAction } from 'redux';

const API_ENDPOINT = 'https://api.github.com'

// DEVELOPMENT ADDRESS
const HOME_URL = "http://localhost:1234/#/";
const REDIRECT_URI = "http://localhost:1234/#/";

// PRODUCTION ADDRESS
// const HOME_URL = 'https://robjleonard.github.io/';
// const REDIRECT_URI = 'https://robjleonard.github.io/';

function* handleFetchRepos(action: AnyAction) {
  try {
    const username = action.payload
    // To call async functions, use redux-saga's `call()`.
    const res = yield call(callApi, 'get', API_ENDPOINT, `/users/${username}/repos?type=all&sort=updated`)

    if (res.message) {
      yield put(fetchError(res.message))
    } else {
      yield put(fetchReposSuccess(res))
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
function* watchFetchReposRequest() {
  yield takeEvery(MetricsActionTypes.LOAD_REPOS, handleFetchRepos)
}



// We can also use `fork()` here to split our saga into multiple watchers.
function* usersSaga() {
  yield all([fork(watchFetchReposRequest)])
}

export default usersSaga
