export interface User extends ApiResponse {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable: boolean
  bio: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: Date
  updated_at: Date
  total_private_repos: number
  owned_private_repos: number
  private_gists: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    private_repos: number
    collaborators: number
  }
}

export interface UserPublic extends ApiResponse {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable: boolean
  bio: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: Date
  updated_at: Date
}

export interface Friend extends ApiResponse {
  login: string
  id: number
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}



// This type is basically shorthand for `{ [key: string]: any }`. Feel free to replace `any` with
// the expected return type of your API response.
export type ApiResponse = Record<string, any>


export interface IUsersPageState {
  readonly errors?: string
  readonly loading: boolean
  readonly authenticated: boolean
  readonly OAuthToken?: string
  readonly user?: User
  readonly friends?: Friend[]
}

export const enum IUsersActionTypes {
  FETCH_TOKEN_REQUEST = '@@users/FETCH_TOKEN_REQUEST',
  FETCH_USER_REQUEST = '@@users/FETCH_USER_REQUEST',
  FETCH_FRIENDS_REQUEST = '@@users/FETCH_FRIENDS_REQUEST',
  FETCH_TOKEN_SUCCESS = '@@users/FETCH_TOKEN_SUCCESS',
  FETCH_USER_SUCCESS = '@@users/FETCH_USER_SUCCESS',
  FETCH_FRIENDS_SUCCESS = '@@users/FETCH_FRIENDS_SUCCESS',
  FETCH_ERROR = '@@users/FETCH_ERROR'
}
