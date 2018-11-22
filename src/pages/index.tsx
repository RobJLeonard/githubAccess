import * as React from 'react'
import Page from '../components/layout/Page'
import Container from '../components/layout/Container'
import styled from '../utils/styled'

export default () => (
  <Page>
    <Container>
      <PageContent>
        <h1>Welcome!</h1>
        <p>
          This website is my submission for my Software Engineering Module CS3012
          Individual Project.
          </p>
        <p>
          The project brief was to write a piece of software to interrogate the <a href="https://developer.github.com/v3/" target="blank" rel="noopener noreferrer">
            GitHub REST API v3
          </a>,
          The first step was to simply connect to the api. I decided to implement OAuthentication
          for my solution. In hind sight it was neccessary but it does give slightly more information
          on the authenticated user.
        </p>
        <p>
          The next step was to query some software engineering metrics from the api, lines of code for example.
          The idea is to visualise the data in some interesting and meaningful way to give insights into a project's
          code repository.
        </p>
        <p>
          This site was built using react and redux. React for a dynamic and interactive UI and Redux for
          state management e.g. storing data received from the api.
          The whole site was developed using Typescript which is a strictly typed superset of Javascript that compiles
          to plain javascript for great portability.
        </p>
        <p>Please report any bugs to the <a href="https://github.com/RobJLeonard/githubAccess">github repository</a></p>
      </PageContent>
    </Container>
  </Page>
)

const PageContent = styled('article')`
  max-width: ${props => props.theme.widths.md};
  margin: 0 auto;
  line-height: 1.6;

  a {
    color: ${props => props.theme.colors.brand};
  }

  h1,
  h2,
  h3,
  h4 {
    margin-bottom: 0.5rem;
    font-family: ${props => props.theme.fonts.headings};
    line-height: 1.25;
  }
`
