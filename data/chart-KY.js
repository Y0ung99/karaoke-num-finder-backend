import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';
import * as cheerio from 'cheerio';
import axios from 'axios';

export const KYPopular = sequelize.define('kypopular', {
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

export const KYNew = sequelize.define('kynew', {
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
}, {timestamps: false});

const KUMYOUNG_BASE = 'https://kygabang.com/chart/';
const KUMYOUNG_BASE_NEW = 'http://dncenter.ikaraoke.kr/songroom/sh_list.asp?S=S&PTYPE=M';

export async function popularFromDB(country) {
    const fetched = KYPopular.findAll({where: {country}});
    return fetched;
}

export async function newFromDB() {
    const fetched = KYNew.findAll({where: {}});
    return fetched;
}

export async function kyRefreshPopularDB() {
    KYPopular.destroy({
        where: {},
        truncate: true,
    });

    const popularList = await Promise.all([kyPopular('kpop'), kyPopular('jpop'), kyPopular('pop')]);

    popularList.map(songs => {
        songs.map(song => {
            KYPopular.create(song).then(data => data.dataValues.id);
        });
    });

    return popularList ? true : false;
}

export async function kyRefreshNewDB() {
    KYNew.destroy({
        where: {},
        truncate: true,
    });

    const newList = await kyNewsong();

    newList.map(song => {
        KYNew.create(song).then(data => data.dataValues.id);
    });

    return newList ? true : false;
}

export async function kyPopular(country) {
    const countryName = country;
    country = kySelectCountry(country);
    let songs = [];
    for (let page = 1; page <= 5; page++) {
        let url = `${KUMYOUNG_BASE}${country}.php?page=${page}`;
        const song = await kyGetPopular(url);
        songs.push(...song);
    }
    songs.shift();
    songs = songs.map(song => {
        song.country = countryName;
        return song;
    })
    return songs;
}

export async function kyNewsong() {
    const songs = await kyGetNew(KUMYOUNG_BASE_NEW);
    return songs;
}

async function kyGetPopular(url) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        $(`#container > div > div.list_wrap > div > table > tbody > tr`)
        .each((i, el) => {
            const num = $(el).find('.ch_daily_03').text();
            const title = $(el).find('.ch_daily_04 > .opbt').text();
            const singer = $(el).find('.ch_daily_05').text();
            objects.push({num, title, singer});
        });
        return objects;
    })
    .catch(console.error);
}

async function kyGetNew(url) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        $('#content > div.tblNew > table > tbody > tr')
        .each((i, el) => {
            const num = $(el).find('td.songNumber').text();
            const title = $(el).find('td.subject').attr('title');
            const singer = $(el).find('td.artist').text().trim();
            objects.push({num, title, singer});
        });
        return objects;
    })
    .catch(console.error);
}

function kySelectCountry(country) {
    let ctry;
    if (country === 'kpop') {
        ctry = 'new_daily';
    } else if (country === 'jpop') {
        ctry = 'new_jpop';
    } else if (country === 'pop') {
        ctry = 'new_pop';
    }
    return ctry;
}