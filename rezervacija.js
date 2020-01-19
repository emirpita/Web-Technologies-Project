function ucitaj() {
    // Mora se eliminisati Pozivi.ucitajPodatke();
    Pozivi.ucitajPodatke();
    Pozivi.ucitajPodatkeIzBaze();
    ucitajKalendar();
}

let mapaOsobljaIzBaze = new Map();

function loadListuOsoblja(osoblje) {
   var selectOsoblje = document.getElementsByClassName("osobljeIzbor")[0];
   for (let i = 0; i < osoblje.length; i++) {
      var option = document.createElement("option");
      option.text = "" + osoblje[i].ime + " " + osoblje[i].prezime;
      option.value = "" + osoblje[i].ime + " " + osoblje[i].prezime;
      selectOsoblje.appendChild(option);
   }
}