const fs = require("fs");
let data = fs.readFileSync('data_uncertain.json', 'utf8')
data = JSON.parse(data);
data = data['name_song']
check = []
check_frist_word = []
result_train = 'text,intent,tag\n'
result_test = 'text,intent,tag\n'
frist_words = [
    'nghe nhạc',
    'bài hát',
    'bật bài',
    'chơi bài',
    'nghe',
    'chơi',
    'chạy',
    'bật'
]
function no_info(word){
    word = word.split(' ')
    no_if = ''
    for(let i in word){
        no_if += 'O '
    }
    return no_if.trim()

}
function choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}
for(let name_song in data){
    if(check.indexOf(data[name_song]) == -1){
        words = data[name_song].split(' ')
        line = ''
        start_special_space = 0
        end_special_space = 0
        for(let word in words){
            if(word > 0){
                if (words[word].indexOf('(') != -1 || words[word].indexOf(')') != -1 || words[word].indexOf('/') != -1){
                    if(words[word].indexOf(')') != -1 && start_special_space > 0){
                        line += 'O '
                        end_special_space = word
                    }else if(words[word].indexOf('(') != -1 || words[word].indexOf('/') != -1){
                        line += 'O '
                        start_special_space = word
                    }
                }
                else{
                    if(word >= start_special_space && start_special_space > 0){
                        line += 'O '
                    }else{
                        if(word > end_special_space && end_special_space > 0){
                            start_special_space = words.length
                        }
                        line += 'I-inform#name_song '
                    }
                }
            }else{
                line += 'B-inform#name_song '
            }
        }
        line = line.trim()
        frist_word = choose(frist_words)
        if(name_song % 2 != 0){        
            result_train += data[name_song]+',inform,'+line+'\n'
            result_train += data[name_song].toLocaleLowerCase()+',inform,'+line+'\n'
        }else{
            result_test += data[name_song]+',inform,'+line+'\n'
            result_test += data[name_song].toLocaleLowerCase()+',inform,'+line+'\n'
        }
        if(check_frist_word.indexOf(frist_word) == -1){
            result_train += frist_word+' '+data[name_song]+',inform,'+no_info(frist_word)+' '+line+'\n'
            result_test += frist_word+' '+data[name_song]+',inform,'+no_info(frist_word)+' '+line+'\n'
            result_train += frist_word+' '+data[name_song].toLocaleLowerCase()+',inform,'+no_info(frist_word)+' '+line+'\n'
            result_test += frist_word+' '+data[name_song].toLocaleLowerCase()+',inform,'+no_info(frist_word)+' '+line+'\n'
        }
        check.push(data[name_song])
        check_frist_word.push(frist_word)
    }
}
if(result_train.length > 0){
    fs.writeFile('train_name_song.csv', result_train, 'utf8', function (err) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log('Saved data!');
        }
    });
    fs.writeFile('test_name_song.csv', result_test, 'utf8', function (err) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log('Saved data!');
        }
    });
}