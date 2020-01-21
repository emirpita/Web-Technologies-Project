// server
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./db.js');

const app = express();

// lista konstanti i pomocnih varijabli
const TRENUTNA_GODINA = 2019;
let listaFajlova = [], listaSlikaServer = [];
let ucitaniPodaci ={};

// sve sto ce mi trebati
app.use(express.static(__dirname));
app.use(express.json()); // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// mozda i ovo bude trebalo
// app.use(express.static(__dirname + "/modeli"));


// rad sa bazom, spirala 4

db.sequelize.sync({force:true}).then(function(){
	// Podaci dani u postavci spirale

	// provjeriti overwrite baze
    db.Osoblje.create({
        id: 1,
        ime: 'Neko',
        prezime: 'Nekić',
        uloga: 'profesor'
    }).then (object =>{ db.Osoblje.create({
        id: 2,
        ime: 'Drugi',
        prezime: 'Neko',
        uloga: 'asistent'
    }).then (object => {
        db.Osoblje.create({
            id: 3,
            ime: 'Test',
            prezime: 'Test',
            uloga: 'asistent'
        }).then (object => {
            //za salu
            db.Sala.create({
                naziv: '1-11',
                zaduzenaOsoba: 1
            }).then (object => {
                db.Sala.create({
                    naziv: '1-15',
                    zaduzenaOsoba: 2
                }).then (object => {
                    //za termin
                    db.Termin.create({
                        redovni: false,
                        dan: null,
                        datum: '19.1.2019',
                        semestar: null,
                        pocetak: '10:00',
                        kraj: '15:00'
                    }).then (object => { db.Termin.create({
                        redovni: true,
                        dan: 0,
                        datum: null,
                        semestar: 'zimski',
                        pocetak: '13:00',
                        kraj: '14:00'
                    }).then (object => {
                
                        //za rezervaciju
                        db.Rezervacija.create({
                            termin: 1,
                            sala: 1,
                            osoba: 1
                        })
                        db.Rezervacija.create({
                            termin: 2,
                            sala: 1,
                            osoba: 3
                        })});});});});});
    });});
	console.log("Radi baza");
});

app.get("/osoblje", function(req, res) {
	db.Osoblje.findAll({ attributes: ['ime', 'prezime', 'uloga']}).then(function(osoblje) {
        res.json(osoblje);
    });	
});


