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
        host: DB-HOSTNAME,
        port: DB-PORT,
        user: DB-USERNAME,
        password: DB-PASSWORD,
        database: DB-NAME,
    },
});
// create express instance
const app = express();

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => { res.send('success')})
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', handleImage(db)) 
app.post('/imageurl', (req, res) => {handleApiCall(req, res)})

// control which port express is running on
app.listen(3001, () => {
    console.log('app is running on port 3001');
})

// --- Possible routes needed on server (API Planning)
/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = newUser
/profile/:userId --> GET = user
/image --> PUT --> user
*/