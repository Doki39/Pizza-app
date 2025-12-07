import express from 'express';
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
});
app.listen(PORT, () => {
    console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
});



app.use('/pizze', pizzeRouter);
app.use('/narudzbe', narudzbeRouter); 