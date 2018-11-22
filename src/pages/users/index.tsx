import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import * as Url from 'url'

import styled from '../../utils/styled'
import Page from '../../components/layout/Page'
import Container from '../../components/layout/Container'
import DataTable from '../../components/layout/DataTable'
import LoadingOverlay from '../../components/data/LoadingOverlay'
import LoadingOverlayInner from '../../components/data/LoadingOverlayInner'
import LoadingSpinner from '../../components/data/LoadingSpinner'

import { ApplicationState, ConnectedReduxProps } from '../../store'
import { User, Friend } from '../../store/users/types'
import { fetchTokenRequest, fetchUserRequest, fetchFriendsRequest } from '../../store/users/actions'

import { darken } from 'polished';

const CLIENT_ID = "4cfba37be95601c9e08a";

// DEVELOPMENT ADDRESS
const REDIRECT_URI = "http://localhost:1234/#/users";

// PRODUCTION ADDRESS
// const REDIRECT_URI = 'https://robjleonard.github.io/#/users';



// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
  loading: boolean
  user: User
  errors: string
  authenticated: boolean
  OAuthToken: string
  friends: Friend[]
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface PropsFromDispatch {
  fetchTokenRequest: typeof fetchTokenRequest
  fetchUserRequest: typeof fetchUserRequest
  fetchFriendsRequest: typeof fetchFriendsRequest
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps

class UserIndexPage extends React.Component<AllProps> {
  public componentDidMount() {

    let url = Url.parse(window.location.href, true);
    let queryData = url.query;
    const code = queryData.code;
    if (code) {
      console.log('code recieved:' + code);
      this.props.fetchTokenRequest(code);
    }
  }

  public componentDidUpdate() {
    const { OAuthToken, user, friends } = this.props
    if (OAuthToken && user === undefined) {
      this.props.fetchUserRequest(OAuthToken);
      if (friends.length === 0)
        this.props.fetchFriendsRequest(OAuthToken);
    }
  }

  fetchUserInfo = async () => {
    await this.props.fetchUserRequest(this.props.OAuthToken);
  }

  fetchFriendInfo = async () => {
    await this.props.fetchFriendsRequest(this.props.OAuthToken);
  }

  public render() {
    const { authenticated, loading } = this.props;

    return (
      <Page>
        <Container>
          <ButtonWrapper>
            <Button
              style={{
                display: authenticated ? "none" : "inline"
              }}
              href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user&redirect_uri=${REDIRECT_URI}`}
            >
              Login
            </Button>
            <Button
              style={{
                display: authenticated ? "inline" : "none"
              }}
              onClick={this.fetchUserInfo}>
              Refresh User Data
            </Button>
          </ButtonWrapper>
          <TableWrapper>
            {loading && (
              <LoadingOverlay>
                <LoadingOverlayInner>
                  <LoadingSpinner />
                </LoadingOverlayInner>
              </LoadingOverlay>
            )}
            {authenticated && this.renderUserData()}
          </TableWrapper>
          <ButtonWrapper>
            <Button
              style={{
                display: authenticated ? "inline" : "none"
              }}
              onClick={this.fetchFriendInfo}>
              Refresh Friends Data
            </Button>
          </ButtonWrapper>
          <TableWrapper>
            {loading && (
              <LoadingOverlay>
                <LoadingOverlayInner>
                  <LoadingSpinner />
                </LoadingOverlayInner>
              </LoadingOverlay>
            )}
            {authenticated && this.renderFriendsData()}
          </TableWrapper>
        </Container>
      </Page>
    )
  }

  private renderUserData() {
    const { loading, user } = this.props

    return (
      <DataTable columns={['User', 'Public Repos', 'Followers/Following']} widths={['auto', '', '']}>
        {loading &&
          user === undefined && (
            <UserLoading>
              <td colSpan={3}>Loading...</td>
            </UserLoading>
          )}
        {user !== undefined &&
          <tr key={user.id}>
            <UserDetail>
              <UserIcon src={user.avatar_url} alt={user.name} />
              <UserName>
                <Link to={`/users/${user.name}`}>{user.name}</Link>
              </UserName>
            </UserDetail>
            <td>
              {user.public_repos || 0}
            </td>
            <td>{user.followers || 0}/{user.following || 0}</td>
          </tr>
        }
      </DataTable>
    )
  }

  private renderFriendsData() {
    const { loading, friends } = this.props

    return (
      <DataTable columns={['Friends', 'Github', 'Repos']} widths={['auto', '', '']}>
        {loading &&
          friends === undefined && (
            <UserLoading>
              <td colSpan={3}>Loading...</td>
            </UserLoading>
          )}
        {friends !== undefined &&
          friends.map(Friend => (
            <tr key={Friend.id}>
              <UserDetail>
                <UserIcon src={Friend.avatar_url} alt={Friend.login} />
                <UserName>
                  <Link to={`/Users/${Friend.login}`}>{Friend.login}</Link>
                </UserName>
              </UserDetail>
              <td>
                <a href={Friend.html_url}>GitHubLink</a>
              </td>
              <td>{Friend.repos_url}</td>
            </tr>
          ))}
      </DataTable>
    )
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users }: ApplicationState) => ({
  loading: users.loading,
  errors: users.errors,
  user: users.user,
  OAuthToken: users.OAuthToken,
  authenticated: users.authenticated,
  friends: users.friends
})

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchTokenRequest: (code: string) => dispatch(fetchTokenRequest(code)),
  fetchUserRequest: (access_token: string) => dispatch(fetchUserRequest(access_token)),
  fetchFriendsRequest: (access_token: string) => dispatch(fetchFriendsRequest(access_token))
})

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserIndexPage)

const ButtonWrapper = styled('div')`
border-radius: 8px;
  padding: 10px;
  color: ${props => darken(0.25, props.theme.colors.white)};
`

const Button = styled('a')`
position: relative;
margin: 0 auto;
padding: 8px;
`

const TableWrapper = styled('div')`
  position: relative;
  max-width: ${props => props.theme.widths.md};
  margin: 0 auto;
  min-height: 200px;
`

const UserDetail = styled('td')`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const UserIcon = styled('img')`
  width: 32px;
  height: 32px;
`

const UserName = styled('div')`
  flex: 1 1 auto;
  height: 100%;
  margin-left: 1rem;

  a {
    color: ${props => props.theme.colors.brand};
  }
`

const UserLoading = styled('tr')`
  td {
    height: 48px;
    text-align: center;
  }
`
