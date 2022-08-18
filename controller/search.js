import * as searchRepository from '../data/search.js'

export async function search(req, res) {
    const {text, company, option} = req.body;
    console.log(text, company, option);
    const result = await searchRepository.search(text, company, option);
    console.log(result);
    result ? res.status(200).json(result) : res.sendStatus(404);
}