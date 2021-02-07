const fs = require("fs");
const NK = require("nk-vector")
let data = fs.readFileSync('data_songs.json', 'utf8')
data = JSON.parse(data);
let results = {
    "name_song": [],
    "type":[],
    "author": [],
    "lyrics": []
}
for (let i in data) {
    if(results["name_song"].indexOf(data[i]["name_song"]) == -1){
        results["name_song"].push(data[i]["name_song"])
    }
    if(results["type"].indexOf(data[i]["type"]) == -1){
        results["type"].push(data[i]["type"])
    }
    if(results["author"].indexOf(data[i]["author"]) == -1){
        results["author"].push(data[i]["author"])
    }
    let lyrics = data[i]["lyrics"]
    if (lyrics.length > 0){
        let check_lang = NK.English_or_Vietnamese(lyrics.replace('\n',' '))
        if(check_lang == "English"){
            processed = NK.clear_sentence_en(check_lang["fix_text"].trim())
            results["lyrics"].push(processed)
        }else{
            processed = NK.clear_sentence_VN(check_lang["your_text"].trim())
            results["lyrics"].push(processed)
        }
        // lyrics = lyrics.split('\n')
        // for (let sentence in lyrics) {
        //     let check_lang = NK.English_or_Vietnamese(lyrics[sentence])
        //     let processed = ""
        //     if(check_lang == "English"){
        //         processed = NK.clear_sentence_en(check_lang["fix_text"].trim())
        //         if (processed.length > 0 && processed != 'đk' && processed.indexOf('- Hiện chưa có lời bài hát nào cho') == -1) {
        //             results["lyrics"].push(processed)
        //         }
        //     }else{
        //         processed = NK.clear_sentence_VN(check_lang["your_text"].trim())
        //         if (processed.length > 0 && processed != 'đk' && processed.indexOf('hiện bài hát') == -1 && processed.indexOf('verse') == -1) {
        //             results["lyrics"].push(processed)
        //         }
        //     }
        // }
    }
}
if (results["name_song"].length > 0) {
    let json = JSON.stringify(results);
    fs.writeFile('data_uncertain.json', json, 'utf8', function (err) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log('Saved data!');
        }
    });
}