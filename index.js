const puppeteer = require("puppeteer");
const fs = require("fs");
const NK = require("nk-vector");
let data_songs = fs.readFileSync('data_songs.json', 'utf8')
data_songs = JSON.parse(data_songs);
let name_songs = []

for(let song in data_songs){
    name_songs.push(data_songs[song]['name_song'])
}

(async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("https://www.nhaccuatui.com/playlist/v-pop-2020-nghe-si-duoc-quan-tam-nhat-va.wX5re6ThzKZ0.html");

        const songs = await page.evaluate(() => {
            let items = document.querySelectorAll(".button_new_window");
            let links = [];
            items.forEach(item => {
                let data_title = item.getAttribute("title")
                data_title = data_title.replace('ở cửa sổ mới', '').replace('Nghe bài hát ', '').split(' - ')
                links.push({
                    title: data_title[0],
                    author: data_title[1],
                    url: item.getAttribute("href")
                });
            });
            return links;
        });
        for (let song in songs) {
            if(name_songs.indexOf(songs[song].title.toString().trim()) == -1){
                await page.goto(songs[song].url);
                let lyric = await page.evaluate(() => {
                    let lyric = document
                        .getElementsByClassName("pd_lyric trans")[0]
                        .innerHTML.replace(/\<br\>/g, "");
                    if (lyric.indexOf('- Hiện chưa có lời bài hát nào cho') != -1) {
                        lyric = ''
                    }
                    return lyric;
                });
                if(lyric.length > 1){
                    lyric = lyric.toString().trim()
                    lyric = lyric.split('\n')
                    let new_lyrics = ''
                    for (let sentence in lyric) {
                        let check_lang = NK.English_or_Vietnamese(lyric[sentence])
                        let processed = ""
                        if (check_lang == "English") {
                            processed = NK.clear_sentence_en(check_lang["fix_text"].trim())
                            if (processed.length > 0 && processed != 'đk' && processed.indexOf('- Hiện chưa có lời bài hát nào cho') == -1) {
                                new_lyrics += processed + '\n'
                            }
                        } else {
                            processed = NK.clear_sentence_VN(check_lang["your_text"].trim())
                            if (processed.length > 0 && processed != 'đk' && processed.indexOf('hiện bài hát') == -1 && processed.indexOf('verse') == -1) {
                                new_lyrics += processed + '\n'
                            }
                        }
                    }
                    if(new_lyrics.length > 0){
                        lyric = new_lyrics.trim()
                    }
                }
                data_songs[1042+parseInt(song)] = {
                    "name_song": songs[song].title.toString().trim(),
                    "play": songs[song].url,
                    "author": songs[song].author.toString().trim(),
                    "lyrics": lyric.toString().trim(),
                    "type": "nhạc trẻ"
                }
            }
        }
        await browser.close();
        if (Object.keys(data_songs).length > 0) {
            let json = JSON.stringify(data_songs);
            fs.writeFile('data_songs(2).json', json, 'utf8', function (err) {
                if (err) {
                    console.log(err)
                    throw err;
                } else {
                    console.log('Saved data songs!');
                }
            });
        }
})();