import 'express-async-errors';
import * as authRepository from '../data/auth.js';
import * as bookmarkRepository from '../data/bookmark.js'
import { config } from '../config.js';

export async function fetchSong(req, res) {
    const user = await authRepository.findById(req.userId);
    if(!user) return res.status(404).json({message: 'User Not found'});
    const response = await bookmarkRepository.fetchSong(req.userId);
    response ?
    res.status(200).json(response):
    res.status(404).json('Not found');
}

export async function addSong(req, res) {
    const request = req.body;
    const user = await authRepository.findById(req.userId);
    if(!user) return res.status(404).json({message: 'User Not found'});
    const response = await bookmarkRepository.addSong(request, req.userId);
    response ? res.status(201).json({response}) : res.status(400).json({message: '이미 있는 곡입니다!'});
}

export async function deleteSong(req, res) {
    const request = req.body;
    const user = await authRepository.findById(req.userId);
    if(!user) return res.status(404).json({message: 'User Not found'});
    const response = await bookmarkRepository.deleteSong(request, req.userId);
    res.status(204).json({response});
}