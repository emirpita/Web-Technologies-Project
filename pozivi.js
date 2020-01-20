import { json } from "body-parser";

// klijent
let Pozivi = (function() {
	let vanrednaZauzeca = [];
	let periodicnaZauzeca = [];

	function ucitajPodatkeFajl() {
		var ajax = new XMLHttpRequest();

		ajax.open("GET", "http://localhost:8080/unos", true);
		ajax.send();

		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				let jsonText = JSON.parse(ajax.responseText);
				let kalendar = document.getElementsByClassName("kalendar")[0];
				kalendar.innerHTML = "";
				Kalendar.ucitajPodatke(jsonText.periodicna, jsonText.vanredna);
				Kalendar.iscrtajKalendar(kalendar, pomocnaMjesec);
				Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("sale")[0].value,
					document.getElementById("pocetak").value, document.getElementById("kraj").value);
			}
		}
	}

	// nova verzija funkcije ucitaj podatke
	function ucitajPodatkeBaza() {
		var ajax = new XMLHttpRequest();

		ajax.open("GET", "http://localhost:8080/getRezervacije", true);
		ajax.send();

		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				// ucitati u periodicnaZauzeca i u VanrednaZauzeca
				let jsonText = JSON.parse(ajax.responseText);
				let kalendar = document.getElementsByClassName("kalendar")[0];
				kalendar.innerHTML = "";
				vanrednaZauzeca = jsonText.vanredna;
				periodicnaZauzeca = jsonText.periodicna;
				// moze se i periodicnaZauzeca i vanrednaZauzeca
				Kalendar.ucitajPodatke(jsonText.periodicna, jsonText.vanredna);
				Kalendar.iscrtajKalendar(kalendar, pomocnaMjesec);
				Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("sale")[0].value,
					document.getElementById("pocetak").value, document.getElementById("kraj").value);
			}
		}
	}


	function posaljiSaluNaServer(salaZaPoslati) {
		let ajax = new XMLHttpRequest();
		ajax.open("POST", "//localhost:8080/rezervacija.html", true);
		ajax.setRequestHeader("Content-Type", "application/json");
		ajax.send(JSON.stringify(salaZaPoslati));

		ajax.onreadystatechange = function() {
			if (ajax.readyState == 4 && ajax.status == 200) {
				let jsonText = JSON.parse(ajax.responseText);
				if (jsonText == 1) {
					Pozivi.ucitajPodatkeBaza();
					Kalendar.ucitajPodatke(periodicnaZauzeca, vanrednaZauzeca);
					refreshKalendar();
				}
				else {
					alert("Nije moguće rezervisati salu " + salaZaPoslati.naziv + " za navedeni datum " + datumZaDodavanjeDrugiFormat + " i termin od " + salaZaPoslati.pocetak + " do " + salaZaPoslati.kraj + "!");
					// mozda suvisno, ali radi
					Pozivi.ucitajPodatkeBaza();
					Kalendar.ucitajPodatke(periodicnaZauzeca, vanrednaZauzeca);
					refreshKalendar();
					// moze i ovo
				}

			}
		}
	}

	// zadatak 3
	function ucitajSlike() {
		var ajax = new XMLHttpRequest();

		ajax.open("GET", "http://localhost:8080/slike", true); // true
		ajax.send();

		ajax.onreadystatechange = function () {
        if(ajax.readyState === 4) {
            if(ajax.status === 200 || ajax.status == 0) {   
				let jsonText = JSON.parse(ajax.responseText);
				console.log(jsonText.slike);
				cacheSlike(jsonText.slike);
				ubaciSlike(jsonText.slike);
			}
		}
	}
}

	function ucitajOsobljeBaza() {
		var ajax = new XMLHttpRequest();

		ajax.open("GET", "http://localhost:8080/osoblje", true); // true
		ajax.send();

		ajax.onreadystatechange = function () {
			if(ajax.readyState === 4) {
        		if(ajax.status === 200 || ajax.status == 0) {   
					loadListuOsoblja(JSON.parse(ajax.responseText));
				}
			}
		}
	}

	function dajOsobljeUSalama() {
		var ajax = new XMLHttpRequest();

		ajax.open("GET", "http://localhost:8080/osobeUSali", true); // true
		ajax.send();

		ajax.onreadystatechange = function () {
			if(ajax.readyState === 4) {
        		if(ajax.status === 200 || ajax.status == 0) {   
					// kreiramo privremenu listu
					let lista = [];
					let jsonLista = Array.from(JSON.parse(ajax.responseText)); // mozda moze bez ovog
					for(let i = 0; i < jsonLista.length; i++) {
						lista.push({ime: jsonLista[i].ime, 
							prezime: jsonLista[i].prezime,
							uloga: jsonLista[i].uloga,
							naziv: jsonLista[i].naziv
						});
					}
					upisiSpisakOsoba(podaci);
				}
			}
		}
    }

	
	return {
		ucitajPodatkeFajl: ucitajPodatkeFajl,
		ucitajPodatkeBaza: ucitajPodatkeBaza,
		posaljiSaluNaServer: posaljiSaluNaServer,
		ucitajSlike: ucitajSlike,
		ucitajOsobljeBaza: ucitajOsobljeBaza,
		dajOsobljeUSalama: dajOsobljeUSalama
	}
}());