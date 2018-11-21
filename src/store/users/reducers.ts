import { Reducer } from 'redux'
import { IUsersPageState, IUsersActionTypes } from './types'

// Type-safe initialState!
const initialState: IUsersPageState = {
    user: undefined,
    errors: undefined,
    loading: false,
    authenticated: false,
    OAuthToken: undefined,
}

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<IUsersPageState> = (state = initialState, action) => {
    switch (action.type) {
        case IUsersActionTypes.FETCH_TOKEN_REQUEST: {
            return { ...state, loading: true }
        }
        case IUsersActionTypes.FETCH_USER_REQUEST: {
            return { ...state, loading: true }
        }
        case IUsersActionTypes.FETCH_TOKEN_SUCCESS: {
            return { ...state, loading: false, authenticated: true, OAuthToken: action.payload }
        }
        case IUsersActionTypes.FETCH_USER_SUCCESS: {
            return { ...state, loading: false, user: action.payload }
        }
        case IUsersActionTypes.FETCH_ERROR: {
            return { ...state, loading: false, errors: action.payload }
        }
        default: {
            return state
        }
    }
}

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as usersReducer }
