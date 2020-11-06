# Future Border and Immigration System (FBIS) Customer Contact Form (CCF)

A [Home Office Forms (HOF)](https://ukhomeofficeforms.github.io/hof-guide/documentation/#getting-started) app for users to submit technical queries relating to the ID Check app, viewing or proving immigration status, or updating immigration account details. Queries are sent to support services for resolution using [GOV.UK Notify](https://www.notifications.service.gov.uk/).

## Set up

### Set environment variables

To run the app using the notprod Notify test service, you will need to:

1. Get the notprod API key securely from a colleague
2. Ask a colleague to add you to the `Future Border and Immigration System Customer Contact Form - notprod` Notify service
3. Get the test SRC casework email. This is the email address for `FBIS CCF Developers` on the [Notify service team](https://www.notifications.service.gov.uk/services/7c8d0248-51b8-4795-b920-3ff84efb7faf/users)
4. Get the query template id from the [template page](https://www.notifications.service.gov.uk/services/7c8d0248-51b8-4795-b920-3ff84efb7faf/templates/837dc8ac-6abf-4f6a-9f0c-57a28ea7f43c)

Then add the values retrieved above to your environment variables:

```.env
export NOTIFY_KEY=[API_KEY]
export SRC_CASEWORK_EMAIL=[FBIS_CCF_DEVELOPERS_EMAIL]
export TEMPLATE_QUERY=[QUERY_TEMPLATE_ID]
```

### Install prerequisites

Install Node version manager:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
nvm --version
```

Install and use Node version 12 or above:
```bash
nvm install 12
nvm use 12
nvm version
```

Install node package dependencies:
```bash
npm i
```

Install brew:

[Brew installation instructions](https://brew.sh/)

Install redis:

```bash
brew install redis
```

Start redis:

```bash
brew services start redis
```

### Run the app

Any of the following commands will start the app. `npm run dev` starts the app in 'watch' mode, so it will update as you make code changes. `npm run debug` starts the app with Node dev tools available in the Chrome browser, accessible on the [Chrome inspect page](chrome://inspect/#devices).

```bash
npm start
npm run dev
npm run debug
```

## Test

### Unit tests and linting

Unit tests use [Mocha](https://mochajs.org/), [Sinon](https://sinonjs.org/) for stubs, [Chai](https://www.chaijs.com/) for assertions, and [Proxyquire](https://github.com/thlorenz/proxyquire#readme) for dependency mocking. Linting uses [ESLint](https://eslint.org/). Run the following command from the root directory to run linting and unit tests:

```bash
npm test
```

### Run automated UI tests

Watch this space.
