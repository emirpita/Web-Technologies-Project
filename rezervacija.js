function ucitaj() {
    // Mora se eliminisati Pozivi.ucitajPodatke();
    Pozivi.ucitajPodatkeBaza();
    Pozivi.ucitajOsobljeBaza();
    ucitajKalendar();
}


// koristimo mapu, ucitavamo kao (id, osoba), zato je mapa
/* 
   Osoba objekat = {ime: ime, prezime: prezime, uloga: uloga}
*/

let osobljeIzBaze = new Map();

function loadListuOsoblja(osoblje) {
   var selectOsoblje = document.getElementsByClassName("listaOsoblje")[0];
   for (let i = 0; i < osoblje.length; i++) {
      var option = document.createElement("option");
      option.text = "" + osoblje[i].ime + " " + osoblje[i].prezime;
      option.value = "" + osoblje[i].ime + " " + osoblje[i].prezime;
      selectOsoblje.appendChild(option);

      // osobu cuvamo kao ime,prezime,uloga
      // mozemo i kao objekat
      let osoba = { "ime": osoblje[i].ime, 
         "prezime": osoblje[i].prezime, 
         "uloga": osoblje[i].uloga };
      osobljeIzBaze.set(i, osoba);
   }
}