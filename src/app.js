const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { off } = require('process');

// Creation de l'application expresse:
const app = express();
const PORT = process.env.PORT || 3000;

// Analyser les requetes JSON avec 'bodyParser'

app.use(bodyParser.json());

// Démarrer le serveur

app.listen(PORT, () => {
    console.log(`Serveur en cours d'écoute sur le port ${PORT}`);
});

// Etablire la connection avec la base mongo 

mongoose.connect('mongodb://0.0.0.0:27017/firstproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    () => {
        console.log("Connection established with Mongo DB");
    }).catch(
        err => {
            console.log("Error connecting to Mongo: ", err);
            process.exit(1);
        }
    );


// Schéma et modèle MongoDB pour les livres

const laptopSchema = new mongoose.Schema({
    laptopName: { type: String, required: true },
    laptopPrice: { type: Number, required: true }
})

// Creation du collection
const Laptoop = mongoose.model('laptops', laptopSchema);

// Routes pour l'API REST : 

//Method GET:

app.get('/laptops', async (requeste, response) => {
    try {
        const mesLaptops = await Laptoop.find().exec()
        response.json(mesLaptops);
    }
    catch (error) {
        response.status(500).json({ message: error.mesage })

    }
});

//Method POST:

app.post('/laptop/add', async(requeste, response) => {
    
    const {laptopName, laptopPrice} = requeste.body;
    
    if(!laptopName || !laptopPrice){
        return response.status(500).json({ message: 'Laptop name et laptop price sont requis'});
    }

    const newLaptop = new Laptoop({laptopName, laptopPrice});
    
    try{
        const savedLaptop = await newLaptop.save();
        response.status(201).json({ message: 'Laptop sauvegardé avec succès', laptop: savedLaptop });
    }catch(error){
        response.status(400).json({ message: error.mesage});

        (err)=>{
            response.status(500).json({ message: err.mesage});
        }

    }
});

//Method GET BY ID:
app.get('/laptop/:id', async (request, response)=>{

    try{
        const myLaptop = await Laptoop.findById(request.params.id);
        response.json(myLaptop)

    }catch(error){
        response.status(500).json({ message: error.mesage});

    }
})

//Method PUT:
app.put('/laptop/update/:id', async(request, response)=>{
    try{
        const updatedLaptop = await Laptoop.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if(!updatedLaptop){
            return response.status(404).json({ message: 'Laptop not founs'});
        }else{
            response.json(updatedLaptop);
        }

    }catch(error){
        response.status(400).json({message: error.message})

    }
})
//Method DELETE:
app.delete('/laptop/delete/:id', async(request, response)=>{
    try{
        const deletedLaptop = await Laptoop.findByIdAndDelete(request.params.id);
        if(!deletedLaptop){
            return response.status(404).json({ message: 'Laptop not found'});
        }else{
            response.status(204).send();
        }

    }
    catch(error){
        response.status(500).json({ message: error.message});
    }
})


