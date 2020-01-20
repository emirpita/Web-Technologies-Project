var listaOsoblje = [];

function loaduj() {
    Pozivi.ucitajOsobljeBaza();
    Pozivi.dajOsobljeUSalama();
    setInterval(function(){ 
        Pozivi.ucitajOsobljeBaza();
        Pozivi.dajOsobljeUSalama();
    }, 30000);
}


function upisiSpisakOsoba(podaci) {
    let sadrzajListe = "";
    let spisakOsoblje = document.getElementById("spisakOsoblje");
    spisakOsoblje.innerHTML = "";
    let jeLiUSali = false;
    for (let i = 0; i < listaOsoblje.length; i++) {
        for (let j = 0; j < podaci.length; j++) {
            if (listaOsoblje[i].ime == podaci[j].ime && listaOsoblje[i].prezime == podaci[j].prezime) {
                sadrzajListe = sadrzajListe + podaci[j].ime + " " + podaci[j].prezime + " (" + podaci[j].uloga + ") je u sali " +  podaci[j].naziv + "<br>" ;
                jeLiUSali = true;
            }
        }
        if (jeLiUSali == false) {
            sadrzajListe = sadrzajListe + listaOsoblje[i].ime + " " +  listaOsoblje[i].prezime + " (" +  listaOsoblje[i].uloga + ") je u kancelariji "+ "<br>" ; 
        }
        jeLiUSali = false;
    }
    spisakOsoblje.innerHTML = sadrzajListe;
}

function setListaOsoblje(lista) {
    listaOsoblje = [];
    for ( let i = 0; i < lista.length; i++) {
       listaOsoblje.push({ime: lista[i].ime, prezime: lista[i].prezime, uloga: lista[i].uloga});
    }
}