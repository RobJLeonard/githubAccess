
import { action } from 'typesafe-actions'
import { IUsersActionTypes, User } from './types'


export const fetchTokenRequest = (code: string | string[]) => action(IUsersActionTypes.FETCH_TOKEN_REQUEST, code)

export const fetchUserRequest = (access_token: string) => action(IUsersActionTypes.FETCH_USER_REQUEST, access_token)

// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly as well.
export const fetchTokenSuccess = (token: string) => action(IUsersActionTypes.FETCH_TOKEN_SUCCESS, token)

export const fetchUserSuccess = (user: User) => action(IUsersActionTypes.FETCH_USER_SUCCESS, user)

export const fetchError = (message: string) => action(IUsersActionTypes.FETCH_ERROR, message)
