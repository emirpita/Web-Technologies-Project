
let assert = chai.assert;
describe('Kalendar', function() {
 describe('iscrtajKalendar()', function() {
   it('Pozivanje iscrtajKalendar za mjesec sa 30 dana, novembar', function() {
    document.getElementsByClassName("kalendar")[0].innerHTML = "";
     Kalendar.iscrtajKalendar(document.getElementsByClassName("kalendar")[0], 10);
     let kal = document.getElementsByClassName("kalendar");
     let brojDana = kal[0].querySelectorAll("slobodna");
     assert.equal(brojDana.length, 30,"Ocekivano: 30 dana");
   });

   it('Pozivanje iscrtajKalendar za mjesec sa 30 dan - Juni', function() {
    document.getElementsByClassName("cal")[0].innerHTML = "";
    Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 5);
    let tabele = document.getElementsByClassName("kalendar");
    let tabela = tabele[tabele.length-1];
    let brojDana = document.getElementsByClassName("bojaCelije");
    //Potrebno oduzeti broj prethodno ucitanih elemenata sa klasom boja celija
    assert.equal(brojDana.length, 30,"Broj dana u mjesecu treba biti 30");
  });
  it('Pozivanje iscrtajKalendar za mjesec sa 30 dan - Oktobar', function() {
    document.getElementsByClassName("cal")[0].innerHTML = "";
    Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 9);
    let tabele = document.getElementsByClassName("kalendar");
    let tabela = tabele[tabele.length-1];
    let brojDana = document.getElementsByClassName("bojaCelije");
    //Potrebno oduzeti broj prethodno ucitanih elemenata sa klasom boja celija
    assert.equal(brojDana.length, 31,"Broj dana u mjesecu treba biti 31");
  });

  it('Pozivanje iscrtajKalendar za trenutni mjesec: o─Źekivano je da je 1. dan u petak', function() {
    let datum = new Date();
    let mjesec = datum.getMonth();
    let trenutnaGodina = datum.getFullYear();
    let firstDay = (new Date(trenutnaGodina + "-" + mjesec + "-01")).getDay()+2;
    document.getElementsByClassName("cal")[0].innerHTML = "";
    Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 10);
    let tabele = document.getElementsByClassName("kalendar");
    let tabela = tabele[tabele.length-1];
    let brojDana = tabela.querySelectorAll("body>div>table>tr>td");
    let pomocnaDani = document.getElementsByClassName("brojDana");
    //potrebno je da ocitamo vrijednost sa 18 pozicije (pocetni dan, subota)
    assert.equal(brojDana[18].children[0].children[0].children[0].innerHTML, "1","O─Źekivano je da je 1. dan u petak");
  });

  it('Pozivanje iscrtajKalendar za trenutni mjesec: o─Źekivano je da je 30. dan u subotu', function() {
    let int_d = new Date(2008, 11+1,1);
    let datum = new Date(int_d - 1);
    let mjesec = datum.getMonth();
    let trenutnaGodina = datum.getFullYear();
    let zadnjiDan = datum.getDay()+2;
    document.getElementsByClassName("cal")[0].innerHTML = "";
    Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 10);
    let tabele = document.getElementsByClassName("kalendar");
    let tabela = tabele[tabele.length-1];
    let brojDana = tabela.querySelectorAll("body>div>table>tr>td");
    let pomocnaDani = document.getElementsByClassName("brojDana");
    assert.equal(brojDana[47].children[0].children[0].children[0].innerHTML, "30","O─Źekivano je da je zadnji dan u subotu");
  });

  it('Pozivanje iscrtajKalendar za januar', function() {
    let int_d = new Date(2008, 11+1,1);
    let datum = new Date(int_d - 1);
    let mjesec = datum.getMonth();
    let trenutnaGodina = datum.getFullYear();
    let zadnjiDan = datum.getDay()+2;
    document.getElementsByClassName("cal")[0].innerHTML = "";
    Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 0);
    let tabele = document.getElementsByClassName("kalendar");
    let tabela = tabele[tabele.length-1];
    let brojDana = tabela.querySelectorAll("body>div>table>tr>td");
    let brojeviIduRedom = true;
    let pomocnaDani = document.getElementsByClassName("brojDana");
    let pom = 1;
    for (let j = 151; j < pomocnaDani.length; j++)
    {
      if (parseInt(pomocnaDani[j].children[0].innerHTML) == pom){
          pom++;
          continue;
      }
      else 
      {
        brojeviIduRedom = false;
        break;
      }
    }
    assert.equal(brojeviIduRedom, true,"O─Źekivano je da brojevi dana idu od 1 do 31 po─Źev┼íi od utorka");
  });

  it('Provjera da li je tekst unutar kalendara jednak mjesecu', function() {
    let int_d = new Date(2008, 11+1,1);
    let datum = new Date(int_d - 1);
    let mjesec = datum.getMonth();
    let trenutnaGodina = datum.getFullYear();
    let zadnjiDan = datum.getDay()+2;
    document.getElementsByClassName("cal")[0].innerHTML = "";
    Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 0);
    let tabele = document.getElementsByClassName("kalendar");
    let tabela = tabele[tabele.length-1];
    let brojDana = tabela.querySelectorAll("body>div>table>tr>td");
    //vidjeti da li se moze dobiti vrijednost celije
    assert.equal(brojDana[0].innerHTML, "Januar", "O─Źekivano je da mjesec bude januar");
  });
 });

 describe('obojiZauzeca()', function() {

  it('Dva puta uzastopno pozivanje obojiZauzece: o─Źekivano je da boja zauze─ça ostane ista', function() {
 
      
      let periodicnaSala1 = {dan:1, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala2 = {dan:2, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala3 = {dan:3, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala4 = {dan:4, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let listaPeriodicnihSala = [periodicnaSala1,periodicnaSala2,periodicnaSala3,periodicnaSala4];
  
      let vanrednaSala1 = {datum:"30.09.2019", pocetak:"13:00", kraj:"14:00", naziv:"VA1", predavac:"profesor"};
      let vanrednaSala2 = {datum:"10.12.2019", pocetak:"13:00", kraj:"14:00", naziv:"0-01", predavac:"profesor"};
      let listaVanrednihSala = [vanrednaSala1,vanrednaSala2];  

      document.getElementsByClassName("cal")[0].innerHTML = "";
      Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 9);
      Kalendar.ucitajPodatke(listaPeriodicnihSala, listaVanrednihSala);
      Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 9, "0-01", "11:00", "15:00");
      Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 9, "0-01", "11:00", "15:00");
  
    });

  it('Pozivanje obojiZauzece kada su u podacima svi termini u mjesecu zauzeti', function() {
 
      let periodicnaSala0 = {dan:0, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala1 = {dan:1, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala2 = {dan:2, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala3 = {dan:3, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala4 = {dan:4, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala5 = {dan:5, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let periodicnaSala6 = {dan:6, semestar:"zimski", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};
      let listaPeriodicnihSala = [periodicnaSala0,periodicnaSala1,periodicnaSala2,periodicnaSala3,periodicnaSala4,periodicnaSala5,periodicnaSala6];
  
      let vanrednaSala1 = {datum:"30.09.2019", pocetak:"13:00", kraj:"14:00", naziv:"VA1", predavac:"profesor"};
      let vanrednaSala2 = {datum:"10.12.2019", pocetak:"13:00", kraj:"14:00", naziv:"0-01", predavac:"profesor"};
      let listaVanrednihSala = [vanrednaSala1,vanrednaSala2];  

      document.getElementsByClassName("cal")[0].innerHTML = "";
      Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 11);
      Kalendar.ucitajPodatke(listaPeriodicnihSala, listaVanrednihSala);
      Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 11, "0-01", "11:00", "15:00");
  
    });

  
 it('Pozivanje obojiZauzeca kada podaci nisu u─Źitani: o─Źekivana vrijednost da se ne oboji niti jedan dan', function() {
   let listaVanrednihSala = [];
   let listaPeriodicnihSala = [];
   document.getElementsByClassName("cal")[0].innerHTML = "";
   Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 10);
   Kalendar.ucitajPodatke(listaPeriodicnihSala, listaVanrednihSala);
   Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 10, "0-01", "10:00", "11:00");
 });

it('Pozivanje obojiZauzece kada u podacima postoji periodi─Źno zauze─çe za drugi semestar', function() {

  var periodicnaSala4 = {dan:3, semestar:"ljetni", pocetak:"12:00", kraj:"13:00", naziv:"VA1", predavac:"profesor"};

  let listaPeriodicnihSala = [ periodicnaSala4];

  let vanrednaSala1 = {datum:"30.09.2019", pocetak:"13:00", kraj:"14:00", naziv:"0-01", predavac:"profesor"};
  let vanrednaSala2 = {datum:"30.09.2019", pocetak:"13:00", kraj:"14:00", naziv:"0-01", predavac:"profesor"};

  let listaVanrednihSala = [vanrednaSala1,vanrednaSala2];  

  document.getElementsByClassName("cal")[0].innerHTML = "";
  Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 4);
  Kalendar.ucitajPodatke(listaPeriodicnihSala, listaVanrednihSala);
  Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 4, "VA1", "12:00", "15:00");
});

it('Pozivanje obojiZauzece kada u podacima postoji zauze─çe termina ali u drugom mjesecu', function() {
 
  var periodicnaSala4 = {dan:3, semestar:"ljetni", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};

  let listaPeriodicnihSala = [periodicnaSala4];

  let vanrednaSala1 = {datum:"30.09.2019", pocetak:"13:00", kraj:"14:00", naziv:"VA1", predavac:"profesor"};
  let vanrednaSala2 = {datum:"10.12.2019", pocetak:"13:00", kraj:"14:00", naziv:"0-01", predavac:"profesor"};
  let listaVanrednihSala = [vanrednaSala1,vanrednaSala2];  

  document.getElementsByClassName("cal")[0].innerHTML = "";
  Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 11);
  Kalendar.ucitajPodatke(listaPeriodicnihSala, listaVanrednihSala);
  Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 11, "VA1", "12:00", "15:00");
 
});

it('Pozivanje ucitajPodatke, obojiZauzeca, ucitajPodatke - drugi podaci, obojiZauzeca', function() {
 
  var periodicnaSala4 = {dan:3, semestar:"ljetni", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};

  let listaPeriodicnihSala = [periodicnaSala4];

  let vanrednaSala1 = {datum:"30.09.2019", pocetak:"13:00", kraj:"14:00", naziv:"VA1", predavac:"profesor"};
  let vanrednaSala2 = {datum:"10.12.2019", pocetak:"13:00", kraj:"14:00", naziv:"0-01", predavac:"profesor"};
  let listaVanrednihSala = [vanrednaSala1,vanrednaSala2];  

  document.getElementsByClassName("cal")[0].innerHTML = "";
  Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 11);
  Kalendar.ucitajPodatke(listaPeriodicnihSala, listaVanrednihSala);
  Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 11, "VA1", "12:00", "15:00");
  listaPeriodicnihSala = [];
  listaVanrednihSala = [];
  Kalendar.ucitajPodatke(listaPeriodicnihSala, listaVanrednihSala);
  Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 11, "VA1", "12:00", "15:00");
  
});


