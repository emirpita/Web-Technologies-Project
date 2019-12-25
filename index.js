// server
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path= require('path');
const url = require('url');

const app = express();

app.use(express.static('public'));

app.get("/rezervacija.html", function (req, res) {
	res.sendFile(__dirname + "/rezervacija.html");
});

app.get("/unos.html", function (req, res) {
    res.sendFile(__dirname + "/unos.html");
});

app.get("/pocetna.html", function (req, res) {
	res.sendFile(__dirname + "/pocetna.html");
});

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/pocetna.html");
});

app.get("/sale.html", function (req, res) {
	res.sendFile(__dirname + "/sale.html");
});

app.get("/unos", function (req, res) {
    res.sendFile(__dirname + "/zauzeca.json");
});

app.get("/pozivi.js", function (req, res) {
    res.sendFile(__dirname + "/pozivi.js");
});

app.get("/rezervacija.js", function (req, res) {
    res.sendFile(__dirname + "/rezervacija.js");
});

app.get("/kalendar.js", function (req, res) {
    res.sendFile(__dirname + "/kalendar.js");
});

/*app.get("/index.js", function (req, res) {
    res.sendFile(__dirname + "/index.js");
});*/

app.listen(8080);