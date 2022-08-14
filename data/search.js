import * as cheerio from 'cheerio';
import axios from 'axios';
import iconv from 'iconv-lite';
import { response } from 'express';


const KUMYOUNG_BASE = 'https://kysing.kr/search';
const TAEJIN_BASE = 'https://www.tjmedia.com/tjsong/song_search_list.asp';

export async function searchTitle(text, company) {
    let url;
    let page = 1;
    let keyword = encodeURI(text);
    if (company === 'kumyoung') {
        url = `${KUMYOUNG_BASE}?category=2&keyword=${keyword}&s_page=${page}`;
        console.log(url);
        const songs = await kyGetHTML(url);
        return songs;
    } else if (company === 'taejin') {
        url = `${TAEJIN_BASE}?strType=1&natType=&strText=${keyword}&strCond=0&searchOrderType=&searchOrderItem=&intPage=${page}`;
    } else return new Error('올바르지 않은 값');
}

export async function searchSinger(text, company) {
    
}

async function kyGetHTML(url) {
    axios({
        url,
        method: 'GET',
    })
    .then(response => {
        const content = response.data;
        const $ = cheerio.load(content);
        const songs = $('#search_chart_frm_2 > div > ul:nth-of-type(n+2)')
        .each((i, el) => {
            const num = $(el).find('li.search_chart_num').text();
            const title = $(el).find('li.search_chart_tit > span.tit').text();
            const singer = $(el).find('li.search_chart_tit > span.mo-art').text();
            console.log(i+1, num, title, singer);
            // 오브젝트형식으로 리턴하기
        });
        console.log(songs);
    })
    .catch(err => {
        console.error(err);
    });
}