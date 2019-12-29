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
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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


app.post('/rezervacija.html',function(req,res){
    let dodajSalu = false;
    fs.readFile('zauzeca.json', 'utf8' , (greska, data) => {
        if(greska) throw greska;
        let podaci = data.toString('utf-8');
        var contents = fs.readFileSync("zauzeca.json");
        var jsonContent = JSON.parse(contents);
        let periodicne = jsonContent.periodicna;
        let vanredne = jsonContent.vanredna;

        //Za periodicnu
        let pom1 = req.body['datum'].split(".");
        let danSaleKojaSeDodaje = parseInt(pom1[0]);
        mjesecSale = pom1[1];
        let pom2Mjesec = mjesecSale;
        mjesecSale--;
        mjesecSale = parseInt(mjesecSale);
        pom2Mjesec = parseInt(pom2Mjesec);
        godina = 2019;

        let semestarRezervacije = "";
        if(mjesecSale >=1 && mjesecSale <= 5) {
            semestarRezervacije = "ljetni";
        } else if(mjesecSale == 0 || (mjesecSale >= 9 && mjesecSale <= 11)) {
            semestarRezervacije = "zimski";
        }
        
        let noviDatum = pom2Mjesec + "." + danSaleKojaSeDodaje + "." + godina;
        let datumPomocna = new Date(noviDatum);
        let danSale = datumPomocna.getDay();
        if(danSale == 0) {
            danSale = 6;
        } else {
            danSale--;
        }
        // danSale = dajDan(danSale);
        
        for (let i = 0; i < vanredne.length; i++)
        {
            //za validaciju vanredne i vanredne
            if (vanredne[i].naziv == req.body['naziv'] && vanredne[i].datum == req.body['datum'])
            {
                //koristim funkciju iz kalendara, ako se vrijeme ne poklapa dodamo 
                if (jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], vanredne[i].pocetak, vanredne[i].kraj) == 1)
                {
                    dodajSalu = true;
                    break;
                    
                }
            }
            
            //prolazi kroz listu vanrednih i provjerava na koji su dan rezervisane
            if (req.body['periodicnaRezervacija'] == 1)
            {
                if (vanredne[i].naziv == req.body['naziv'])
                {
                    
                    let p1 = vanredne[i].datum.split(".");
                    let dan1 = p1[0];
                    let mjesec1 = p1[1];
                    mjesec1 = parseInt(mjesec1);
                    let godina1 = 2019;

                    let novi1 = mjesec1 + "." + dan1 + "." + godina1;
                    let novi1Pom = new Date(novi1);
                    let dan2 = novi1Pom.getDay();
                    if(dan2 == 0) {
        				dan2 = 6;
        			} else {
            			dan2--;
        			}
                    // dan2 = dajDan(dan2);

                    let semestarSaleIzListe = "";
                    if(mjesec1 >=2 && mjesec1 <= 6) {
                        semestarSaleIzListe = "ljetni";
                    } else if(mjesec1 == 1 || (mjesec1 >= 10 && mjesec1 <= 12)) {
                        semestarSaleIzListe = "zimski";
                    }
        
                    if (jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], vanredne[i].pocetak, vanredne[i].kraj) == 1)
                    {
                        if (dan2 == danSale && semestarRezervacije == semestarSaleIzListe)
                        {
                            dodajSalu = true;
                            break;
                        } 
                    }
                }
            }
        }

        //Ako je periodicna i van semestara
        if (req.body['periodicnaRezervacija'] == 1)
        {
            if (semestarRezervacije == "")
            {
                dodajSalu = true;
            }    
        }

    
        for (let j = 0; j < periodicne.length; j++)
        {
            //provjera naziva sala
            if (periodicne[j].naziv == req.body['naziv'] && periodicne[j].semestar == semestarRezervacije)
            {
                    //provjera da li se vrijeme poklapa
                    if (jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], periodicne[j].pocetak, periodicne[j].kraj) == 1)
                    {
                        //provjera da li su na isti dan unutar sedmice
                        if (danSale == periodicne[j].dan)
                        {
                            dodajSalu = true;
                            break;
                        }
                    }
            }
        }
         
        if (dodajSalu == false)
        {
            if (semestarRezervacije != "")
            {
                if (req.body['periodicnaRezervacija'] == 1)
                {
                    let pomocnaSala = { dan : danSale, semestar : semestarRezervacije, pocetak : req.body['pocetak'], kraj : req.body['kraj'],
                                    naziv : req.body['naziv'],  predavac : req.body['predavac']};
                    jsonContent.periodicna.push(pomocnaSala);
                }

                else
                {
                    let pomocnaSala = req.body;
                    delete pomocnaSala["periodicnaRezervacija"];
                    jsonContent.vanredna.push(pomocnaSala);
                }
            }

           else
            {
                let pomocnaSala = req.body;
                delete pomocnaSala["periodicnaRezervacija"];
                jsonContent.vanredna.push(pomocnaSala);
            }

            // upisujemo u fajl
            fs.writeFile("zauzeca.json", JSON.stringify(jsonContent),function(err, result) {
                if(err) console.log('error', err);
                jsonContent.valid = 1;
                res.json(jsonContent);
            });
        }
        else 
        {
            jsonContent.valid = 0;
            res.json(jsonContent);
        }

      }); 
 });

function jeLiZauzetaUPeriodu(pocetak, kraj, salaPocetak, salaKraj) {
	let zauzeta = 0;
	if (pocetak > salaPocetak && pocetak < salaKraj) return 1;
	else if (pocetak < salaPocetak && kraj > salaPocetak) return 1;
	else if (pocetak == salaPocetak || kraj == salaKraj) return 1;
	return 0;
}

app.listen(8080);