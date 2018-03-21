# 🖥 `cj-scripts`

**🚧 UNDER CONSTRUCTION 🚧**

A CLI for computer gangsters.

## What is it?

`cj-scripts` is a tool for linting, formatting, testing, building, and serving (with server-side-rendering) my React projects. It's heavily inspired by Kent Dodds' [kcd-scripts](https://github.com/kentcdodds/kcd-scripts).

## How do I use it?

* Install it: `npm i cj-scripts`
* Run some commands (probably from your `package.json` scripts):
  * `cj-scripts start`
  * `cj-scripts test`
  * `cj-scripts build`
  * `cj-scripts start-prod`

## What does it do?

* `cj-scripts start`
  * Fires up `webpack-dev-server`
* `cj-scripts test`
  * Run `jest` in watch mode
* `cj-scripts build`
  * Creates a `/build` directory full of compiled stuff
* `cj-scripts start-prod`
  * Runs a Node server that server-renders the crap out of your React app
