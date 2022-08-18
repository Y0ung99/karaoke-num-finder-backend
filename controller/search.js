import * as searchRepository from '../data/search.js'

export async function search(req, res) {
    const {text, company, option} = req.body;
    console.log(text, company, option);

    if (option === 'title') {
        const result = await searchRepository.searchTitle(text, company);
        console.log(result);
        result ? res.status(200).json(result) : res.sendStatus(404);
        return;
    }
    else if (option === 'singer') {
        const result = searchRepository.searchSinger(text, company);
        result ? res.status(200).json(result) : res.sendStatus(404);
        return;
    }
    
}
