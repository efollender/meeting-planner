import koa    from 'koa';
import serve  from 'koa-static';
import cors 	from 'koa-cors';
import config from '../config';
import spotify from './middleware/node-spotify';

const paths = config.get('utils_paths');
const app   = koa();

// ------------------------------------
// Response Time Header and Logging
// ------------------------------------
app.use(require('./middleware/gzip')());
app.use(require('./middleware/response-time'));
app.use(require('./middleware/logger'));

//CORS
app.use(cors({
	origin: true
}));
// ------------------------------------
// Static File Middleware
// ------------------------------------
app.use(serve(paths.dist('client'), {
  index : '__IGNORE_INDEX.HTML__'
}));

// ------------------------------------
// View Rendering
// ------------------------------------
function getInitialState () {
  const counter = this.request.query.counter ?
    parseInt(this.request.query.counter) : 0;

  return new Promise(res => res({ counter }));
}

app.use(require('./middleware/render-route')(getInitialState));

export default app;
