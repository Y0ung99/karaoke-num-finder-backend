import 'express-async-errors';
import * as KYchartRepository from '../data/chart-KY.js';
import * as TJchartRepository from '../data/chart-TJ.js';

export async function popular(req, res) {
    const company = req.body.company;
    let songs;
    
    if (company == 'kumyoung') {
        songs = await KYchartRepository.popularFromDB(req.params.country);
    } else if (company == 'taejin') {
        songs = await TJchartRepository.popularFromDB(req.params.country);
    }

    songs ? res.status(200).json(songs) : res.sendStatus(404);
}

export async function newsong(req, res) {
    const company = req.body.company;
    let songs;

    if (company == 'kumyoung') {
        songs = await KYchartRepository.newFromDB();
    } else if (company == 'taejin') {
        songs = await TJchartRepository.newFromDB();
    }

    songs ? res.status(200).json(songs) : res.sendStatus(404);
}

export async function RefreshChartDB() {
    await Promise.all([
        TJchartRepository.tjRefreshNewDB(),
        TJchartRepository.tjRefreshPopularDB(), 
        KYchartRepository.kyRefreshNewDB(), 
        KYchartRepository.kyRefreshPopularDB(),
    ]);
    console.log('Popular, New DB Refreshed')
}