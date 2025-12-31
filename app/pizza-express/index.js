import express from 'express';
import cors from "cors";
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';
import { connectToDatabase } from './dbConnection.js';
import { FindCursor } from 'mongodb';

const app = express();
const PORT = 3000;
const corsOptions = {
origin: ['http://localhost:5173', 'http://example.com', 'http://mydomain.com']
};

let db = await connectToDatabase();

// let users_collection = db.collection('users');
// let allUsers = await users_collection.find().toArray();
// console.log(allUsers instanceof FindCursor);

app.use(cors(corsOptions));      
app.use(express.json());

app.get('/users', async (req, res) => {
    let users_collection = db.collection('users');
    let allUsers = await users_collection.find().toArray();
    res.status(200).json(allUsers);
});

app.get('/pizzedb', async (req, res) => {
    try{
        let pizze_collection = db.collection('pizza_db')
        let allPizze = await pizze_collection.find().toArray();
        res.status(200).json(allPizze); 
    }catch(error){
        res.status(500).json({ message: 'Greška prilikom dohvaćanja pizza iz baze podataka.', error: error.message });
    }
});

app.get('/pizzedb/:naziv', async (req, res) => {
    const naziv = req.params.naziv; 
    let pizze_collection = db.collection('pizza_db'); 
    let pizza = await pizze_collection.findOne( { naziv: naziv } );
    res.status(200).json(pizza);
});

app.get('/narudzbe/:id', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let id_param = req.params.id;
    let narudzba = await narudzbe_collection.findOne({ _id: new ObjectId(id_param) }); 
    
    if (!narudzba) {
        return res.status(404).json({ error: 'Narudžba nije pronađena' });
    }
    res.status(200).json(narudzba);
});

app.patch('/pizze/:naziv', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv_param = req.params.naziv;
    let novaCijena = req.body.cijena;

    try {
        let result = await pizze_collection.updateOne({ naziv: naziv_param }, { $set: {
        cijena: novaCijena } });
        if(result.modifiedCount === 0){
            return res.status(404).json({ error: 'Pizza nije pronadena'})
        }
        res.status(200).json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
        }
});
    
app.post('/pizzedb', async (req, res) => {

    const { naziv, cijene } = req.body;
    if (!naziv || !cijene) {
        return res.status(400).json({ message: 'Nedostaju podaci o pizzi.' });
    }  

    try {   
        let pizze_collection = db.collection('pizza_db'); 
        const result = await pizze_collection.insertOne({ naziv, cijene }); 

        res.status(201).json({ message: 'Pizza je uspješno dodana u bazu podataka.', pizzaId: result.insertedId });
    }catch(error){
        res.status(500).json({ message: "Greska prilikom unosa podataka, podatak s istim nazivom postoji", error: error.message})
    }
});

app.post('/narudba', async (req, res) => {

    const requiredFields = ['kupac', 'adresa', 'broj_telefona', 'narucene_pizze'];
    const allowedSizes = ['mala', 'srednja', 'jumbo'];

    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                message: `Nedostaje polje: ${field}`
            });
        }
    }

    if (!Array.isArray(req.body.narucene_pizze) || req.body.narucene_pizze.length === 0) {
        return res.status(400).json({
            message: 'narucene_pizze mora biti polje s barem jednom stavkom'
        });
    }

    const pizze_collection = db.collection('pizza_db');

    for (const stavka of req.body.narucene_pizze) {

        const { naziv, kolicina, velicina } = stavka;

        if (!naziv || !kolicina || !velicina) {
            return res.status(400).json({
                message: 'Svaka stavka mora imati naziv, kolicinu i velicinu'
            });
        }

        if (!Number.isInteger(kolicina) || kolicina <= 0) {
            return res.status(400).json({
                message: 'Kolicina mora biti cijeli broj veći od 0'
            });
        }

        if (!allowedSizes.includes(velicina)) {
            return res.status(400).json({
                message: `Neispravna veličina: ${velicina}`
            });
        }

        const pizza = await pizze_collection.findOne({ naziv });

        if (!pizza) {
            return res.status(400).json({
                message: `Pizza '${naziv}' ne postoji`
            });
        }

    }

    try {
        const narudba_collection = db.collection('narudba_db');

        const result = await narudba_collection.insertOne(req.body);

        res.status(201).json({
            message: 'Narudžba je uspješno dodana',
            narudbaId: result.insertedId
        });

    } catch (error) {
        res.status(500).json({
            message: 'Greška pri dodavanju narudžbe',
            error: error.message
        });
    }
});


app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
});

app.delete('/pizzedb/:naziv', async (req,res) => {
    let pizze_collection = db.collection('pizza_db');
    let naziv = req.params.naziv;

    try{
        let result = await pizze_collection.deleteOne({ naziv: naziv });
        res.status(200).json({ deletedCount: result.deletedCount})
    }catch(error){
        console.log(error.errorResponse)
        res.status(400).json({ error: error.errorResponse});
    }
});



app.use('/pizze', pizzeRouter);
app.use('/narudzbe', narudzbeRouter);

app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});
