import * as cheerio from 'cheerio';
import axios from 'axios';
import _ from 'lodash';

const KUMYOUNG_BASE = 'https://kygabang.com/chart/search_list_more.php';
const TAEJIN_BASE = 'https://www.tjmedia.com/tjsong/song_search_list.asp';

export async function kyGetHTML(url) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        $(`#sectionList4 > div > table > tbody > tr`)
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

export async function tjGetHTML(url) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        $('#BoardType1 > table > tbody > tr:nth-of-type(n+2)')
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

export async function kyGetPage(keyword, category) {
    const BASE = 'https://kygabang.com/chart/search_list.php';
    const url = `${BASE}?mode=SongSearch&val=${keyword}`;
    let option = category === 2 ? 0 : 1;

    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        const content = response.data;
        const $ = cheerio.load(content);
        const pages = $('#sectionList4 > h3 > span').text().split(')');
        if (pages.length === 2 && option === 1) {
            option = 0;
        }
        const pageNum = pages[option].replace(/[^0-9]/g, '');
        return Math.ceil(parseInt(pageNum) / 20);
    });
}

export async function tjGetPage(keyword, category) {
    let page = 1;
    const BASE = 'https://www.tjmedia.com/tjsong/song_search_list.asp';
    while(true) {
        let url = `${BASE}?strType=${category}&natType=&strText=${keyword}&strCond=0&searchOrderType=&searchOrderItem=&intPage=${page}`;
        let pageNum;
        page = await axios({
            url,
            method: 'GET',
        })
        .then(response => {
            let content = response.data;
            let $ = cheerio.load(content);
            let pages = $('#page1 > table > tbody > tr > td > a:nth-last-child(1)').text();
            if (!pages) pages = $('#page1 > table > tbody > tr > td > b:nth-last-child(1)').text();
            if (!pages) pages = $('#page1 > table > tbody > tr > td > a:nth-last-child(2)').text();
            pageNum = parseInt(pages.replace(/[^0-9]/g, ''));
            return pageNum;
        });
        if ((pageNum % 10) === 0) {
            page++;
        } else if ((pageNum % 10) !== 0) {
            break;
        }
    }
    return page;
}

export function kyGetURLs(page, keyword, category) {
    const url = `${KUMYOUNG_BASE}?page=${page}&val=${keyword}&mode=SongSearch&gb=${category}`;
    return url;
}

export function tjGetURLs(page, keyword, category) {
    const url = `${TAEJIN_BASE}?strType=${category}&natType=&strText=${keyword}&strCond=0&searchOrderType=&searchOrderItem=&intPage=${page}`;
    return url;
}