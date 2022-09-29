import * as cheerio from 'cheerio';
import axios from 'axios';
import _ from 'lodash';

const KUMYOUNG_BASE = 'https://kygabang.com/chart/search_list_more.php';
const TAEJIN_BASE = 'https://www.tjmedia.com/tjsong/song_search_list.asp';

export async function search(text, company, option) {
    let url;
    let category;
    let urls = [];
    let keyword = encodeURI(text);

    if (company === 'kumyoung') {
        category = option === 'title' ? 2 : 7; 
        const maxPage = await kyGetPage(keyword, category);
        for (let page = 1; page <= maxPage; page++) {
            url = `${KUMYOUNG_BASE}?page=${page}&val=${keyword}&mode=SongSearch&gb=${category}`
            urls.push(new Promise((resolve) => {
                resolve(kyGetHTML(url));
            }));
        }
        return Promise.all(urls)
        .then(result => {
            return _.uniqBy(result.flat(2), 'num');
        });

    } else if (company === 'taejin') {
        category = option === 'title' ? 1 : 2;
        const maxPage = await tjGetPage(keyword, category);
        for (let page = 1; page <= maxPage; page++) {
            url = `${TAEJIN_BASE}?strType=${category}&natType=&strText=${keyword}&strCond=0&searchOrderType=&searchOrderItem=&intPage=${page}`;
            urls.push(new Promise((resolve) => {
                resolve(tjGetHTML(url));
            }));
        }
        return Promise.all(urls)
        .then(result => {
            return _.uniqBy(result.flat(2), 'num');
        });

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

async function tjGetHTML(url) {
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

async function tjGetPage(keyword, category) {
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
            let pages = $('#page1 > table > tbody > tr > td > a:nth-last-child(2)').text();
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