// Za ucitavanje rezervacija svihj u pomocnu varijablu (kao atribut nesto)
app.get('/getRezervacije',function (req, res) {
    
    let periodicnaZauzecaBaza = [];
    let vanrednaZauzecaBaza= [];

    db.Rezervacija.findAll({
      include: [
          {
              model: db.Termin
          },
         {
              model: db.Sala
          },
          {
              model: db.Osoblje
          } 
      ]
    }).then (function(lista){
        lista.forEach(function(rezultat){
             if (!rezultat.Termin.redovni) {

				console.log("Osoblje: " + rezultat.Osoblje.ime + " " + rezultat.Osoblje.prezime);
				
                vanrednaZauzecaBaza.push({datum: rezultat.Termin.datum, pocetak: rezultat.Termin.pocetak,
                kraj: rezultat.Termin.kraj, naziv: rezultat.Sala.naziv, predavac: rezultat.Osoblje.ime + " " + rezultat.Osoblje.prezime, 
                uloga:rezultat.Osoblje.uloga});
             }
             else {
                periodicnaZauzecaBaza.push({dan: rezultat.Termin.dan , semestar: rezultat.Termin.semestar, 
                pocetak: rezultat.Termin.pocetak, kraj: rezultat.Termin.kraj , naziv: rezultat.Sala.naziv, 
                predavac: rezultat.Osoblje.ime + " " + rezultat.Osoblje.prezime, uloga: rezultat.Osoblje.uloga });
             }
        });
    
        ucitaniPodaci.periodicna = periodicnaZauzecaBaza;
		ucitaniPodaci.vanredna = vanrednaZauzecaBaza;
        res.json(ucitaniPodaci);
    });
 });

 // post za bazu
 app.post('/rezervacija.html', function(req, res) {
	 // flag valja li sala za upis
	let salaFlag = false;

	// ucitani podaci su podaci iz baze, privremene liste za iteriranje
	let periodicne = ucitaniPodaci.periodicna;
	let vanredne = ucitaniPodaci.vanredna;

	//Za periodicnu
	let pom1 = req.body['datum'].split(".");
	let danSaleKojaSeDodaje = parseInt(pom1[0]); // dan iz datuma
	mjesecSale = pom1[1];
	let pom2Mjesec = mjesecSale;
	mjesecSale--;
	mjesecSale = parseInt(mjesecSale);
	pom2Mjesec = parseInt(pom2Mjesec);
	godina = TRENUTNA_GODINA;

	let semestarRezervacije = "";
	if (mjesecSale >= 1 && mjesecSale <= 5) {
		semestarRezervacije = "ljetni";
	}
	else if (mjesecSale == 0 || (mjesecSale >= 9 && mjesecSale <= 11)) {
		semestarRezervacije = "zimski";
	}

	let noviDatum = pom2Mjesec + "." + danSaleKojaSeDodaje + "." + godina;
	let datumPomocna = new Date(noviDatum);
	let danSale = datumPomocna.getDay();
	// validacija na serveru, moguce duplo smanjivanje dana
	console.log("dan sale na serveru prije --(index, line 165): " + danSale);
	if (danSale == 0) {
		danSale = 6;
	}
	else {
		danSale--;
	}
	console.log("dan sale na serveru (index, line 165): " + danSale);
	// moguce rjesenje, postaviti flag da se provjeri je li validirana na serveru ili na klijentu,
	// globalna varijabla ili atribut u objektu

	for (let i = 0; i < vanredne.length; i++) {
		//za validaciju vanredne i vanredne
		if (vanredne[i].naziv == req.body['naziv'] && vanredne[i].datum == req.body['datum']) {
			//koristim funkciju iz kalendara, ako se vrijeme ne poklapa dodamo 
			if (jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], vanredne[i].pocetak, vanredne[i].kraj) == 1) {
				salaFlag = true;
				break;

			}
		}

		//prolazi kroz listu vanrednih i provjerava na koji su dan rezervisane
		if (req.body['periodicnaRezervacija'] == 1) {
			if (vanredne[i].naziv == req.body['naziv']) {

				let datumListaZauzeti = vanredne[i].datum.split(".");
				let danZauzeti = datumListaZauzeti[0];
				let mjesecZauzeti = datumListaZauzeti[1];
				mjesecZauzeti = parseInt(mjesecZauzeti);
				let godinaZauzeti = TRENUTNA_GODINA;

				let datumTmp = mjesecZauzeti + "." + danZauzeti + "." + godinaZauzeti;
				let datumTmpPom = new Date(datumTmp);
				let danTmp = datumTmpPom.getDay();
				// moguce ponovno smanjivanje dana, pogledati liniju 174
				if (danTmp == 0) {
					danTmp = 6;
				}
				else {
					danTmp--;
				}
				console.log("dan sale na serveru 2 (index, line 200): " + danTmp);

				let semestarSaleIzListe = "";
				if (mjesecZauzeti >= 2 && mjesecZauzeti <= 6) {
					semestarSaleIzListe = "ljetni";
				}
				else if (mjesecZauzeti == 1 || (mjesecZauzeti >= 10 && mjesecZauzeti <= 12)) {
					semestarSaleIzListe = "zimski";
				}

				if (jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], vanredne[i].pocetak, vanredne[i].kraj) == 1) {
					if (danTmp == danSale && semestarRezervacije == semestarSaleIzListe) {
						salaFlag = true;
						break;
					}
				}
			}
		}
	}

	//Ako je periodicna i van semestara: zabraniti da bude periodicna
	if (req.body['periodicnaRezervacija'] == 1) {
		if (semestarRezervacije == "") {
			salaFlag = true; // zabrana dodavanja izvan semestara
		}
	}


	for (let j = 0; j < periodicne.length; j++) {
		//provjera naziva sala, vrijeme i isti dan
		if (periodicne[j].naziv == req.body['naziv'] && periodicne[j].semestar == semestarRezervacije && jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], periodicne[j].pocetak, periodicne[j].kraj) == 1 && danSale == periodicne[j].dan) {
			salaFlag = true;
			break;
		}
	}

	// upisujemo u bazu ako je sve fino proslo, tj ako je sve validirano

	if (salaFlag == false) {
		if (semestarRezervacije != "") {
			if (req.body['periodicnaRezervacija'] == 1) {
				let pomocnaSala = {
					dan: danSale,
					semestar: semestarRezervacije,
					pocetak: req.body['pocetak'],
					kraj: req.body['kraj'],
					naziv: req.body['naziv'],
					predavac: req.body['predavac']
				};
				upisiRezervacijuUBazu(pomocnaSala); // ovdje
			}

			else {
				let pomocnaSala = req.body;
				delete pomocnaSala["periodicnaRezervacija"];
				upisiRezervacijuUBazu(pomocnaSala); // ovdje
			}
		}

		else {
			let pomocnaSala = req.body;
			delete pomocnaSala["periodicnaRezervacija"];
			upisiRezervacijuUBazu(pomocnaSala); // ovdje
		}
	}
	else {
		let responseTmp;
		if (salaFlag) {
			responseTmp = 0;
		}
		else {
			responseTmp = 1;
		}
		res.json(responseTmp);
	}

});


