# TaskApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## App structure and infos

I've used Angular 16 to do this application. I've opted for a classic structure. Defining some classic routes and some that load component in 'lazy loading'. This to make the app lighter. I've also created some reusable components and used the parent&child tool to pass
data between components with a relation. I wrote the business logic in servers, each server has a specified component and with d.i. is possible to use its methods.
I made some reactiveforms too, and handled http requests with observables. Some times i've needed to use BehaviorSubjects too. There's a logic of authentication, the possibility to turn on and off the light mode, the translation of the entire application, the skeleton component, quill component, spinner and so on.
