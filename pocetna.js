var listaSlika = []; // ili ostaviti prazno ili staviti []
var indeksDosadUcitanih = 0;

// ucitava sve slike sa servera (kesira ih)
function cacheSlike() {
    Pozivi.ucitajSlike();
}

function ucitajPocetnu() {
    cacheSlike();
    let duzina = listaSlika.length;
    let kontejner = document.getElementsByClassName("grid-container")[0];
    if(duzina>=3) {
        for(let i=0; i<3; i++) {
            // slike su ucitane staticki
            let box = document.createElement("div");
            var slika = document.createElement('img'); 
            slika.src = "http://localhost:8080/" + listaSlika[i]; 
            box.appendChild(slika);   
            kontejner.appendChild(box);
            // ucitane prve tri slike
        }
    } else {
        for(let i=0; i<duzina; i++) {
            // slike su ucitane staticki
            let box = document.createElement("div");
            var slika = document.createElement('img'); 
            slika.src = "http://localhost:8080/" + listaSlika[i]; 
            box.appendChild(slika);   
            kontejner.appendChild(box);
            // ucitane prve tri slike
        }
    }
}

function next() {
    
}

function previous() {
    
}