function upisiRezervacijuUBazu(salaBaza) {
    let idTerTmp, idOsobljeTmp, idSalaTmp;
    let jeLiRedovna = false;
    let danRezervacije = null;
    let datumRezervacije = null;
    let semestarRezervacije = null;

    if (salaBaza.periodicnaRezervacija == 1) {
        jeLiRedovna = true;
        danRezervacije = salaBaza.dan;
        semestarRezervacije = salaBaza.semestar;
    }
    else {
		datumRezervacije = salaBaza.datum;
	}
    db.Termin.create({
        redovni: jeLiRedovna,
        dan: danRezervacije,
        datum: datumRezervacije,
        semestar: semestarRezervacije,
        pocetak: salaBaza.pocetak,
        kraj: salaBaza.kraj
    }).then(podaciTermin =>{
        idOsobljeTmp = salaBaza.idOsobe;
        idTerTmp = podaciTermin.dataValues.id; 
        }).then(object =>{
            db.Sala.create({naziv: salaBaza.naziv, zaduzenaOsoba: idOsobljeTmp}
            ).then(foundSala => {
                idSalaTmp = foundSala.dataValues.id;
                db.Rezervacija.create({termin: idTerTmp, osoba: idOsobljeTmp, sala:idSalaTmp});
            });
        });
}

app.get("/osobeUSali",function (req, res) {
    let podaci = [];
	
	// za odredjivanje dana
    let pomocnaDatum = new Date();
    let danasnjiDatum = new Date(TRENUTNA_GODINA, pomocnaDatum.getMonth(), pomocnaDatum.getDate(), pomocnaDatum.getHours(), pomocnaDatum.getMinutes());
    let trenutniSati = danasnjiDatum.getHours();
    let trenutneMinute = danasnjiDatum.getMinutes();
    let trenutniDan = danasnjiDatum.getDay();
    if(trenutniDan == 0) {
        trenutniDan = 6;
    } else {
        trenutniDan--;
	}
	
	// upit, spajamo podatke
    db.Rezervacija.findAll({
      include: [
          {
              model: db.Termin
          },
         {
              model: db.Sala
          },
          {
              model: db.Osoblje
          } 
      ]
    }).then (function(lista){
        lista.forEach(function(rez){
             if (!rez.Termin.redovni) {
                let datumIzTermina = splitDatum(rez.Termin.datum);
                if (datumIzTermina.dan == danasnjiDatum.getDate() && datumIzTermina.mjesec == (danasnjiDatum.getMonth())) {   
                    if (preklapaLiSe(rez.Termin.pocetak, rez.Termin.kraj, trenutniSati, trenutneMinute) == 1) {
                        podaci.push({ime: rez.Osoblje.ime, prezime: rez.Osoblje.prezime, uloga: rez.Osoblje.uloga, naziv: rez.Sala.naziv});
                    }
                }
             }
             else {
                if (rez.Termin.semestar == "ljetni" || rez.Termin.semestar == "zimski") {
                    if (rez.Termin.dan == trenutniDan) {
                        if (preklapaLiSe(rez.Termin.pocetak, rez.Termin.kraj, trenutniSati, trenutneMinute) == 1) {
                            podaci.push({ime: rez.Osoblje.ime, prezime: rez.Osoblje.prezime, uloga: rez.Osoblje.uloga, naziv: rez.Sala.naziv});
                  		}
                    }
                }
             }
        });
        res.json(podaci);
    });
 }); 
 
 function splitDatum(datum) {
    let datumLista = datum.split(".");
    let danSale = datumLista[0];
    let mjesecSale = datumLista[1];
    mjesecSale--;
    mjesecSale = parseInt(mjesecSale);

    return ({dan: danSale, mjesec: mjesecSale});
}


// spirala 3

app.get("/rezervacija.html", function(req, res) {
	res.sendFile(__dirname + "/rezervacija.html");
});

app.get("/unos.html", function(req, res) {
	res.sendFile(__dirname + "/unos.html");
});

