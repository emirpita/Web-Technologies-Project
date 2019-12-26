// server
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path= require('path');
const url = require('url');

const app = express();

// sve sto ce mi trebati
app.use(express.static(__dirname));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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

// dovrsiti ovo
app.post("/rezervacija.html", function(req, res) {
    // parsira request, ucita zauzeca.json u liste, provjeri je li objekat iz requesta u njima
    // ako jeste, vrati u responsu tekst, ako nije appendfile nekako
    let salaObject = JSON.parse(req.body);
    let parsiraniPodaci, p, v; // periodicna, vanredna
    // kontrolna varijabla za zauzetost
    let zauzeta = false;

    // ucitavamo liste zauzeca
    fs.readFile('zauzeca.json', 'utf8', function(err, data) {
        if (err) throw err;
        parsiraniPodaci = JSON.parse(data);
        p = parsiraniPodaci.periodicna;
        v = parsiraniPodaci.vanredna;
    });
    // provjera poklapanja sa vanrednim, a zatim sa periodicnim
    for(let i = 0; i < v.length; i++) {
        if(salaObject.naziv == v[i].naziv && salaObject.datum == v[i].datum && jeLiZauzetaUPeriodu(salaObject.pocetak, salaObject.kraj, v[i].pocetak, v[i].kraj)) {
            zauzeta = true;
            break;
        }
    }
    if(zauzeta == false) {
        // ako nije zauzeta vanredno, provjeravamo za periodicne
        let listaDatum = salaObject.split(".");
        let pomocniDatum = new Date(listaDatum[2], listaDatum[1] - 1, listaDatum[0], 0,0,0,0);
        let danUSedmici = pomocniDatum.getDay(); // 0 je nedjelja, a kod nas je 0 ponedjeljak
        // vrsimo pomjeranje
        if(danUSedmici == 0) {
            danUSedmici = 6; // nedjelja
        } else {
            danUSedmici--; // svi ostali dani
        }
        let semestar;
        // odredjujemo semestar
        if(listaDatum[1]>=2 && listaDatum[1]<=6) {
            semestar = "ljetni";
        } else if(listaDatum[1] == 1 || (listaDatum[1]>=10 && listaDatum[1]<=12)) {
            semestar = "zimski";
        }
        // sta ako nije nijedan semestar, trebamo skontat
        // provjera poklapa li se sa periodicnom
        for(let i = 0; i < p.length; i++) {
            if(semestar == p[i].semestar && danUSedmici == p[i].dan && salaObject.naziv == p[i].naziv && jeLiZauzetaUPeriodu(salaObject.pocetak, salaObject.kraj, p[i].pocetak, p[i].kraj)) {
                zauzeta = true;
                break; 
            }
        }
    }
    // sad upisujemo ili prepisujemo i saljemo odgovor
    if(zauzeta == true) {
        // ako je zauzeta, postavljamo valid na false
        parsiraniPodaci.valid = false;
    } else {
        // ako nije zauzeta, dodajemo je u neku od listi, update zauzeca.json i valid na true
        parsiraniPodaci.valid = true;
        // ako je periodicna, dodamo je u periodicne
        if(salaObject.periodicna == true) {
            parsiraniPodaci.periodicna.push({
                dan : danUSedmici,
                semestar : semestar,
                pocetak : salaObject.pocetak,
                kraj : salaObject.kraj,
                naziv : salaObject.naziv,
                predavac : salaObject.predavac
            });
            // sad ako je vanredna
        } else {
            parsiraniPodaci.vanredna.push({
                datum : salaObject.datum,
                pocetak : salaObject.pocetak,
                kraj : salaObject.kraj,
                naziv : salaObject.naziv,
                predavac : salaObject.predavac
            });
        }
    }
    fs.writeFile('message.txt', JSON.stringify(parsiraniPodaci), (err) => {
        if (err) throw err;
        console.log('Sve uredno zapisano');
    });
    res.sendFile(__dirname + "/zauzeca.json");
});

/*app.get("/index.js", function (req, res) {
    res.sendFile(__dirname + "/index.js");
});*/

app.listen(8080);