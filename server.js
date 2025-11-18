import express, { response } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import register from './controllers/register.js';
import signin from './controllers/signin.js';
import profile from './controllers/profile.js';
import { handleImage, handleApiCall } from './controllers/image.js';

// connect to database
const db = knex({
    client: 'pg',
    connection: {
        host: process.env["DB-HOSTNAME"],
        port: process.env["DB-PORT"],
        user: process.env["DB-USERNAME"],
        password: process.env["DB-PASSWORD"],
        database: process.env["DB-NAME"]
    },
});
// create express instance
const app = express();

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => { res.send('success')})
app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt))
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))
app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db))
app.put('/image', (req, res) => handleImage(req, res, db)) 
app.post('/imageurl', (req, res) => {handleApiCall(req, res)})

// control which port express is running on
app.listen(process.env.PORT, () => {
    console.log("process.env.port: ", process.env.PORT);
})

// --- Possible routes needed on server (API Planning)
/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = newUser
/profile/:userId --> GET = user
/image --> PUT --> user
*/