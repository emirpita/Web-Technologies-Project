const Sequelize = require("sequelize");
const sequelize = new Sequelize("DBWT19","root","root",{host:"127.0.0.1",dialect:"mysql",logging:false,port:3308});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//Import modela
db.Osoblje = sequelize.import(__dirname+'/modeli/osoblje.js');
db.Rezervacija = sequelize.import(__dirname+'/modeli/rezervacija.js');
db.Termin = sequelize.import(__dirname+'/modeli/termin.js');
db.Sala = sequelize.import(__dirname+'/modeli/sala.js');

//Relacije
db.Osoblje.hasMany(db.Rezervacija,{foreignKey: 'osoba'});
db.Termin.hasOne(db.Rezervacija, {foreignKey: {name: 'termin', type: Sequelize.INTEGER, unique: 'compositeIndex'}});
db.Sala.hasMany(db.Rezervacija,{foreignKey: 'sala'});
db.Osoblje.hasOne(db.Sala, {foreignKey: 'zaduzenaOsoba'});

db.Rezervacija.belongsTo(db.Osoblje, {foreignKey : 'osoba'});
db.Rezervacija.belongsTo(db.Termin, {foreignKey:{ name:'termin', type: Sequelize.INTEGER , unique: 'compositeIndex'}});
db.Rezervacija.belongsTo(db.Sala, {foreignKey: 'sala'});
db.Sala.belongsTo(db.Osoblje, {foreignKey: 'zaduzenaOsoba' });

module.exports=db;