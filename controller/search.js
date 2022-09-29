import * as searchRepository from '../data/search.js'

export async function search(req, res) {
    const {text, company, option, page} = req.body;
    const result = await searchRepository.search(text, company, option);
    result ? res.status(200).json(result) : res.sendStatus(404);
}