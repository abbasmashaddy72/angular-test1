# Running an Angular Application

## Prerequisites

Before running your Angular application, make sure you have the following installed on your machine:

- [Node.js and npm](https://nodejs.org/): Angular requires Node.js and npm for package management.
- Angular CLI: Install globally via the following command:

    ```
    npm install -g @angular/cli
    ```

## Clone the Repository

Clone your Angular project repository using Git:

```
git clone https://github.com/abbasmashaddy72/angular-test1.git
cd angular-test1
```

## Install Dependencies

Install the project dependencies using npm:

```
npm install
```

## Run the Application
- Use the Angular CLI to serve your application locally:

```
ng serve
```

- By default, this will start the development server, and you can access your Angular application in your web browser at [http://localhost:4200/](http://localhost:4200/).

## Additional Options

- To specify a different port, use the `--port` option:

    ```
    ng serve --port 3000
    ```

- To enable live reload and watch for changes, use the `--open` option:

    ```
    ng serve --open
    ```

- To build your application for production, use the following command:

    ```
    ng build --prod
    ```
Feel free to reach out if you have any questions or encounter issues!