app.get("/pocetna.html", function(req, res) {
	res.sendFile(__dirname + "/pocetna.html");
});

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/pocetna.html");
});

app.get("/sale.html", function(req, res) {
	res.sendFile(__dirname + "/sale.html");
});

app.get("/osoblje.html", function(req, res) {
	res.sendFile(__dirname + "/osoblje.html");
});

app.get("/osoblje.js", function(req, res) {
	res.sendFile(__dirname + "/osoblje.js");
});

app.get("/db.js", function(req, res) {
	res.sendFile(__dirname + "/db.js");
});

app.get("/modeli/osoblje.js", function(req, res) {
	res.sendFile(__dirname + "/modeli/osoblje.js");
});

app.get("/modeli/rezervacija.js", function(req, res) {
	res.sendFile(__dirname + "/modeli/rezervacija.js");
});

app.get("/modeli/sala.js", function(req, res) {
	res.sendFile(__dirname + "/modeli/sala.js");
});

app.get("/modeli/termin.js", function(req, res) {
	res.sendFile(__dirname + "/modeli/termin.js");
});

app.get("/unos", function(req, res) {
	res.sendFile(__dirname + "/zauzeca.json");
});

app.get("/pozivi.js", function(req, res) {
	res.sendFile(__dirname + "/pozivi.js");
});

app.get("/rezervacija.js", function(req, res) {
	res.sendFile(__dirname + "/rezervacija.js");
});

app.get("/pocetna.js", function(req, res) {
	res.sendFile(__dirname + "/pocetna.js");
});

app.get("/kalendar.js", function(req, res) {
	res.sendFile(__dirname + "/kalendar.js");
});


