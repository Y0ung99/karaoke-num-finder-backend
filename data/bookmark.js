let bookmarks = [
    {   
        id: 1,
        username: 'Dongyoung',
        bookmark: [],
    },
    {
        id: 2,
        username: 'DDDDD',
        bookmark: [],
    }
]
export async function fetchSong(id) {
    const index = bookmarks.findIndex(user => user.id === id);
    return [...bookmarks[index].bookmark];
}

export async function addSong(data, id) {
    const {num, title, singer} = data;
    const info = {num, title, singer};
    const index = bookmarks.findIndex(user => user.id === id);
    const isExist = bookmarks[index].bookmark.findIndex(user => user.num === info.num);
    if (isExist != -1) return;
    bookmarks[index].bookmark.push(info);
    console.log(bookmarks[index].bookmark);
    return bookmarks[index].bookmark;
}

export async function deleteSong(data, id) {
    const {num} = data;
    const index = bookmarks.findIndex(user => user.id === id);
    const newbookmark = [...bookmarks[index].bookmark.filter(song => song.num !== num)];
    bookmarks[index].bookmark = newbookmark;
    return bookmarks[index].bookmark;
}