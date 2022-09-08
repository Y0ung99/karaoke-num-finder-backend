import 'express-async-errors';
import * as chartRepository from '../data/chart.js';

export async function popular(req, res) {
    const company = req.body.company;
    const songs = await chartRepository.popular(req.params.country, company);
    songs ? res.status(200).json(songs) : res.sendStatus(404);
}

export async function newsong(req, res) {
    const company = req.body.company;
    const songs = await chartRepository.newsong(req.params.country, company);
    songs ? res.status(200).json(songs) : res.sendStatus(404);
}