// konstante 
const MAX_BROJ_DANA = 42;

const POCETNI_DANI = new Map([
	[0, 1],
	[1, 4],
	[2, 4],
	[3, 0],
	[4, 2],
	[5, 5],
	[6, 0],
	[7, 3],
	[8, 6],
	[9, 1],
	[10, 4],
	[11, 6]
]);

const TRAJANJA_MJESECI_U_DANIMA = new Map([
	[0, 31],
	[1, 28],
	[2, 31],
	[3, 30],
	[4, 31],
	[5, 30],
	[6, 31],
	[7, 31],
	[8, 30],
	[9, 31],
	[10, 30],
	[11, 31]
]);

const LJETNI_SEMESTAR = ["Februar", "Mart", "April", "Maj", "Juni"];
const ZIMSKI_SEMESTAR = ["Januar", "Oktobar", "Novembar", "Decembar"];
const NAZIVI_MJESECA = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];

// pomocne varijable
var pomocnaMjesec = 11; //parseInt(Date.today().getMonth());

// pocetni podaci i testni podaci

/*
var psLista = [{
	dan: 5,
	semestar: "zimski",
	pocetak: "09:00",
	kraj: "10:00",
	naziv: "MA",
	predavac: "nastavnik1"
}, {
	dan: 0,
	semestar: "zimski",
	pocetak: "10:00",
	kraj: "12:00",
	naziv: "MA",
	predavac: "nastavnik1"
}, {
	dan: 5,
	semestar: "ljetni",
	pocetak: "12:00",
	kraj: "14:00",
	naziv: "1-02",
	predavac: "nastavnik2"
}, {
	dan: 3,
	semestar: "ljetni",
	pocetak: "12:00",
	kraj: "14:00",
	naziv: "VA1",
	predavac: "nastavnik2"
}];

var vsLista = [{
	datum: "1.10.2019",
	pocetak: "10:10",
	kraj: "12:00",
	naziv: "MA",
	predavac: "nastavnik3"
}, {
	datum: "31.11.2019",
	pocetak: "12:00",
	kraj: "16:00",
	naziv: "MA",
	predavac: "nastavnik3"
}, {
	datum: "14.10.2019",
	pocetak: "12:00",
	kraj: "16:00",
	naziv: "MA",
	predavac: "nastavnik4"
}, {
	datum: "09.01.2019",
	pocetak: "12:00",
	kraj: "16:00",
	naziv: "VA2",
	predavac: "nastavnik5"
}, {
	datum: "09.11.2019",
	pocetak: "12:00",
	kraj: "16:00",
	naziv: "0-01",
	predavac: "nastavnik4"
}];
*/

var psLista = new Array();
var vsLista = new Array();

// pomocne funkcije globalnog opsega

function crtaj(mjesec) {
	let kalendar = document.getElementsByClassName("kalendar")[0];
	kalendar.innerHTML = "";
	Kalendar.iscrtajKalendar(kalendar, mjesec);
	Kalendar.ucitajPodatke(psLista, vsLista);
	Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("sale")[0].value,
		document.getElementById("pocetak").value, document.getElementById("kraj").value);
}

function sljedeci() {
	pomocnaMjesec++;
	if (pomocnaMjesec < 12) {
		document.getElementsByClassName("dugmeSljedeci").disabled = false;
		let sada = new Date();
		let pozicija = sada.getMonth();
		crtaj(pomocnaMjesec);
	}
	else {
		pomocnaMjesec = 11;
		document.getElementsByClassName("dugmeSljedeci").disabled = true;
	}
}

function prethodni() {
	pomocnaMjesec--;
	if (pomocnaMjesec >= 0) {
		document.getElementsByClassName("dugmePrethodni").disabled = false;
		let sada = new Date();
		crtaj(pomocnaMjesec);
	}
	else {
		pomocnaMjesec = 0;
		document.getElementsByClassName("dugmePrethodni").disabled = true;
	}
}

function refreshKalendar() {
	crtaj(pomocnaMjesec);
}

function ucitajKalendar() {
	crtaj(11);
}

// validacije 

function validirajVrijeme(pocetak, kraj) {
	var satiPocetak = pocetak.split(":")[0];
	var satiKraj = kraj.split(":")[0];
	if (satiPocetak > satiKraj) return 0;
	if (satiPocetak > 24 || satiPocetak < 0) return 0;
	if (satiKraj > 24 || satiKraj < 0) return 0;
	return 1;
}

