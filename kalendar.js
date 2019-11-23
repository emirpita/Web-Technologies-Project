// podaci za punjenje
var periodicnaSala1 = {
	dan: 5,
	semestar: "zimski",
	pocetak: "09:00",
	kraj: "10:00",
	naziv: "MA",
	predavac: "profesor"
}; //neispravan podatak
var periodicnaSala2 = {
	dan: 0,
	semestar: "zimski",
	pocetak: "10:00",
	kraj: "13:00",
	naziv: "MA",
	predavac: "profesor"
};

var periodicnaSala3 = {
	dan: 5,
	semestar: "ljetni",
	pocetak: "12:00",
	kraj: "13:00",
	naziv: "1-02",
	predavac: "profesor"
};
var periodicnaSala4 = {
	dan: 3,
	semestar: "ljetni",
	pocetak: "12:00",
	kraj: "13:00",
	naziv: "VA1",
	predavac: "profesor"
};

var periodicneSale = [periodicnaSala1, periodicnaSala2, periodicnaSala3, periodicnaSala4];

var vanrednaSala1 = {
	datum: "10.10.2019",
	pocetak: "10:10",
	kraj: "12:00",
	naziv: "MA",
	predavac: "profesor"
};
var vanrednaSala2 = {
	datum: "31.11.2019",
	pocetak: "13:00",
	kraj: "17:00",
	naziv: "MA",
	predavac: "profesor"
}; //neispravan podatak
var vanrednaSala3 = {
	datum: "17.11.2019",
	pocetak: "13:00",
	kraj: "17:00",
	naziv: "MA",
	predavac: "profesor"
};
var vanrednaSala4 = {
	datum: "09.09.2019",
	pocetak: "13:00",
	kraj: "17:00",
	naziv: "VA2",
	predavac: "profesor"
};
var vanrednaSala5 = {
	datum: "09.11.2019",
	pocetak: "13:00",
	kraj: "17:00",
	naziv: "0-01",
	predavac: "profesor"
};

var vanredneSale = [vanrednaSala1, vanrednaSala2, vanrednaSala3, vanrednaSala4, vanrednaSala5];

var ljetniSemestar = ["Februar", "Mart", "April", "Maj", "Juni"];
var zimskiSemestar = ["Januar", "Oktobar", "Novembar", "Decembar"];
var listaMjeseci = ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];

