import * as cheerio from 'cheerio';
import axios from 'axios';

const KUMYOUNG_BASE = 'https://kygabang.com/chart/';
// new_daily
// new_jpop.php
// new_pop.php
const TAEJIN_BASE = 'https://www.tjmedia.com/tjsong/song_monthPopular.asp'
// ?strType=1
// ?strType=3
// ?strType=2

export async function popular(country, company) {

    if (company === 'kumyoung') {
        country = kySelectCountry(country);
        let songs = [];
        for (let page = 1; page <= 5; page++) {
            let url = `${KUMYOUNG_BASE}${country}.php?page=${page}`;
            const song = await kyGetPopular(url);
            songs.push(...song);
        }
        songs.shift();
        return songs;
    } else if (company === 'taejin') {
        country = tjSelectCountry(country);
        let url = `${TAEJIN_BASE}?strType=${country}`;
        const songs = await tjGetPopular(url);
        songs.shift();
        return songs;
    }

    
}

export async function newsong(country, company) {

    
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