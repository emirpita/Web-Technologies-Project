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

var psLista, vsLista;

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
							let danSale = temp[0];
							danSale--;
							let mjesecSale = temp[1];
							mjesecSale--;
							if (pomocnaMjesec == mjesecSale) {
								let kucicaDan = document.getElementsByClassName("slobodna");
								kucicaDan[danSale].className = "zauzeta";
							}
						}
					}
				}
			}
		}

	function ucitajPodatkeImpl(periodicna, redovna) {
		psLista = periodicna.slice();
		vsLista = redovna.slice();
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
		document.querySelectorAll(".dani li")
		.forEach(d => d.addEventListener("click", function() {
			if(confirm("Želite li rezervisati ovaj termin?")) {
				let dan = parseInt(d.innerHTML);
				console.log(dan);
				let mjesec = pomocnaMjesec + 1;
				let nazivSaleLista = document.getElementsByClassName("sale");
				let nazivSale = nazivSaleLista[0].selectedIndex.value;
				let periodicna = document.getElementById("periodicna").checked;
				/*var value = e.options[e.selectedIndex].value;
				var text = e.options[e.selectedIndex].text;*/
				let pocetak = document.getElementById("pocetak").value;
				let kraj = document.getElementById("kraj").value;
				let datum = dan + "." + mjesec + ".2019"; // moze i sa Date objektom za godinu
				let sala = {
					datum:datum,
					pocetak:pocetak,
					kraj:kraj,
					naziv:nazivSale,
					predavac:"predavac", // nebitno
					// dodatno
					periodicna:periodicna,
				 };
				 console.log(sala);
				Pozivi.posaljiSaluNaServer(sala);
			}
		}));
	}
	return {
		obojiZauzeca: obojiZauzecaImpl,
		ucitajPodatke: ucitajPodatkeImpl,
		iscrtajKalendar: iscrtajKalendarImpl
	}
}());