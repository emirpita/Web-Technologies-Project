// server
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const url = require('url');

const app = express();

// lista konstanti
const TRENUTNA_GODINA = 2019;

// sve sto ce mi trebati
app.use(express.static(__dirname));
app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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


app.post('/rezervacija.html', function(req, res) {
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
			  // podrzani formati su jpg, png i gif
			  if(file.match("/.png$/") || file.match("/.jpg$/") || file.match("/.gif$/")) {
				  listaSlikaServer.push(file);
			  }
		});
		 res.contentType('application/json');
		res.json({slike: listaSlikaServer});
	});
	/*let fajlovi = procitajFolder();
	for(let i = 0; i < fajlovi.length; i++) {
		if(fajlovi[i].match("/.png$/") || fajlovi[i].match("/.jpg$/") || fajlovi[i].match("/.gif$/")) {
			listaSlikaServer.push(fajlovi[i]);
		}
	}
	console.log("Lista slika: \n" + listaSlikaServer);
	res.contentType('application/json');
	res.json({slike: listaSlikaServer});*/
});

function procitajFolder() {
	let listaFajlova = [];
	fs.readdir(__dirname, (err, files) => {
		console.log("procitao direktorij");
		if (err) console.log('error', err);
		console.log(files);
		listaFajlova.push(files);
		/*files.forEach(file => {
		console.log(file);
		  // podrzani formati su jpg, png i gif
		  if(file.match("/.png$/") || file.match("/.jpg$/") || file.match("/.gif$/")) {
			  listaSlikaServer.push(file);
		  }
		});*/
	});
	return listaFajlova;
}

app.listen(8080);