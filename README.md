## Overview

This is a stupid implementation backend for twitter features

## Scripts

In the project directory, you can run:

### Install

```bash
$ npm install

or

$ yarn
```

### Run

```bash
$ npm run start

or

$ yarn start

```

Runs the app in the development mode.\
Open [http://localhost:3000/api/docs](http://localhost:3000/api/docs) to view it in the browser.

### Build

```bash
$ npm run build

or

$ yarn build

```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Docker

You can run the app in the development mode with Docker.

```bash
$ docker build -t [Put_whatever_name_you_want_here] .

$ docker run --rm  -p 3000:80 [Put_whatever_name_you_want_here]
```