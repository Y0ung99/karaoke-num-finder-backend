import * as searchRepository from '../data/search.js'

export async function search(req, res) {
    const {text, company, option, page} = req.body;
    const keyword = encodeURI(text);

    if (company === 'kumyoung') {
        if (option === 'singer') {
            const url = searchRepository.kyGetURLs_Singer(page, keyword);
            const pageDatas = await searchRepository.kyGetHTML_Singer(url);
            pageDatas ? res.status(200).json(pageDatas) : res.sendStatus(404);
        } else if (option === 'title') {
            const url = searchRepository.kyGetURLs_Title(page, keyword);
            const pageDatas = await searchRepository.kyGetHTML_Title(url);
            pageDatas ? res.status(200).json(pageDatas) : res.sendStatus(404);
        }
    } else if (company === 'taejin') {
        const category = option === 'title' ? 1 : 2;
        const url = searchRepository.tjGetURLs(page, keyword, category);
        const pageDatas = await searchRepository.tjGetHTML(url);
        pageDatas ? res.status(200).json(pageDatas) : res.sendStatus(404);
    }
}

export async function getMaxPage(req, res) {
    const {text, company, option} = req.body;
    const keyword = encodeURI(text);
    let pageNum;

    if (company === 'kumyoung') {
        if (option === 'singer') pageNum = await searchRepository.kyGetPage_Singer(keyword);
        else if (option === 'title') pageNum = await searchRepository.kyGetPage_Title(keyword);
        
    } else if (company === 'taejin') {
        const category = option === 'title' ? 1 : 2;
        pageNum = await searchRepository.tjGetPage(keyword, category);
    }

    pageNum ? res.status(200).json({pageNum}) : res.sendStatus(404);
}