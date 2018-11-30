import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import Page from '../../components/layout/Page'
import Container from '../../components/layout/Container'

import { ApplicationState, ConnectedReduxProps } from '../../store'
import { Repo, Stats } from '../../store/metrics/types'
import { fetchRepoStats } from '../../store/metrics/actions'
import styled, { Theme } from '../../utils/styled'
import LoadingOverlay from '../../components/data/LoadingOverlay'
import LoadingOverlayInner from '../../components/data/LoadingOverlayInner'
import LoadingSpinner from '../../components/data/LoadingSpinner'
import { darken } from 'polished'
import { Themed } from 'react-emotion'

import Graph from '../../components/Graph';

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
  loading: boolean
  repos: Repo[]
  errors: string
  username: string
  statsLoading: boolean
  stats: any
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface PropsFromDispatch {
  fetchRepoStats: typeof fetchRepoStats
}

interface RouteParams {
  name: string
}


// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState &
  PropsFromDispatch &
  RouteComponentProps<RouteParams> &
  ConnectedReduxProps

interface State {
  graphData?: []
}

class ShowRepoPage extends React.Component<AllProps, State> {

  componentDidMount() {
    this.props.fetchRepoStats(this.props.username, this.props.match.params.name);
    this.state = {
      graphData: []
    }
  }


  commitData() {

    const { stats } = this.props

    var commitCounts = {};

    // Loop over every commit
    for (var commit in stats) {

      var commitDate = new Date(stats[commit].commit.author.date.substring(0, 10))

      // If commit count exists for that day, increment
      if (commitCounts[commitDate]) {
        commitCounts[commitDate]++;
      } else {
        commitCounts[commitDate] = 1;
      }
    }

    // Get data for commit graph
    let graphData = [];

    // Convert commit stats to key:date, val:count object
    for (var node in commitCounts) {
      graphData.push({ x: new Date(node), y: commitCounts[node] })
    }

    return graphData;



  }

  public render() {
    const { statsLoading, match, repos, stats } = this.props


    const selected = repos.find(Repo => Repo.name === match.params.name)

    let graphData = this.commitData();

    return (
      <Page>
        <Container>
          <MetricWrapper>
            {statsLoading && (
              <LoadingOverlay>
                <LoadingOverlayInner>
                  <LoadingSpinner />
                </LoadingOverlayInner>
              </LoadingOverlay>
            )}
            {stats !== undefined && stats.length !== 0 &&
              (
                <div >
                  {selected && (
                    <UserInfobox >
                      <UserInfoboxBlurBackground src={selected.owner.avatar_url} />
                      <UserInfoboxInner>
                        <UserInfoboxImage src={selected.owner.avatar_url} />
                        <UserInfoboxHeading>
                          <UserName>{selected.name}</UserName>
                          <UserDetails>
                            {selected.full_name}
                          </UserDetails>

                          <UserDetails>
                            Owner: {selected.owner.login}
                          </UserDetails>
                          <UserDetails>
                            <span><a href={selected.html_url} >Github Link</a></span>
                          </UserDetails>
                          <UserDetails>
                            <span><a href={selected.homepage} >Homepage</a></span>
                          </UserDetails>
                          <UserDetails>
                            <span><a href={selected.languages_url} >{selected.language}</a></span>
                          </UserDetails>
                        </UserInfoboxHeading>

                        <UserStats>
                          <UserStatsInner>
                            <StatAttribute attr="Stargazers" isPrimaryAttr={true}>
                              Stargazers
                             <Bullet attr="Stargazers" /> {selected.stargazers_count || 0}
                            </StatAttribute>
                            <StatAttribute attr="Forks Count" isPrimaryAttr={false}>
                              Forks Count
                             <Bullet attr="Forks Count" /> {selected.forks_count || 0}
                            </StatAttribute>
                          </UserStatsInner>
                          <UserStatsInner>
                            <StatAttribute attr="Disk Usage" isPrimaryAttr={false}>
                              Disk Usage
                             <Bullet attr="Disk Usage" /> {selected.size || 0}
                            </StatAttribute>
                            <StatAttribute attr="Open Issues" isPrimaryAttr={false}>
                              Open Issues
                             <Bullet attr="Open Issues" /> {selected.open_issues_count || 0}
                            </StatAttribute>
                          </UserStatsInner>
                        </UserStats>




                      </UserInfoboxInner>
                      <UserInfoboxInner>
                        {selected.description}
                        <Graph graphData={graphData} />
                      </UserInfoboxInner>
                    </UserInfobox>
                  )}

                </div>
              )}
          </MetricWrapper>
        </Container>
      </Page >
    )
  }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ metrics }: ApplicationState) => ({
  loading: metrics.loading,
  errors: metrics.errors,
  repos: metrics.repos,
  username: metrics.username,
  stats: metrics.stats,
  statsLoading: metrics.statsLoading
})

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchRepoStats: (username: string, repo_name: string) => { const payload = { username: username, repo_name: repo_name }; dispatch(fetchRepoStats(payload)) }
})

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowRepoPage)

const MetricWrapper = styled('div')`
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
  height: 192px;
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
