const fs = require("fs");
let data = fs.readFileSync('data_uncertain.json', 'utf8')
data = JSON.parse(data);
data = data['lyrics']
check = []
result_train = 'text,intent,tag\n'
result_test = 'text,intent,tag\n'
for(let type in data){
    if(check.indexOf(data[type]) == -1){
        words = data[type].split(' ')
        line = ''
        for(let word in words){
            if(word == 0){
                line += 'B-inform#lyrics '
            }else{
                line += 'I-inform#lyrics '
            }
        }
        line = line.trim()
        if(type % 2 != 0){        
            result_train += data[type]+',inform,'+line+'\n'
        }else{
            result_test += data[type]+',inform,'+line+'\n'
        }
        check.push(data[type])
    }
}
if(result_train.length > 0){
    fs.writeFile('train_lyrics.csv', result_train, 'utf8', function (err) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log('Saved data!');
        }
    });
    fs.writeFile('test_lyrics.csv', result_test, 'utf8', function (err) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log('Saved data!');
        }
    });
}