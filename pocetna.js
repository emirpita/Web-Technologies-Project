let listaSlika; // ili ostaviti prazno ili staviti []
let indeksDosadUcitanih = 0;

// konstante
const BROJ_SLIKA_PO_STRANICI = 3;

// ucitava sve slike sa servera (kesira ih)
function cacheSlike(slikeArg) {
    console.log("usao u ucitavanje");
    listaSlika = Array.from(slikeArg);
    console.log("ucitava");
}

//ISPRAVNA SOLUCIJA
function ajaxCaller () {
    Pozivi.ucitajSlike();
}

function ubaciSlike(listaSlikaArg) {
    // Pozivi.ucitajSlike();
    listaSlika = listaSlikaArg;
    let duzina = listaSlikaArg.length;
    let kontejner = document.getElementsByClassName("grid-container")[0];
    document.getElementsByClassName("grid-container")[0].innerHTML = "";
    let i = 0; // da bude vidljivo u funkciji
    if(indeksDosadUcitanih==0) {
        document.getElementById("dugmePrethodni").disabled = true;
    } else {
        document.getElementById("dugmePrethodni").disabled = false;
    }
    // granicni slucaj 1
    if((duzina - indeksDosadUcitanih)>=BROJ_SLIKA_PO_STRANICI) {
        for(i = indeksDosadUcitanih; i<(indeksDosadUcitanih + BROJ_SLIKA_PO_STRANICI); i++) {
            // slike su ucitane staticki
            let box = document.createElement("div");
            var slika = document.createElement('img'); 
            slika.src = "http://localhost:8080/" + listaSlikaArg[i]; 
            box.appendChild(slika);   
            kontejner.appendChild(box);
            // ucitane prve tri slike
        }
        indeksDosadUcitanih += BROJ_SLIKA_PO_STRANICI;
        console.log("indeksDosadUcitanih " + indeksDosadUcitanih);
    } else {
        // sad crtamo preostale slike
        console.log("usao ovdje");
        i = indeksDosadUcitanih;
        console.log("indeksDosadUcitanih: " + indeksDosadUcitanih + "\ni: " + i + "\nduzina: " + duzina + "\n(duzina-indeksDosadUcitanih+1) " +(duzina-indeksDosadUcitanih+1));
        for(i = indeksDosadUcitanih; i < duzina; i++) {
            // slike su ucitane staticko
            let box = document.createElement("div");
            var slika = document.createElement('img'); 
            slika.src = "http://localhost:8080/" + listaSlikaArg[i]; 
            box.appendChild(slika);   
            kontejner.appendChild(box);
            // ucitane prve tri slike
        }
        //indeksDosadUcitanih = i;
        // ako dodje dovde, nema vise slika za ucitavanje
        // disable dugme sljedeci
        document.getElementById("dugmeSljedeci").disabled = true;
    }
}

function next() {
    // document.getElementsByClassName("grid-container")[0].innerHTML = "";
    ubaciSlike(listaSlika);
}

function previous() {
    // slicno kao ubaci slike, samo sto indeks krece od najblizeg kraja i ide nazad
    // provjeravamo dokle je indeks dosad ucitanih

    let listaSlikaArg = listaSlika;
    let duzina = listaSlikaArg.length;
    let kontejner = document.getElementsByClassName("grid-container")[0];
    document.getElementsByClassName("grid-container")[0].innerHTML = "";
    let i = 0; // da bude vidljivo u funkciji

    // provjera je li dosao do kraja
    if(indeksDosadUcitanih>0 && indeksDosadUcitanih<duzina) {
        document.getElementById("dugmeSljedeci").disabled = false; // mislim ok
    } 


    if(indeksDosadUcitanih==0) {
        document.getElementById("dugmePrethodni").disabled = true;
    } else {
        document.getElementById("dugmePrethodni").disabled = false;
        // crtanje 
        // redom ucitavanje
        for(i = (indeksDosadUcitanih - BROJ_SLIKA_PO_STRANICI); i < indeksDosadUcitanih; i++) {
            // slike su ucitane staticki
            let box = document.createElement("div");
            var slika = document.createElement('img'); 
            slika.src = "http://localhost:8080/" + listaSlikaArg[i]; 
            box.appendChild(slika);   
            kontejner.appendChild(box);
        }
        indeksDosadUcitanih -= BROJ_SLIKA_PO_STRANICI;
        console.log("indeksDosadUcitanih " + indeksDosadUcitanih);
    }
    
    // TREBA
    if(indeksDosadUcitanih==0) {
        document.getElementById("dugmePrethodni").disabled = true;
        document.getElementById("dugmeSljedeci").disabled = false; // mislim ok
        indeksDosadUcitanih = BROJ_SLIKA_PO_STRANICI;
    } else {
        document.getElementById("dugmePrethodni").disabled = false;
        //document.getElementById("dugmeSljedeci").disabled = true; // mislim ne treba
    }
}
