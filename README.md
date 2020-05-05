# express-starter

Example starter project with Node v14+, Express.js, Handlebars, Sass, and asset pipeline via Gulp. The goal is to use the most mainstream libraries for stability and ease of development.

### Usage:

```
git clone https://github.com/effinggames/express-starter.git && cd express-starter
npm install && npm run build && npm start
```

Env variables:  
`NODE_ENV`: Set to 'production' for multi-core + template caching.  
`PORT`: Sets the port the server listens on. <Defaults to 8000>

NPM Tasks:  
`npm start`: Starts the server.  
`npm run build`: Compiles, minifies, and compresses the assets (for production).  
`npm run watch`: Sets everything up for development mode. Starts nodemon and compiles + watches the js, css, and image files for changes to recompile.
