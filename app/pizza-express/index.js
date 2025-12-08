import express from 'express';
import cors from "cors";
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';


const app = express();
const PORT = 3000;
const corsOptions = {
origin: ['http://localhost:5173', 'http://example.com', 'http://mydomain.com']
};
app.use(cors(corsOptions));      
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
});

app.use('/pizze', pizzeRouter);
app.use('/narudzbe', narudzbeRouter);

app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});