function jeLiValidnaPeriodicna(dan, pocetak, kraj) {
	if (dan > 6 || dan < 0) return 0;
	return validirajVrijeme(pocetak, kraj);
}

function jeLiValidnaVanredna(datum, pocetak, kraj) {
	let temp = datum.split(".");
	let danSale = temp[0];
	let mjesecSale = temp[1];
	// godina nam ne treba
	mjesecSale = parseInt(mjesecSale);
	mjesecSale--;
	let brojDanaMjeseca = TRAJANJA_MJESECI_U_DANIMA.get(mjesecSale);

	if (mjesecSale > 12 || mjesecSale < 0) return 0;
	if (danSale > brojDanaMjeseca) return 0;
	return validirajVrijeme(pocetak, kraj);
}

function getPocetniDan(pocetakMjesec, dan) {
	let pocBoja = dan;
	if (pocetakMjesec == 6 && dan != 6) pocBoja = pocBoja + 1;
	else if (pocetakMjesec > dan) pocBoja = dan + pocetakMjesec - 1;
	else if (dan > pocetakMjesec) pocBoja = dan - pocetakMjesec;
	else if (dan == pocetakMjesec) {
		pocBoja = 0;
		if (pocetakMjesec - 7 > 0) pocetakMjesec -= 7;
	}
	if ((dan == 0 && (pomocnaMjesec == 9 || pomocnaMjesec == 0))) {
		pocBoja--;
		pocBoja += 7;
	}
	if (pocetakMjesec == 0) pocBoja = dan;
	if (pomocnaMjesec == 5) pocBoja -= 2;
	if (pomocnaMjesec == 5 && (dan == 5 || dan == 6)) pocBoja += 2;
	if (pomocnaMjesec == 4 && (dan == 0 || dan == 1)) pocBoja += 4;
	return pocBoja;
}

function jeLiZauzetaUPeriodu(pocetak, kraj, salaPocetak, salaKraj) {
	let zauzeta = 0;
	if (pocetak > salaPocetak && pocetak < salaKraj) return 1;
	else if (pocetak < salaPocetak && kraj > salaPocetak) return 1;
	else if (pocetak == salaPocetak || kraj == salaKraj) return 1;
	return 0;
}

