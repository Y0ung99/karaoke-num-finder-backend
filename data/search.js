import * as cheerio from 'cheerio';
import axios from 'axios';

const KUMYOUNG_BASE = 'https://kysing.kr/search/';
const TAEJIN_BASE = 'https://www.tjmedia.com/tjsong/song_search_list.asp';

export async function search(text, company, option, page = 1) {
    let url;
    let category;
    let keyword = encodeURI(text);
    
    if (company === 'kumyoung') {
        category = option === 'title' ? 2 : 7; 
        url = `${KUMYOUNG_BASE}?category=${category}&keyword=${keyword}&s_page=${page}`;
        console.log(url);
        const songs = await kyGetHTML(url, category);
        return songs;
    } else if (company === 'taejin') {
        category = option === 'title' ? 1 : 2; 
        url = `${TAEJIN_BASE}?strType=${category}&natType=&strText=${keyword}&strCond=0&searchOrderType=&searchOrderItem=&intPage=${page}`;
        console.log(url);
        const songs = await tjGetHTML(url);
        return songs;
    } else return new Error('올바르지 않은 값');
}

async function kyGetHTML(url, category) {
    return axios({
        url,
        method: 'GET',
    })
    .then(response => {
        let objects = [];
        const content = response.data;
        const $ = cheerio.load(content);
        const songs = $(`#search_chart_frm_${category} > div > ul:nth-of-type(n+2)`)
        .each((i, el) => {
            const num = $(el).find('li.search_chart_num').text();
            const title = $(el).find('li.search_chart_tit > .tit:nth-child(1)').text();
            const singer = $(el).find('li.search_chart_tit > .tit:nth-child(2)').text();
            objects.push({num, title, singer});
        });
        console.log(objects);
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