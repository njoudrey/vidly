const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [{id: 1, name: "horror"},
{id: 2, name: "comedy"},
{id: 3, name: "thriller"},
{id: 4, name: "action"}
];

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	}

});

const genreModel = mongoose.model('Genre', genreSchema);


async function getAllDocs(){
	const genres = await genreModel.find();
	return genres;
}

router.get('/', (req, res) => {
	res.send(getAllDocs());
});

function validate(genre) {
	const schema = {
		name: Joi.string().min(3).max(10).required()
	};
	
	return Joi.validate(genre, schema);
}

async function saveDoc(param){
 const genreDoc = new genreModel({
		name: param.name
	});
	const result = await genreDoc.save();
	return result;
}

router.get('/:id', (req,res) => {
	const found = genres.find(c => c.id === parseInt(req.params.id));
	if(!found) {
		res.status(404).send('The genre with the given id could not be found');
		return;
	}
	res.send(found);
});

router.post('/', (req, res) => {
	const {error} = validate(req.body);
	if(error) return res.status(400).send(error.error.details[0].message);
	const result = saveDoc(req.body);
	res.send(result);
});

router.put('/:id', (req,res) => {
	const found = genres.find(c => c.id === parseInt(req.params.id));
	if(!found) {
		res.status(404).send('The genre with the given id could not be found');
		return;
	}
	const {error} = validate(req.body);
	if(error) return res.status(400).send(error.error.details[0].message);

	found.name = req.body.name;
	res.send(found);
});

router.delete('/:id', (req, res) => {
	const found = genres.find( c => c.id === parseInt(req.params.id));
	if(!found){
		res.status(404).send('The genre with the given id could not be found');
	}
	const index = genres.indexOf(found);
	genres.splice(index, 1);
	res.send(found);
});

module.exports = router;