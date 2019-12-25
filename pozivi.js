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

    return {
        ucitajPodatke : ucitajPodatke
	}
}());