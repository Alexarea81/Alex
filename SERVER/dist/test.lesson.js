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
exports.Metric = void 0;
const typeorm_1 = require("typeorm");
const bp = require("body-parser");
const ex = require('express');
const application = ex();
const cors = require('cors');
application.use(ex.json());
application.use(cors());
application.use(bp.json());
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
__decorate([
    (0, typeorm_1.OneToMany)(() => Metric, metric => metric.station, {
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], Station.prototype, "metrics", void 0);
Station = __decorate([
    (0, typeorm_1.Entity)('stations')
], Station);
let Metric = class Metric extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Metric.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('double'),
    __metadata("design:type", Number)
], Metric.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Station, station => station.metrics, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'station_id' }),
    __metadata("design:type", Station)
], Metric.prototype, "station", void 0);
Metric = __decorate([
    (0, typeorm_1.Entity)("metrics")
], Metric);
exports.Metric = Metric;
const connection = (0, typeorm_1.getConnectionManager)().create({
    host: 'localhost',
    username: 'alex',
    password: '1234',
    database: 'newradalarm',
    synchronize: true,
    type: 'mysql',
    entities: [Station, Metric]
});
function validate(req, res, next) {
    const station = req.body;
    if (station.hasOwnProperty('address') && station.hasOwnProperty('status')) {
        next();
    }
    else {
        res.sendStatus(400);
    }
}
connection.connect().catch(err => console.error(err));
application.get('/stations', (req, res) => {
    Station.find().then(stations => {
        res.send(stations);
    }).catch(err => console.error(err));
});
application.get('/stations/:id', (req, res) => {
    Station.findOne(req.params.id).then(station => {
        if (station != null)
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
application.delete('/stations/:id', validate, (req, res) => {
    Station.findOne(req.params.id).then(station => {
        if (station != null)
            return station.remove().then(() => {
                res.sendStatus(204);
            });
        res.sendStatus(404);
    }).catch(err => console.error(err));
});
application.put('/stations/:id', (req, res) => {
    Station.findOne(req.params.id).then(station => {
        if (station != null)
            Station.merge(station, req.body);
        return station.save().then(() => {
            res.send(station);
        });
        res.sendStatus(404);
    }).catch(err => console.error(err));
});
application.post('/stations/:id/metrics', (req, res) => {
    Station.findOne(req.params.id).then(station => {
        if (station != null) {
            const metric = Metric.merge(new Metric(), req.body);
            metric.station = station;
            return metric.save().then(metric => {
                res.send(metric);
            });
        }
        else
            res.sendStatus(404);
    }).catch(err => console.error(err));
});
application.listen(8085, () => console.log("Good Lesson"));
