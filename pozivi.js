// klijent

// ipak se treba praviti rezervacija.js i sl

let Pozivi = (function () {
    
    function ucitajPodatke() {
        var ajax = new XMLHttpRequest();

        ajax.open("GET", "http://localhost:8080/unos", true);
        ajax.send();

        ajax.onreadystatechange = function () {
	        if (ajax.readyState == 4 && ajax.status == 200) {
                let jsonText = JSON.parse(ajax.responseText);
                Kalendar.ucitajPodatke(jsonText.periodicna, jsonText.vanredna);
	        }
        }
    }

    // dodati klijentsku validaciju, ne mora, ali eto (na serveru se validira)
    function posaljiSaluNaServer(salaZaPoslati) {
        var ajax = new XMLHttpRequest();

        ajax.open("POST", "http://localhost:8080/rezervacija.html", true);
        ajax.setRequestHeader("Content-type", "application/json");
        ajax.send(JSON.stringify(salaZaPoslati));

        // poslan zahtjev

        ajax.onreadystatechange = function () {
	        if (ajax.readyState == 4 && ajax.status == 200) {
            // kada je obradjen, izvrsava se ovo
            let jsonText = JSON.parse(ajax.responseText);
            Kalendar.ucitajPodatke(jsonText.periodicna, jsonText.vanredna);
	    }
    }
}

    return {
        ucitajPodatke : ucitajPodatke,
        posaljiSaluNaServer : posaljiSaluNaServer
	}
}());