it('Ne pozove se ucitaj podatke: oceikavano da se nista ne oboji', function() {
 
  var periodicnaSala4 = {dan:3, semestar:"ljetni", pocetak:"12:00", kraj:"13:00", naziv:"0-01", predavac:"profesor"};

  let listaPeriodicnihSala = [periodicnaSala4];

  let vanrednaSala1 = {datum:"30.09.2019", pocetak:"13:00", kraj:"14:00", naziv:"VA1", predavac:"profesor"};
  let vanrednaSala2 = {datum:"10.12.2019", pocetak:"13:00", kraj:"14:00", naziv:"0-01", predavac:"profesor"};
  let listaVanrednihSala = [vanrednaSala1,vanrednaSala2];  

  document.getElementsByClassName("cal")[0].innerHTML = "";
  Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 7);
  Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 7, "0-06", "12:00", "15:00");

}); 

it('Testiranje rada vanrednih sala', function() {
 
  let listaPeriodicnihSala = [];

  let vanrednaSala1 = {datum:"30.11.2019", pocetak:"13:00", kraj:"14:00", naziv:"VA1", predavac:"profesor"};
  let vanrednaSala2 = {datum:"10.11.2019", pocetak:"13:00", kraj:"14:00", naziv:"VA1", predavac:"profesor"};
  let listaVanrednihSala = [vanrednaSala1,vanrednaSala2];  

  document.getElementsByClassName("cal")[0].innerHTML = "";
  Kalendar.iscrtajKalendar(document.getElementsByClassName("cal")[0], 10);
  Kalendar.ucitajPodatke(listaPeriodicnihSala, listaVanrednihSala);
  Kalendar.obojiZauzeca(document.getElementsByClassName("cal")[0], 10, "VA1", "12:00", "15:00");

});

});

});
