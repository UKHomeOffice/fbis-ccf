# Future Border and Immigration System (FBIS) Customer Contact Form (CCF)

A [Home Office Forms (HOF)](https://ukhomeofficeforms.github.io/hof-guide/documentation/#getting-started) app for users to submit technical queries relating to the ID Check app, viewing or proving immigration status, or updating immigration account details. Queries are sent to support services for resolution using [GOV.UK Notify](https://www.notifications.service.gov.uk/).

## Contents

* [Linux and OSX set up](#linux-and-osx-set-up)
    * [Set environment variables](#set-environment-variables)
    * [Install pre-requisites](#install-prerequisites)
    * [Run the app](#run-the-app)
* [Windows set up](#windows-set-up)
    * [Safely clone this repo](#safely-clone-this-repo)
    * [Set environment variables](#set-environment-variables-1)
    * [Install Docker Desktop for Windows](#install-docker-desktop-for-windows)
    * [Run the app](#run-the-app-1)
* [Test](#test)
    * [Unit tests and linting](#unit-tests-and-linting)
    * [Testing email failures with the mock Notify client](#testing-email-failures-with-the-mock-notify-client)
    * [Automated UI tests](#automated-ui-tests)
    * [Test reporters](#test-reporters)

## Linux and OSX set up

### Set environment variables

To run the app using the notprod Notify test service, you will need to:

1. Get the notprod test API key securely from a colleague
2. Ask a colleague to add you to the `Future Border and Immigration System Customer Contact Form - notprod` Notify service
3. Get the test SRC casework email. This is the email address for `FBIS CCF Developers` on the [Notify service team](https://www.notifications.service.gov.uk/services/7c8d0248-51b8-4795-b920-3ff84efb7faf/users)
4. Get the template ids from the [template page](https://www.notifications.service.gov.uk/services/7c8d0248-51b8-4795-b920-3ff84efb7faf/templates/837dc8ac-6abf-4f6a-9f0c-57a28ea7f43c)

Then add the values retrieved above to your bash profile:

```.env
export NOTIFY_KEY=[API_KEY]
export SRC_CASEWORK_EMAIL=[FBIS_CCF_DEVELOPERS_EMAIL]
export FEEBACK_EMAIL=[FBIS_CCF_DEVELOPERS_EMAIL]
export TEMPLATE_QUERY=[QUERY_TEMPLATE_ID]
export TEMPLATE_FEEDBACK=[FEEDBACK_TEMPLATE_ID]
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

Any of the following commands will start the app, accessible at `localhost:8080`. `npm run dev` starts the app in 'watch' mode, so it will update as you make code changes. `npm run debug` starts the app with Node dev tools available in the Chrome browser, accessible on the [Chrome inspect page](chrome://inspect/#devices).

```bash
npm start
npm run dev
npm run debug
```

To run the app using a mock Notify client (required for automated UI testing), use this command:

```bash
npm run start:mock
```

To view the app with content for users outside of the UK, navigate to `localhost:8080/question?outside-UK`.

## Windows set up

On windows, it is recommended to run the app in a Docker container.

### Safely clone this repo

Before you clone this repo on windows, run the following command:

```bash
git config --global core.autocrlf false
```

This prevents git from replacing Unix line break characters with Windows line break characters when you clone the repo, because windows line breaks cause problems in Docker.

If you have already cloned the repo, delete it, then run this command and clone it again.

### Set environment variables

To run the app using the notprod Notify test service, you will need to:

1. Get the notprod API key securely from a colleague
2. Ask a colleague to add you to the `Future Border and Immigration System Customer Contact Form - notprod` Notify service
3. Get the test SRC casework email. This is the email address for `FBIS CCF Developers` on the [Notify service team](https://www.notifications.service.gov.uk/services/7c8d0248-51b8-4795-b920-3ff84efb7faf/users)
4. Get the template ids from the [template page](https://www.notifications.service.gov.uk/services/7c8d0248-51b8-4795-b920-3ff84efb7faf/templates/837dc8ac-6abf-4f6a-9f0c-57a28ea7f43c)

Search for 'environment variables' in the windows toolbar and click 'Edit the system environment variables'. In the System Properties dialogue, select 'Environment Variables'. Then, in the environment variable dialogue, add the following as system variables:

```.env
name NOTIFY_KEY         value [API_KEY]
name SRC_CASEWORK_EMAIL value [FBIS_CCF_DEVELOPERS_EMAIL]
name TEMPLATE_QUERY     value [QUERY_TEMPLATE_ID]
name FEEBACK_EMAIL      value [FBIS_CCF_DEVELOPERS_EMAIL]
name TEMPLATE_FEEDBACK  value [FEEDBACK_TEMPLATE_ID]
```

### Install Docker Desktop for Windows

* [Install Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows/)
* Restart your computer after installation
* Run Docker Desktop
* If prompted, [update the WSL 2 Linux kernel](https://docs.microsoft.com/en-gb/windows/wsl/wsl2-kernel)

### Run the app

With Docker desktop running, use the following command in the root directory to run the app:

```bash
docker-compose up -d
```

The app is ready to access on `localhost:8080` when you see logs like the following:

```bash
Creating fbis-ccf_redis_1 ... done
Creating fbis-ccf_app_1 ... done
Creating fbis-ccf_nginx-proxy_1 ... done
```

To stop the app, use following command:

```bash
docker-compose down
```

To re-build and run the app after pulling an update to the source code, use the following command:
```bash
docker-compose up -d --build --force-recreate
```

## Test

This test documentation assumes you are using Linux or OSX.

### Unit tests and linting

Unit tests use [Mocha](https://mochajs.org/), [Sinon](https://sinonjs.org/) for stubs, [Chai](https://www.chaijs.com/) for assertions, and [Proxyquire](https://github.com/thlorenz/proxyquire#readme) for dependency mocking. Linting uses [ESLint](https://eslint.org/).

`test/test-helpers.js` is a helper script that makes Sinon and Chai's `expect` keyword available globally.

Use the following command from the root directory to run linting and unit tests:

```bash
npm test
```

To run linting and unit tests separately, use the following commands:

```bash
npm test:lint
npm test:unit
```

### Testing email failures with the mock Notify client

`test/ui/mock-notify-client.js` is a simple mock Notify client that can be used for manual or automated testing of email failures.

To run the app using the mock client, use the following command:

```bash
npm run start:mock
```

To force an email failure, enter `perm-fail@simulator.notify` into the email field of the form. This also works for the feedback page.

### Automated UI tests

UI tests use [Playwright](https://playwright.dev/#version=v1.6.1) for browser automation and are run with Mocha using Sinon for stubs and Chai for assertions as above. Tests can be run in chromium, firefox, or webkit browser engines.

`test/ui/ui-test-helpers.js` is a helper script that initialises the `browser` and `page` variables before each test run and makes them available globally. It also provides the following helper functions for common test interactions:

```javascript
submitPage()                    // submit the page and wait for the next page state to load
getErrorSummaries()             // get an array of element handles containing all error summary elements
getErrorMessages()              // get an array of element handdles containing all error message elements
```

To test against all browsers, use one of the following commands:

```bash
npm run test:ui                 // requires app to be running with mock notify client
npm run test:ui:server          // starts the app with mock notify clients, runs tests, terminates the app
```

To test against individual browsers, use one of the following commands:

```bash
npm run test:ui:chromium        // requires app to be running with mock notify client
npm run test:ui:firefox         // requires app to be running with mock notify client
npm run test:ui:webkit          // requires app to be running with mock notify client
```

All automated UI test scripts require that redis is already running.

#### Naming convention

UI tests are linked to their requirement ID and Jira ticket number via describe text:

```javascript
describe('/route', () => {

  describe('FR-FEE-1 (FBISCC-01)', () => {

    it('should [insert desired functionality]', async()=> {
      // some test code for a business requirement
    });

  });

});
```

Where there is no requirement ID, i.e. when testing dev tasks that are not captured by business requirements, replace the requirement id with 'DEV':

```javascript
describe('/route', () => {

  describe('DEV (FBISCC-02)', () => {

    it('should [insert desired functionality]', async()=> {
      // some test code for a dev task, or similar
    });

  });

});
```

### Test reporters

Test reports are generated using [mocha-sonar](https://www.npmjs.com/package/@danmasta/mocha-sonar), [mochawesome](https://www.npmjs.com/package/mochawesome), and [mocha-multi-reporters](https://www.npmjs.com/package/mocha-multi-reporters). Mocha-multi-reporters is required because mocha does not natively support multiple reporters. Mocha-multi-reporters config can be found in the `test/reporter-config` directory.

Mocha-sonar reports can be viewed in the project's [Sonarqube dashboard](https://sonarqube.digital.homeoffice.gov.uk/dashboard?id=fbis-ccf) after each deployment to the dev environment.

Mochawesome generates user-friendly test reports that can be viewed in browser, useful for sharing with stakeholders who are not comfortable reading test reports from terminal logs. Mochawesome reports are not currently persisted as part of the build pipeline, but can be viewed locally in the `test/executions/mochawesome` directory.