app.post('/rezervacijaJSON', function(req, res) {
	let salaFlag = false;
	fs.readFile('zauzeca.json', 'utf8', (greska, data) => {
		if (greska) throw greska;
		let podaci = data.toString('utf-8');
		var sadrzaj = fs.readFileSync("zauzeca.json");
		var jsonContent = JSON.parse(sadrzaj);
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
		godina = TRENUTNA_GODINA;

		let semestarRezervacije = "";
		if (mjesecSale >= 1 && mjesecSale <= 5) {
			semestarRezervacije = "ljetni";
		}
		else if (mjesecSale == 0 || (mjesecSale >= 9 && mjesecSale <= 11)) {
			semestarRezervacije = "zimski";
		}

		let noviDatum = pom2Mjesec + "." + danSaleKojaSeDodaje + "." + godina;
		let datumPomocna = new Date(noviDatum);
		let danSale = datumPomocna.getDay();
		if (danSale == 0) {
			danSale = 6;
		}
		else {
			danSale--;
		}

		for (let i = 0; i < vanredne.length; i++) {
			//za validaciju vanredne i vanredne
			if (vanredne[i].naziv == req.body['naziv'] && vanredne[i].datum == req.body['datum']) {
				//koristim funkciju iz kalendara, ako se vrijeme ne poklapa dodamo 
				if (jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], vanredne[i].pocetak, vanredne[i].kraj) == 1) {
					salaFlag = true;
					break;

				}
			}

			//prolazi kroz listu vanrednih i provjerava na koji su dan rezervisane
			if (req.body['periodicnaRezervacija'] == 1) {
				if (vanredne[i].naziv == req.body['naziv']) {

					let datumListaZauzeti = vanredne[i].datum.split(".");
					let danZauzeti = datumListaZauzeti[0];
					let mjesecZauzeti = datumListaZauzeti[1];
					mjesecZauzeti = parseInt(mjesecZauzeti);
					let godinaZauzeti = TRENUTNA_GODINA;

					let datumTmp = mjesecZauzeti + "." + danZauzeti + "." + godinaZauzeti;
					let datumTmpPom = new Date(datumTmp);
					let danTmp = datumTmpPom.getDay();
					if (danTmp == 0) {
						danTmp = 6;
					}
					else {
						danTmp--;
					}

					let semestarSaleIzListe = "";
					if (mjesecZauzeti >= 2 && mjesecZauzeti <= 6) {
						semestarSaleIzListe = "ljetni";
					}
					else if (mjesecZauzeti == 1 || (mjesecZauzeti >= 10 && mjesecZauzeti <= 12)) {
						semestarSaleIzListe = "zimski";
					}

					if (jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], vanredne[i].pocetak, vanredne[i].kraj) == 1) {
						if (danTmp == danSale && semestarRezervacije == semestarSaleIzListe) {
							salaFlag = true;
							break;
						}
					}
				}
			}
		}

		//Ako je periodicna i van semestara: zabraniti da bude periodicna
		if (req.body['periodicnaRezervacija'] == 1) {
			if (semestarRezervacije == "") {
				salaFlag = true; // zabrana dodavanja izvan semestara
			}
		}


		for (let j = 0; j < periodicne.length; j++) {
			//provjera naziva sala, vrijeme i isti dan
			if (periodicne[j].naziv == req.body['naziv'] && periodicne[j].semestar == semestarRezervacije && jeLiZauzetaUPeriodu(req.body['pocetak'], req.body['kraj'], periodicne[j].pocetak, periodicne[j].kraj) == 1 && danSale == periodicne[j].dan) {
                salaFlag = true;
                break;
			}
		}

		if (salaFlag == false) {
			if (semestarRezervacije != "") {
				if (req.body['periodicnaRezervacija'] == 1) {
					let pomocnaSala = {
						dan: danSale,
						semestar: semestarRezervacije,
						pocetak: req.body['pocetak'],
						kraj: req.body['kraj'],
						naziv: req.body['naziv'],
						predavac: req.body['predavac']
					};
					jsonContent.periodicna.push(pomocnaSala);
				}

				else {
					let pomocnaSala = req.body;
					delete pomocnaSala["periodicnaRezervacija"];
					jsonContent.vanredna.push(pomocnaSala);
				}
			}

			else {
				let pomocnaSala = req.body;
				delete pomocnaSala["periodicnaRezervacija"];
				jsonContent.vanredna.push(pomocnaSala);
			}

			// upisujemo u fajl
			fs.writeFile("zauzeca.json", JSON.stringify(jsonContent), function(err, result) {
				if (err) console.log('error', err);
				jsonContent.valid = 1;
				res.json(jsonContent);
			});
		}
		else {
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

// zadatak 3
app.get("/slike", function(req, res) {
	// lista stringova
	console.log("Dobio zahtjev");
	let listaSlikaServer = [];
	fs.readdir(__dirname, (err, files) => {
		console.log("procitao direktorij");
		if (err) console.log('error', err);
		console.log(files);
		files.forEach(file => {
			console.log(file);
			console.log(file.includes(".png"));
			  // podrzani formati su jpg, png i gif
			  if(file.includes(".png") || file.match(".jpg") || file.match(".gif")) {
				  console.log("yes");
				  listaSlikaServer.push(file);
			  }
		});
		 res.contentType('application/json');
		res.json({slike: listaSlikaServer});
	});
});

function preklapaLiSe(pocetak, kraj, sati, minute) {
    var satiPocetak = pocetak.split(":")[0];
    var minutePocetak = pocetak.split(":")[1];

    var satiKraj = kraj.split(":")[0];
    var minuteKraj = kraj.split(":")[1];

    if (satiPocetak < sati && satiKraj > sati) return 1; //unutar
    if (satiPocetak > sati || satiKraj < sati) return 0; //van
    if (satiPocetak == sati || satiKraj == sati) 
    {
        if(satiKraj > sati) return 1;
        if (satiPocetak < sati) return 1;
        if (minutePocetak < minute && minuteKraj > minute) return 1;
        else if (minutePocetak == minute && minuteKraj > minute) return 1;
        else if (minutePocetak < minute && minuteKraj == minute) return 1;
        else return 0;
    }
}

/*
// zadatak 3, verzija 2, prvo citati fajlove, zatim ih spasiti, a zatim ih poslati

// citanje fajlova

function procitajFolder() {
	fs.readdir(__dirname, (err, files) => { // mozda Sync
		console.log("procitao direktorij");
		if (err) console.log('error', err);
		console.log(files);
		files.forEach(file => {
			console.log(file);
			listaFajlova.push(file);
		});
	});
}

function izdvojiSlike() {
	for(let i = 0; i < listaFajlova.length; i++) {
		// podrzani formati su jpg, png i gif
		if(listaFajlova[i].match("/.png$/") || listaFajlova[i].match("/.jpg$/") || listaFajlova[i].match("/.gif$/")) {
			listaSlikaServer.push(listaFajlova[i]);
		}
	}
}

app.get("/slike", function(req, res) {
	console.log("Dobio zahtjev");
	// idemo redom
	procitajFolder();
	izdvojiSlike();
	console.log("Lista slika: \n" + listaSlikaServer);
	res.contentType('application/json');
	res.json({slike: listaSlikaServer});
});*/


app.listen(8080);