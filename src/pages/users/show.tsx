import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import Page from '../../components/layout/Page'
import Container from '../../components/layout/Container'

import { ApplicationState, ConnectedReduxProps } from '../../store'
import { User } from '../../store/users/types'
import { fetchUserRequest } from '../../store/users/actions'
import styled, { Theme } from '../../utils/styled'
import LoadingOverlay from '../../components/data/LoadingOverlay'
import LoadingOverlayInner from '../../components/data/LoadingOverlayInner'
import LoadingSpinner from '../../components/data/LoadingSpinner'
import { darken } from 'polished'
import { Themed } from 'react-emotion'

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
  loading: boolean
  user: User
  errors: string
  OAuthToken: string
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface PropsFromDispatch {
  fetchUserRequest: typeof fetchUserRequest
}

interface RouteParams {
  name: string
}

interface State {
  selected?: User
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState &
  PropsFromDispatch &
  RouteComponentProps<RouteParams> &
  ConnectedReduxProps

class ShowUsersPage extends React.Component<AllProps, State> {
  constructor(props: AllProps) {
    super(props)

    this.state = {
      selected: undefined
    }
  }

  public componentDidMount() {
    const { user } = this.props

    if (!user || user.length === 0) {
      this.props.fetchUserRequest(this.props.OAuthToken)
    }
  }

  public render() {
    const { user, loading } = this.props
    const selected = user;

    return (
      <Page>
        <Container>
          <Wrapper>
            {loading && (
              <LoadingOverlay>
                <LoadingOverlayInner>
                  <LoadingSpinner />
                </LoadingOverlayInner>
              </LoadingOverlay>
            )}
            {selected && (
              <UserInfobox>
                <UserInfoboxBlurBackground src={selected.avatar_url} />
                <UserInfoboxInner>
                  <UserInfoboxImage src={selected.avatar_url} />
                  <UserInfoboxHeading>
                    <UserName>{selected.name}</UserName>
                    <UserDetails>
                      Company: {selected.company || "No company"} - <span><a href={selected.url} >Github Link</a></span>
                    </UserDetails>
                  </UserInfoboxHeading>
                  <UserStats>
                    <UserStatsInner>
                      <StatAttribute attr="Public Repos" isPrimaryAttr={true}>
                        Public Repos
                        <Bullet attr="Public Repos" /> {selected.public_repos || 0}
                      </StatAttribute>
                      <StatAttribute attr="Followers" isPrimaryAttr={false}>
                        Followers
                        <Bullet attr="Followers" /> {selected.followers || 0}
                      </StatAttribute>
                      <StatAttribute attr="Following" isPrimaryAttr={false}>
                        Following
                        <Bullet attr="Following" /> {selected.following || 0}
                      </StatAttribute>
                      <StatAttribute attr="Disk Usage" isPrimaryAttr={false}>
                        Disk Usage
                        <Bullet attr="Disk Usage" /> {selected.disk_usage || 0}
                      </StatAttribute>
                    </UserStatsInner>
                  </UserStats>
                </UserInfoboxInner>
                <UserInfoboxInner>
                  {selected.bio}
                </UserInfoboxInner>
              </UserInfobox>
            )}
          </Wrapper>
        </Container>
      </Page>
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
  OAuthToken: users.OAuthToken
})

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUserRequest: (access_token: string) => dispatch(fetchUserRequest(access_token))
})

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowUsersPage)

const Wrapper = styled('div')`
  position: relative;
`

const UserInfobox = styled('div')`
  position: relative;
  background: rgba(0, 0, 0, 0.9);
  overflow: hidden;
  border-radius: 8px;
  color: ${props => darken(0.25, props.theme.colors.white)};
`

const UserInfoboxBlurBackground = styled('img')`
  position: absolute;
  top: -12.5%;
  left: -12.5%;
  width: 125%;
  height: 125%;
  filter: blur(25px);
  object-fit: cover;
  opacity: 0.35;
  background-repeat: no-repeat;
  z-index: 1;
`

const UserInfoboxInner = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 3rem;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 125px inset;
  z-index: 2;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: row;
  }
`

const UserInfoboxImage = styled('img')`
  display: block;
  flex-shrink: 0;
  width: 180px;
  height: 128px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 12px 32px;
  object-fit: cover;
  border-radius: 16px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.3);
  border-image: initial;
`

const UserInfoboxHeading = styled('div')`
  flex: 1 1 100%;
  margin: 1.5rem 0 0;
  text-align: center;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    margin: 0 1.5rem;
    text-align: left;
  }
`

const UserName = styled('h1')`
  margin: 0;
  color: ${props => props.theme.colors.white};
  font-weight: 500;
`

const UserDetails = styled('p')`
  margin: 0.5rem 0 0;
  color: ${props => props.theme.colors.white};
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;

  & span {
    color: ${props => darken(0.25, props.theme.colors.white)};
  }
`

const UserStats = styled('div')`
  display: block;
  max-width: 500px;
  margin: 1.5rem 0 0;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 8px;
  padding: 12px;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    margin: 0;
    flex: 1 0 340px;
  }
`

const UserStatsInner = styled('div')`
  display: flex;
`

interface StatAttributeProps {
  attr: string
  isPrimaryAttr?: boolean
}

const StatAttribute = styled('div')`
  display: flex;
  align-items: center;
  flex: 1 1 0;
  padding: 0 1rem;
  font-size: 0.8rem;
  color: ${(props: Themed<StatAttributeProps, Theme>) =>
    props.isPrimaryAttr && props.theme.colors.attrs[props.attr]};
`

interface BulletProps {
  attr: string
}

const Bullet = styled('div')`
  flex-shrink: 0;
  height: 0.5rem;
  width: 0.5rem;
  margin-right: 8px;
  border-radius: 50%;
  background-color: ${(props: Themed<BulletProps, Theme>) => props.theme.colors.attrs[props.attr]};
`
