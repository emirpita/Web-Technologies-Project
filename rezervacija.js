function ucitaj() {
    Pozivi.ucitajPodatke();
    ucitajKalendar();
}

function ucitajKalendar(){
    Pozivi.ucitajPodatke();
    let kalendar = document.getElementsByClassName("kalendar")[0];
    kalendar.innerHTML = "";
    Kalendar.iscrtajKalendar(kalendar, pomocnaMjesec);
    Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("sale")[0].value, 
                    document.getElementById("pocetak").value, document.getElementById("kraj").value);
}


function osvjeziKalendar()
{
        let kalendar = document.getElementsByClassName("kalendar")[0];
        kalendar.innerHTML = "";
        Pozivi.ucitajPodatke();
        Kalendar.iscrtajKalendar(kalendar, pomocnaMjesec);
        Kalendar.ucitajPodatke(psLista, vsLista);
        Kalendar.obojiZauzeca(document.getElementsByClassName("kalendar"), pomocnaMjesec, document.getElementsByClassName("sale")[0].value, 
                        document.getElementById("pocetak").value, document.getElementById("kraj").value);
}