import { BaseEntity, Column, Entity, getConnectionManager, PrimaryGeneratedColumn } from "typeorm";
import { Request, Response } from 'express';


const ex = require('express');

const application = ex();
const cors = require('cors');

application.use(ex.json());

application.use(cors());

application.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

@Entity('stations')
class Station extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('varchar', { length: 200})
    address: string;
    
    @Column('boolean')
    status: boolean;
    
}

const connection = getConnectionManager().create ({
    host: 'localhost',
    username: 'alex',
    password: '1234',
    database: 'newradalarm',
    synchronize: true,
    type: 'mysql',
    entities: [Station]
});

connection.connect().catch(err => console.error(err)); 
 


application.get('/stations', (req: Request, res: Response) => {
        Station.find().then(stations => {
            res.send(stations);
        }).catch(err => console.error(err));
    });

application.get('/stations/:id', (req: Request, res: Response) => {
    Station.findOne(req.params.id).then(station => {
        if (station !== null)
           res.send(station);
        else
           res.sendStatus(404);
    }).catch(err => console.error(err));
  });
    
application.post('/stations', (req: Request, res: Response) => {
    const station: Station = Station.merge(new Station(), req.body);
    station.save().then(station => {
        res.send(station);
    }).catch(err => console.error(err));
});   


application.delete('/stations/:id', (req: Request, res: Response) => { 

    /*connection.query('DELETE FROM station WHERE id = ?',
      [req.params.id], (err, data) => {
        if (err) {
           console.error(err);
        }
        res.sendStatus(200);
   });*/
});


application.put('/stations/:id', (req: Request, res: Response) => { 

    /*connection.query('UPDATE station SET address = ?, status = ? WHERE id = ?',
      [req.body.address, req.body.status, req.params.id], (err, data) => {
        if (err) {
           console.error(err);
        }
        res.sendStatus(200);
    });*/
 });



application.listen(8085, () => console.log("Good Lesson"));