let listaSlika; // ili ostaviti prazno ili staviti []
let indeksDosadUcitanih = 0;

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
    let i = 0; // da bude vidljivo u funkciji
    if(duzina>=3) {
        for(i=indeksDosadUcitanih; i<(indeksDosadUcitanih + 3); i++) {
            // slike su ucitane staticki
            let box = document.createElement("div");
            var slika = document.createElement('img'); 
            slika.src = "http://localhost:8080/" + listaSlikaArg[i]; 
            box.appendChild(slika);   
            kontejner.appendChild(box);
            // ucitane prve tri slike
        }
        indeksDosadUcitanih = i;
    } else {
        for(let i=0; i<duzina; i++) {
            // slike su ucitane staticki
            let box = document.createElement("div");
            var slika = document.createElement('img'); 
            slika.src = "http://localhost:8080/" + listaSlikaArg[i]; 
            box.appendChild(slika);   
            kontejner.appendChild(box);
            // ucitane prve tri slike
        }
        // ako dodje dovde, nema vise slika za ucitavanje
        // disable dugme sljedeci
        document.getElementById("dugmeSljedeci").disabled = true;
    }
}

function next() {
    document.getElementsByClassName("grid-container")[0].innerHTML = "";
    ubaciSlike(listaSlika);
}

function previous() {

}
