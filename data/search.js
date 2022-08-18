import * as cheerio from 'cheerio';
import axios from 'axios';
import { response } from 'express';

const KUMYOUNG_BASE = 'https://kygabang.com/chart/search_list_more.php';
const TAEJIN_BASE = 'https://www.tjmedia.com/tjsong/song_search_list.asp';

export async function search(text, company, option, page = 1) {
    let url;
    let category;
    let keyword = encodeURI(text);
    
    if (company === 'kumyoung') {
        category = option === 'title' ? 2 : 7; 
        const maxPage = await kyGetPage(keyword, category);
        url = `${KUMYOUNG_BASE}?page=${page}&val=${keyword}&mode=SongSearch&gb=${category}`
        const songs = await kyGetHTML(url);
        songs.push({page: maxPage});
        return songs;
    } else if (company === 'taejin') {ß
        category = option === 'title' ? 1 : 2; 
        url = `${TAEJIN_BASE}?strType=${category}&natType=&strText=${keyword}&strCond=0&searchOrderType=&searchOrderItem=&intPage=${page}`;
        const songs = await tjGetHTML(url);
        return songs;
    } else return new Error('올바르지 않은 값');
}

async function kyGetHTML(url) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        const songs = $(`#sectionList4 > div > table > tbody > tr`)
        .each((i, el) => {
            const num = $(el).find('.search_col02').text();
            const titleAndSinger = $(el).find('.search_col03').text().split(' / ');
            const title = titleAndSinger[0];
            const singer = titleAndSinger[1];
            objects.push({num, title, singer});
        });
        return objects;
    })
    .catch(err => {
        console.error(err);
    });
}

async function tjGetHTML(url) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        const songs = $('#BoardType1 > table > tbody > tr:nth-of-type(n+2)')
        .each((i, el) => {
            const num = $(el).find('td:nth-child(1)').text();
            const title = $(el).find('td.left').text();
            const singer = $(el).find('td:nth-child(3)').text();
            objects.push({num, title, singer});
        });
        return objects;
    })
    .catch(err => {
        console.error(err);
    });
}

async function kyGetPage(keyword, category) {
    const BASE = 'https://kygabang.com/chart/search_list.php';
    const url = `${BASE}?mode=SongSearch&val=${keyword}`;
    const option = category === 2 ? 0 : 1;
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        const content = response.data;
        const $ = cheerio.load(content);
        const pages = $('#sectionList4 > h3 > span').text().split(')');
        const pageNum = pages[option].replace(/[^0-9]/g, '');
        return Math.ceil(parseInt(pageNum) / 20);
    });
}