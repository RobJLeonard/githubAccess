# CS3012 Individual Project Git Access

> This website is my submission for my Software Engineering Module CS3012 Individual Project.

The project brief was to write a piece of software to interrogate the [GitHub REST API v3](https://developer.github.com/v3/)

The first step was to simply connect to the api. I decided to implement OAuthentication for my solution. In hind sight it was neccessary but it does give slightly more information on the authenticated user.

This project was bootstrapped with <http://github.com/sw-yx/create-react-app-parcel>.

The next step was to query some software engineering metrics from the api, lines of code for example. The idea is to visualise the data in some interesting and meaningful way to give insights into a project's code repository.

This site was built using react and redux. React for a dynamic and interactive UI and Redux for state management e.g. storing data received from the api. The whole site was developed using Typescript which is a strictly typed superset of Javascript that compiles to plain javascript for great portability.

## To run my code locally yourself

A Node.js 8.0.0+ setup with [yarn](https://yarnpkg.com/) is recommended.

```bash
# install dependencies
yarn

# ...or if you'd like to use npm instead
npm install

# serve with hot reload at localhost:1234
yarn start

# build for production
yarn build
```
