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
    

    function posaljiSaluNaServer(salaZaPoslati)
    {
       let ajax = new XMLHttpRequest(); 
       ajax.open("POST", "//localhost:8080/rezervacija.html", true);
       ajax.setRequestHeader("Content-Type", "application/json");
       ajax.send(JSON.stringify(salaZaPoslati));
   
       ajax.onreadystatechange = function () {
           if (ajax.readyState == 4 && ajax.status == 200) {
               let jsonText = JSON.parse(ajax.responseText);
               if (jsonText.valid == 1){
                   Kalendar.ucitajPodatke(jsonText.periodicna, jsonText.vanredna);
                   refreshKalendar();
               }
               else 
               {
                   alert("Nije moguće rezervisati salu " + salaZaPoslati.naziv + " za navedeni datum " + datumZaDodavanjeDrugiFormat + " i termin od " +salaZaPoslati.pocetak+ " do " + salaZaPoslati.kraj +"!");
                   // mozda suvisno, ali radi
                   Pozivi.ucitajPodatke();
                   refreshKalendar();
                   // moze i ovo
               }
   
           }
       }
    }


    return {
        ucitajPodatke : ucitajPodatke,
        posaljiSaluNaServer : posaljiSaluNaServer
	}
}());