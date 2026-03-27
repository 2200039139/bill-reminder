import express from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser'

import healthCheck from './routes/healthcheck.routes.js';
import auth from './routes/auth.routes.js';
import tenant from './routes/tenant.routes.js';
import user from './routes/user.routes.js'

const app = express();

//basic configuration
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
    methods : ['GET', 'POST', 'PUT' , 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders : ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use(express.static('public')) 
app.use(CookieParser())

app.use('/api/v1/healthcheck', healthCheck);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);
app.use("/api/v1/tenant", tenant);

export default app;