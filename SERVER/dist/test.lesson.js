"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const ex = require('express');
const application = ex();
const cors = require('cors');
application.use(ex.json());
application.use(cors());
application.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
let Station = class Station extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Station.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 200 }),
    __metadata("design:type", String)
], Station.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean'),
    __metadata("design:type", Boolean)
], Station.prototype, "status", void 0);
Station = __decorate([
    (0, typeorm_1.Entity)('stations')
], Station);
const connection = (0, typeorm_1.getConnectionManager)().create({
    host: 'localhost',
    username: 'alex',
    password: '1234',
    database: 'newradalarm',
    synchronize: true,
    type: 'mysql',
    entities: [Station]
});
connection.connect().catch(err => console.error(err));
application.get('/stations', (req, res) => {
    Station.find().then(stations => {
        res.send(stations);
    }).catch(err => console.error(err));
});
application.get('/stations/:id', (req, res) => {
    Station.findOne(req.params.id).then(station => {
        if (station !== null)
            res.send(station);
        else
            res.sendStatus(404);
    }).catch(err => console.error(err));
});
application.post('/stations', (req, res) => {
    const station = Station.merge(new Station(), req.body);
    station.save().then(station => {
        res.send(station);
    }).catch(err => console.error(err));
});
application.delete('/stations/:id', (req, res) => {
    /*connection.query('DELETE FROM station WHERE id = ?',
      [req.params.id], (err, data) => {
        if (err) {
           console.error(err);
        }
        res.sendStatus(200);
   });*/
});
application.put('/stations/:id', (req, res) => {
    /*connection.query('UPDATE station SET address = ?, status = ? WHERE id = ?',
      [req.body.address, req.body.status, req.params.id], (err, data) => {
        if (err) {
           console.error(err);
        }
        res.sendStatus(200);
    });*/
});
application.listen(8085, () => console.log("Good Lesson"));
