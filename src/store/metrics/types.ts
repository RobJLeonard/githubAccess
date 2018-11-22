


export const enum MetricsActionTypes {
  CHANGE_USERNAME = '@@metrics/CHANGE_USERNAME',
  LOAD_REPOS = '@@metrics/LOAD_REPOS',
  LOAD_REPOS_SUCCESS = '@@metrics/LOAD_REPOS_SUCCESS',
  FETCH_ERROR = '@@metrics/FETCH_ERROR'
}


export interface MetricsPageState {
  readonly loading: boolean
  readonly data: any[]
  readonly errors?: string
  readonly username: string
}