let Kalendar = (function() {

	function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {

		let pocetniDan = POCETNI_DANI.get(mjesec);
		let poslanaSala = sala;
		if (pocetak != 0 && kraj != 0) {
			// pretrazujemo prvo periodicne
			for (let i = 0; i < psLista.length; i++) {
				// validacija periodicnih
				if (jeLiValidnaPeriodicna(psLista[i].dan, psLista[i].pocetak, psLista[i].kraj) == 1 && jeLiZauzetaUPeriodu(pocetak, kraj, psLista[i].pocetak, psLista[i].kraj)== 1) {
						let pocBoja = getPocetniDan(pocetniDan, psLista[i].dan);
						if (psLista[i].semestar == "zimski") {
							if (psLista[i].naziv == poslanaSala) {
								for (let j = 0; j < ZIMSKI_SEMESTAR.length; j++) {
									if (NAZIVI_MJESECA[mjesec] == ZIMSKI_SEMESTAR[j]) {
										let kucicaDan = document.getElementsByClassName("slobodna");
										for (let k = pocBoja; k < kucicaDan.length; k += 6) {
											kucicaDan[k].className="zauzeta";
										}

									}
								}
							}
						}
						else if (psLista[i].semestar == "ljetni") {
							for (let m = 0; m < LJETNI_SEMESTAR.length; m++) {
								if (NAZIVI_MJESECA[mjesec] == LJETNI_SEMESTAR[m]) {
									let kucicaDan = document.getElementsByClassName("slobodna");
									for (let v = pocBoja; v < kucicaDan.length; v += 7) {
										kucicaDan[v].className = "zauzeta";
									}
								}
							}
						}
				}
			}
			// vanredne
			for (let i = 0; i < vsLista.length; i++) {
				// neperiodnicne
				if (jeLiValidnaVanredna(vsLista[i].datum, vsLista[i].pocetak, vsLista[i].kraj) == 1 && jeLiZauzetaUPeriodu(pocetak, kraj, vsLista[i].pocetak, vsLista[i].kraj) == 1) {
						if (vsLista[i].naziv == poslanaSala) {
							let datumSale = vsLista[i].datum;
							let temp = datumSale.split(".");
							let danSale = parseInt(temp[0]);
							danSale--;
							let mjesecSale = temp[1];
							mjesecSale--;
							console.log("mjesec sale " + mjesecSale + " dan sale " + danSale);
							if (pomocnaMjesec == mjesecSale) {
								let kucicaDan = document.getElementsByClassName("slobodna");
								kucicaDan[parseInt(danSale)].className = "zauzeta";
							}
						}
					}
				}
			}
		}

	function ucitajPodatkeImpl(periodicna, redovna) {
		//console.log(periodicna);
		psLista = periodicna; //.slice();
		//console.log(psLista);
		vsLista = redovna; //.slice();
	}

	function iscrtajKalendarImpl(kalendarRef, mjesec) {
		var sada = new Date();
		var listaDana = ["PON", "UTO", "SRI", "CET", "PET", "SUB", "NED"];
		var trenutnaGodina = sada.getFullYear();
		var prviDanUMjesecu = (new Date(trenutnaGodina + "-" + mjesec + "-01")).getDay() + 2;
		var brojDana = parseInt(TRAJANJA_MJESECI_U_DANIMA.get(mjesec));

		// Dodajemo naziv mjeseca u kalendar
		var nazivMjeseca = document.createElement("div");
		nazivMjeseca.className = "month";
		var listaNazivMjeseca = document.createElement("ul");
		var tekstNazivMjeseca = document.createElement("li");
		tekstNazivMjeseca.setAttribute("id", "trenutniMjesec");
		tekstNazivMjeseca.innerHTML = NAZIVI_MJESECA[mjesec];
		listaNazivMjeseca.append(tekstNazivMjeseca);
		nazivMjeseca.append(listaNazivMjeseca);
		kalendarRef.append(nazivMjeseca);

		// dodajemo nazive dana u sedmici u kalendar
		var listaNaziviDana = document.createElement("ul");
		listaNaziviDana.className = "naziviDana";
		for (var i = 0; i < listaDana.length; i++) {
			var tekstListItem = document.createElement("li");
			listaNaziviDana.append(tekstListItem);
			tekstListItem.innerHTML = listaDana[i];
		}
		kalendarRef.append(listaNaziviDana);

		// dodajemo listu sa danima
		if (mjesec == 4 || mjesec == 6 || mjesec == 9 || mjesec == 11) prviDanUMjesecu--;
		if (mjesec == 2) prviDanUMjesecu -= 3;
		if (mjesec == 0) prviDanUMjesecu = 1;
		var listaKalendar = document.createElement("ul");
		listaKalendar.className = "dani";

		// kreirani i ubaceni prazni dani
		for (var i = 0; i < prviDanUMjesecu; i++) {
			var prazanDan = document.createElement("li");
			prazanDan.className = "prazanDan";
			listaKalendar.append(prazanDan);
		}

        var brojacka = 1;
		// ubacivanje pravih dana
		for (var i = 0; i < brojDana; i++) {
			var praviDan = document.createElement("li");
			var unutrasnjiDiv = document.createElement("div");
			unutrasnjiDiv.className = "slobodna";
			praviDan.innerHTML = brojacka;
			praviDan.append(unutrasnjiDiv);
			listaKalendar.append(praviDan);
            brojacka++;
        }
        
        // ubacivanje praznih dana na kraju zbog popunjavanja (ne mora)
        for(var i = brojDana; i < MAX_BROJ_DANA; i++) {
            var pomocniDani = document.createElement("li");
            pomocniDani.className = "prazanDan";
            listaKalendar.append(pomocniDani);
		}
		kalendarRef.append(listaKalendar);

		// dodavanje eventlistenera na dane
		document.querySelectorAll('.dani li')
    .forEach(e => e.addEventListener("click", function() {
    
        let mjesecZaDodavanje  = pomocnaMjesec + 1;
        let salaZaDodavanje = document.getElementsByClassName("sale")[0].value;
        let pocetakZaDodavanje = document.getElementById("pocetak").value;
        let krajZaDodavanje = document.getElementById("kraj").value;
        let today = new Date();
        //0 da nije periodicna, 1 za periodicna
        let periodicnaRezervacija = 0; 

        //Da li su podaci popunjeni
        if (pocetakZaDodavanje != "" && krajZaDodavanje != "")
        { 
            let dan = parseInt(e.innerHTML);
            if (dan != "")
            {
                if (document.getElementById("periodicna").checked) periodicnaRezervacija = 1;
                else periodicnaRezervacija = 0;
                let datumZaDodavanje = dan + "." + mjesecZaDodavanje + "." + trenutnaGodina;
                datumZaDodavanjeDrugiFormat = dan + "/" + mjesecZaDodavanje + "/" + trenutnaGodina;
                if (jeLiValidnaVanredna(datumZaDodavanje, pocetakZaDodavanje, krajZaDodavanje) == 1)
                {
                    let sala = {"periodicnaRezervacija" : periodicnaRezervacija, "datum":datumZaDodavanje, 
                                "pocetak":pocetakZaDodavanje, "kraj":krajZaDodavanje, "naziv":salaZaDodavanje, 
								"predavac":"predavac"};
					
					let dodajSalu = false;
					let datumLista = sala.datum.split(".");
					let poslaniDanSale = parseInt(datumLista[0]);
					mjesecSale = datumLista[1];
					let kopijaMjesecSale = mjesecSale;
					mjesecSale--;
					mjesecSale = parseInt(mjesecSale);
					kopijaMjesecSale = parseInt(kopijaMjesecSale);
					godina = datumLista[2];
						
					let semestarRezervacije = "";
					if(mjesecSale >=1 && mjesecSale <= 5) {
						semestarRezervacije = "ljetni";
					} else if(mjesecSale == 0 || (mjesecSale >= 9 && mjesecSale <= 11)) {
						semestarRezervacije = "zimski";
					}
								
					let noviDatum = kopijaMjesecSale + "." + poslaniDanSale + "." + godina;
					let datumPomocna = new Date(noviDatum);
					let danSale = datumPomocna.getDay();
					if(danSale == 0) {
						danSale = 6;
					} else {
						danSale--;
					}
					// danSale = dajDan(danSale);
								
					for (let i = 0; i < vsLista.length; i++) {
					// provjeravamo je li u vanrednim
						if (vsLista[i].naziv == sala.naziv && vsLista[i].datum == sala.datum && jeLiZauzetaUPeriodu(sala.pocetak, sala.kraj, vsLista[i].pocetak, vsLista[i].kraj) == 1) {
							dodajSalu = true;
							break;
						}
									
						// provjeravamo vanredne rezervacije, ako se poklopi sa periodicnom posloanom
						if (sala.periodicnaRezervacija == 1){
							if (vsLista[i].naziv == sala.naziv){
								let p1 = vsLista[i].datum.split(".");
								let dan1 = p1[0];
								let mjesec1 = p1[1];
								mjesec1 = parseInt(mjesec1);
								let godina1 = p1[2];
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
						
								if (jeLiZauzetaUPeriodu(sala.pocetak, sala.kraj, vsLista[i].pocetak, vsLista[i].kraj) == 1) {
									if (dan2 == danSale && semestarRezervacije == semestarSaleIzListe) {
										dodajSalu = true;
										break;
									} 
								}
							}
						}
					}
						
					// provjera je li periodicna i je li izlazi iz semestra
						if (sala.periodicnaRezervacija == 1) {
							if (semestarRezervacije == "") {
							dodajSalu = true;
						}    
					}
						
					for (let j = 0; j < psLista.length; j++) {
						//provjera naziva sala, poklapanje vremena i dana
						if (psLista[j].naziv == sala.naziv && psLista[j].semestar == semestarRezervacije && jeLiZauzetaUPeriodu(sala.pocetak, sala.kraj, psLista[j].pocetak, psLista[j].kraj) == 1 && danSale == psLista[j].dan){
							dodajSalu = true;
							break;
						}
					}
                    if (dodajSalu==true)
                    {
                        if (confirm("Da li želite da rezervisati ovaj termin?") == true) 
                        {
                            Pozivi.posaljiSaluNaServer(sala);
                        }
                    }
                    else
                    {
                        alert('Nije moguće rezervisati salu ' + sala.naziv + ' za navedeni datum ' + datumZaDodavanjeDrugiFormat + ' i termin od ' +sala.pocetak+ ' do ' + sala.kraj +'!');
                        refreshKalendar();
                    }
                }
            }
        }
    }));
	}
	return {
		obojiZauzeca: obojiZauzecaImpl,
		ucitajPodatke: ucitajPodatkeImpl,
		iscrtajKalendar: iscrtajKalendarImpl
	}
}());