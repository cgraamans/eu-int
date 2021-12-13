// https://www.section.io/engineering-education/node-authentication-api/

import express from "express";
import bcrypt from "bcrypt";

const route = express.Router();

route.post('/signup', (req, res) => {

    console.log("SIGNUP");

});

route.get('/login', (req, res) => {
    console.log(req);
    console.log("LOGIN");
    res.status(200).json({dt:(new Date()).getTime()});
});

route.post('/delete', (req, res) => {

    console.log("DELETE");

});

route.post('/logout', (req, res) => {

    console.log("LOGOUT");

});

export {route};