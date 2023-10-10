# Issue tracker

## Available Scripts

In the project directory, you can run:

### `npm start:production`

Runs the app in the production mode. (app needs to be built first)

### `npm run dev`

Runs the app in the development mode with nodemon watching for code changes.

### `npm run build`

Builds the app for production to the `dist` folder. It also generates needed types.

### `generate-openapi-types`

Generates types frop openapi.yaml file.

## Linting and formating

Application uses `eslint` for linting and `prettier` for formating. Project has configured `husky` pre-commit command for this so please run `npm run prepare` command to install `husky`.
