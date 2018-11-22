import { Reducer } from 'redux'
import { MetricsPageState, MetricsActionTypes } from './types'

// Type-safe initialState!
const initialState: MetricsPageState = {
  data: [],
  errors: undefined,
  loading: false,
  username: ""
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<MetricsPageState> = (state = initialState, action) => {
  switch (action.type) {
    case MetricsActionTypes.CHANGE_USERNAME: {
      return { ...state, username: action.payload.replace(/@/gi, '') }
    }
    case MetricsActionTypes.LOAD_REPOS: {
      return { ...state, loading: true }
    }
    case MetricsActionTypes.LOAD_REPOS_SUCCESS: {
      return { ...state, loading: false, data: action.payload, errors: undefined }
    }
    case MetricsActionTypes.FETCH_ERROR: {
      return { ...state, loading: false, errors: action.payload, data: [] }
    }
    default: {
      return state
    }
  }
}

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as metricsReducer }
