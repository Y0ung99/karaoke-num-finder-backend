import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
import * as cheerio from 'cheerio';
import axios from 'axios';

export const TJPopular = sequelize.define('tjpopular', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    num: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    singer: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING(45),
        allowNull: false,
    }
}, {timestamps: false});

export const TJNew = sequelize.define('tjnew', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    num: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    singer: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    }
}, {timestamps: false});


const TAEJIN_BASE = 'https://www.tjmedia.com/tjsong/song_monthPopular.asp';
const TAEJIN_BASE_NEW = 'https://www.tjmedia.com/tjsong/song_monthNew.asp';

export async function popularFromDB(country) {
    const fetched = TJPopular.findAll({where: {country}});
    return fetched;
}

export async function newFromDB() {
    const fetched = TJNew.findAll({where: {}});
    return fetched;
}

export async function tjRefreshPopularDB() {
    TJPopular.destroy({
        where: {},
        truncate: true,
    });

    const popularList = await Promise.all([tjPopular('kpop'), tjPopular('jpop'), tjPopular('pop')]);


    popularList.map(songs => {
        songs.map(song => {
            TJPopular.create(song).then(data => data.dataValues.id);
        });
    });

    return popularList ? true : false;
}

export async function tjRefreshNewDB() {
    TJNew.destroy({
        where: {},
        truncate: true,
    });

    const newList = await tjNewsong();

    newList.map(song => {
        TJNew.create(song).then(data => data.dataValues.id);
    });

    return newList ? true : false;
}

export async function tjPopular(country) {
    const countryName = country;
    country = tjSelectCountry(country);
    const today = new Date();
    const aMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
    let url = `${TAEJIN_BASE}?strType=${country}&SYY=${aMonthAgo.getFullYear()}&SMM=${aMonthAgo.getMonth() + 1}&SDD=${aMonthAgo.getDate()}&EYY=${today.getFullYear()}&EMM=${today.getMonth() + 1}&EDD=${today.getDate()}`;
    let songs = await tjGetPopular(url);
    songs.shift();
    songs = songs.map(song => {
        song.country = countryName;
        return song;
    });
    return songs;
}

export async function tjNewsong() {
    const songs = await tjGetNew(TAEJIN_BASE_NEW)
    songs.shift();
    return songs;
}

async function tjGetPopular(url) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        $(`#BoardType1 > table > tbody > tr`)
        .each((i, el) => {
            const num = $(el).find('td:nth-child(2)').text();
            const title = $(el).find('td:nth-child(3)').text();
            const singer = $(el).find('td:nth-child(4)').text();
            objects.push({num, title, singer});
        });
        return objects;
    })
    .catch(console.error);
}

async function tjGetNew(url) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        $('#BoardType1 > table > tbody > tr')
        .each((i, el) => {
            const num = $(el).find('td:nth-child(1)').text();
            const title = $(el).find('td:nth-child(2)').text();
            const singer = $(el).find('td:nth-child(3)').text();
            objects.push({num, title, singer});
        });
        return objects;
    })
    .catch(console.error);
}

function tjSelectCountry(country) {
    let ctry;
    if (country === 'kpop') {
        ctry = 1;
    } else if (country === 'jpop') {
        ctry = 3;
    } else if (country === 'pop') {
        ctry = 2;
    }
    return ctry;
}
