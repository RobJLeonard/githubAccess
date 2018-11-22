import { combineReducers, Dispatch, Action, AnyAction } from 'redux'
import { all, fork } from 'redux-saga/effects'

import { LayoutState, layoutReducer } from './layout'

import usersSaga from './users/sagas';
import { usersReducer } from './users/reducers';
import { IUsersPageState } from './users/types';

import metricSaga from './metrics/sagas';
import { metricsReducer } from './metrics/reducer';
import { MetricsPageState } from './metrics/types'

// The top-level state object
export interface ApplicationState {
  layout: LayoutState
  users: IUsersPageState
  metrics: MetricsPageState
}

// Additional props for connected React components. This prop is passed by default with `connect()`
export interface ConnectedReduxProps<A extends Action = AnyAction> {
  dispatch: Dispatch<A>
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const rootReducer = combineReducers<ApplicationState>({
  layout: layoutReducer,
  users: usersReducer,
  metrics: metricsReducer
})

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
export function* rootSaga() {
  yield all([fork(usersSaga), fork(metricSaga)])
}
