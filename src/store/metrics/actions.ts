import { action } from 'typesafe-actions'
import { MetricsActionTypes } from './types'

// Here we use the `action` helper function provided by `typesafe-actions`.
// This library provides really useful helpers for writing Redux actions in a type-safe manner.
// For more info: https://github.com/piotrwitek/typesafe-actions
export const changeUsername = (username: string) => action(MetricsActionTypes.CHANGE_USERNAME, username)

export const fetchRepos = (username: string) => action(MetricsActionTypes.LOAD_REPOS, username)

export const fetchReposSuccess = (repos: any) => action(MetricsActionTypes.LOAD_REPOS_SUCCESS, repos)
export const fetchError = (message: string) => action(MetricsActionTypes.FETCH_ERROR, message)

