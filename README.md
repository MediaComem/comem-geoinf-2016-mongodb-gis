# Comem+ GeoInf 2016 MongoDB GIS

**MongoDB GIS exercises**



## Getting started

* Install [Git](https://git-scm.com/downloads)

* Install [Node.js 6.x](https://nodejs.org/en/)

* Install and run [MongoDB 3.x](https://www.mongodb.com/download-center#community)

* Clone this repository:

  ```
  git clone https://github.com/MediaComem/comem-geoinf-2016-mongodb-gis.git
  ```

* Open a terminal in the repository and run the following commands:

  ```
  npm install
  npm start
  ```

* Visit `http://localhost:3000` in your browser.

  *Note: This application requires the browser to support ECMAScript 6.*



## Solving the exercises

Once the application is running, it will tell you which files to edit to complete the exercises.

To avoid having to manually restart the server every time you make a change, install a process monitor like [nodemon](https://github.com/remy/nodemon).
Open a terminal in the repository and run the following commands (you may have to use `sudo` on Mac OS X for the `npm install -g` command):

```
npm install -g nodemon
nodemon bin/www
```

When running like this, the application will automatically restart when you edit a JavaScript file.



## Configuration

* The application runs on `http://localhost:3000` by default.
  Use the `$PORT` environment variable to specify another port to bind to.

* The application connects to the following database by default: `mongodb://localhost:27017/mongodb-gis`.
  Use the `$MONGODB_URI` or `$DATABASE_URL` environment variable to specify another connection URL.