var mapaPocetnihDana = new Map([
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
var mapaMjeseciSaBrojemDana = new Map([
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

var unesenPocetak = 0;
var unesenKraj = 0;

// konstanta 
const MAX_BROJ_DANA = 42; 

var pomocnaMjesec = 10;

let Kalendar = (function() {

	function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj) {

		let pocetniDan = mapaPocetnihDana.get(mjesec);
		let salaIzRezervacije = sala;
		if (pocetak != 0 && kraj != 0) {
			for (let i = 0; i < periodicneSale.length; i++) {
				if (jeLiValidnoPeriodicna(periodicneSale[i].dan, periodicneSale[i].pocetak, periodicneSale[i].kraj) == 1) {
					let zauzeta = unutarVremena(pocetak, kraj, periodicneSale[i].pocetak, periodicneSale[i].kraj);
					if (zauzeta == 1) {
						let prviDanZaBojiti = izracunajPocetniDan(pocetniDan, periodicneSale[i].dan);
						if (periodicneSale[i].semestar == "zimski") {
							if (periodicneSale[i].naziv == salaIzRezervacije) {
								for (let m = 0; m < zimskiSemestar.length; m++) {
									if (listaMjeseci[mjesec] == zimskiSemestar[m]) {
										let kucicaDan = document.getElementsByClassName("slobodna");
										for (let v = prviDanZaBojiti; v < kucicaDan.length; v += 7) {
											kucicaDan[v].className="zauzeta";
										}

									}
								}
							}
						}
						else if (periodicneSale[i].semestar == "ljetni") {
							for (let m = 0; m < ljetniSemestar.length; m++) {
								if (listaMjeseci[mjesec] == ljetniSemestar[m]) {
									let kucicaDan = document.getElementsByClassName("slobodna");
									for (let v = prviDanZaBojiti; v < kucicaDan.length; v += 7) {
										kucicaDan[v].className = "zauzeta";
									}
								}
							}
						}
					}
				}
			}

			for (let i = 0; i < vanredneSale.length; i++) {
				if (jeLiValidnoNeperiodicna(vanredneSale[i].datum, vanredneSale[i].pocetak, vanredneSale[i].kraj) == 1) {
					let zauzeta = unutarVremena(pocetak, kraj, vanredneSale[i].pocetak, vanredneSale[i].kraj);
					if (zauzeta == 1) {
						if (vanredneSale[i].naziv == salaIzRezervacije) {
							let datumSale = vanredneSale[i].datum;
							let pom1 = datumSale.split(".");
							let danSale = pom1[0];
							danSale--;
							let mjesecSale = pom1[1];
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
	}

	function ucitajPodatkeImpl(periodicna, redovna) {
		periodicneSale = periodicna.slice();
		vanredneSale = redovna.slice();
	}

	function iscrtajKalendarImpl(kalendarRef, mjesec) {
		var today = new Date();
		var listaDana = ["PON", "UTO", "SRI", "CET", "PET", "SUB", "NED"];
		var trenutnaGodina = today.getFullYear();
		var firstDay = (new Date(trenutnaGodina + "-" + mjesec + "-01")).getDay() + 2;
		var daysInMonth = 32 - new Date(trenutnaGodina, mjesec, 32).getDate();

		// Dodajemo naziv mjeseca u kalendar
		var nazivMjeseca = document.createElement("div");
		nazivMjeseca.className = "month";
		var listaNazivMjeseca = document.createElement("ul");
		var tekstNazivMjeseca = document.createElement("li");
		tekstNazivMjeseca.setAttribute("id", "trenutniMjesec");
		tekstNazivMjeseca.innerHTML = listaMjeseci[mjesec];
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
		if (mjesec == 4 || mjesec == 6 || mjesec == 9 || mjesec == 11) firstDay--;
		if (mjesec == 2) firstDay -= 3;
		if (mjesec == 0) firstDay = 1;
		var listaKalendar = document.createElement("ul");
		listaKalendar.className = "dani";

		// kreirani i ubaceni prazni dani
		for (var i = 0; i < firstDay; i++) {
			var prazanDan = document.createElement("li");
			prazanDan.className = "prazanDan";
			listaKalendar.append(prazanDan);
		}

        var brojacka = 1;
		// ubacivanje pravih dana
		for (var i = 0; i < daysInMonth; i++) {
			var praviDan = document.createElement("li");
			var unutrasnjiDiv = document.createElement("div");
			unutrasnjiDiv.className = "slobodna";
			praviDan.innerHTML = brojacka;
			praviDan.append(unutrasnjiDiv);
			listaKalendar.append(praviDan);
            brojacka++;
        }
        
        // ubacivanje praznih dana na kraju zbog popunjavanja (ne mora)
        for(var i = daysInMonth; i < MAX_BROJ_DANA; i++) {
            var pomocniDani = document.createElement("li");
            pomocniDani.className = "prazanDan";
            listaKalendar.append(pomocniDani);
		}
		kalendarRef.append(listaKalendar);
	}
	return {
		obojiZauzeca: obojiZauzecaImpl,
		ucitajPodatke: ucitajPodatkeImpl,
		iscrtajKalendar: iscrtajKalendarImpl
	}
}());

function sljedeci() {
	pomocnaMjesec++;
	if (pomocnaMjesec < 12) {

		document.getElementsByClassName("dugmeSljedeci").disabled = false;
		let today = new Date();
		let pozicija = today.getMonth();
		let kalendar = document.getElementsByClassName("kalendar")[0];
		kalendar.innerHTML = "";
		let trenutniMjesec = new Date().getMonth();
		Kalendar.iscrtajKalendar(kalendar, pomocnaMjesec);
		Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("saleIzbor")[0].value,
			document.getElementById("pocetak").value, document.getElementById("kraj").value);

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
		let today = new Date();
		let kalendar = document.getElementsByClassName("kalendar")[0];
		kalendar.innerHTML = "";
		let trenutniMjesec = new Date().getMonth();
		Kalendar.iscrtajKalendar(kalendar, pomocnaMjesec);
		Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("sale")[0].value,
			document.getElementById("pocetak").value, document.getElementById("kraj").value);
	}
	else {
		pomocnaMjesec = 0;
		document.getElementsByClassName("dugmePrethodni").disabled = true;
	}
}

function ucitajKalendar() {
	let kalendar = document.getElementsByClassName("kalendar")[0];
	kalendar.innerHTML = "";
	Kalendar.iscrtajKalendar(kalendar, 10);
	Kalendar.ucitajPodatke(periodicneSale, vanredneSale);
	Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("sale")[0].value,
		document.getElementById("pocetak").value, document.getElementById("kraj").value);
}

function izracunajPocetniDan(pocetniDan, danListe) {
	let prviDanZaBojiti = danListe;
	if (pocetniDan == 6 && danListe != 6) {
		prviDanZaBojiti = prviDanZaBojiti + 1;
	}
	else if (pocetniDan > danListe) {
		prviDanZaBojiti = danListe + pocetniDan - 1;
	}
	else if (danListe > pocetniDan) {
		prviDanZaBojiti = danListe - pocetniDan;
	}
	else if (danListe == pocetniDan) {
		prviDanZaBojiti = 0;
		if (pocetniDan - 7 > 0) pocetniDan -= 7;
	}
	if ((danListe == 0 && (pomocnaMjesec == 9 || pomocnaMjesec == 0))) {
		prviDanZaBojiti--;
		prviDanZaBojiti += 7;
	}
	if (pocetniDan == 0) {
		prviDanZaBojiti = danListe;
	}
	if (pomocnaMjesec == 5) prviDanZaBojiti -= 2;
	if (pomocnaMjesec == 5 && (danListe == 5 || danListe == 6)) prviDanZaBojiti += 2;
	if (pomocnaMjesec == 4 && (danListe == 0 || danListe == 1)) prviDanZaBojiti += 4;
	return prviDanZaBojiti;
}

function unutarVremena(pocetak, kraj, salaPocetak, salaKraj) {
	let zauzeta = 0;
	if (pocetak > salaPocetak && pocetak < salaKraj)
		zauzeta = 1;
	else if (pocetak < salaPocetak && kraj > salaPocetak)
		zauzeta = 1;
	else if (pocetak == salaPocetak || kraj == salaKraj)
		zauzeta = 1;
	return zauzeta;
}

function unesenoVrijemeZaPocetak() {
	unesenPocetak = 1;
}

function unesenoVrijemeZaKraj() {
	unesenKraj = 1;
}

function refreshKalendar() {
	let kalendar = document.getElementsByClassName("kalendar")[0];
	kalendar.innerHTML = "";
	Kalendar.iscrtajKalendar(kalendar, pomocnaMjesec);
	Kalendar.ucitajPodatke(periodicneSale, vanredneSale);
	Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("sale")[0].value,
		document.getElementById("pocetak").value, document.getElementById("kraj").value);
}

function jeLiValidnoPeriodicna(danZaValidaciju, pocetakZaValidaciju, krajZaValidaciju) {
	if (danZaValidaciju > 6 || danZaValidaciju < 0) return 0;

	var satiPocetak = pocetakZaValidaciju.split(":")[0];
	var minutePocetak = pocetakZaValidaciju.split(":")[1];

	var satiKraj = krajZaValidaciju.split(":")[0];
	var minuteKraj = krajZaValidaciju.split(":")[1];

	if (satiPocetak > satiKraj) return 0;
	if (satiPocetak > 24 || satiPocetak < 0) return 0;
	if (satiKraj > 24 || satiKraj < 0) return 0;

	return 1;
}

function jeLiValidnoNeperiodicna(datumZaValidaciju, pocetakZaValidaciju, krajZaValidaciju) {
	let pom1 = datumZaValidaciju.split(".");
	let danSale = pom1[0];
	let mjesecSale = pom1[1];
	mjesecSale = parseInt(mjesecSale);
	mjesecSale--;
	let brojDanaMjeseca = mapaMjeseciSaBrojemDana.get(mjesecSale);

	if (mjesecSale > 12 || mjesecSale < 0) return 0;
	if (danSale > brojDanaMjeseca) return 0;

	var satiPocetak = pocetakZaValidaciju.split(":")[0];
	var minutePocetak = pocetakZaValidaciju.split(":")[1];

	var satiKraj = krajZaValidaciju.split(":")[0];
	var minuteKraj = krajZaValidaciju.split(":")[1];

	if (satiPocetak > satiKraj) return 0;
	if (satiPocetak > 24 || satiPocetak < 0) return 0;
	if (satiKraj > 24 || satiKraj < 0) return 0;

	return 1;
}