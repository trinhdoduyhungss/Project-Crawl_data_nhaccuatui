const fs = require("fs");
let data = fs.readFileSync('data_uncertain.json', 'utf8')
data = JSON.parse(data);
function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
data = data['type']
check = []
result_train = 'text,intent,tag\n'
result_test = 'text,intent,tag\n'
for (let type in data) {
    if (check.indexOf(data[type]) == -1) {
        words = data[type].split(' ')
        line = ''
        for (let word in words) {
            if (words[word] != 'nhạc') {
                if (word == 1) {
                    line += 'B-inform#type '
                } else {
                    line += 'I-inform#type '
                }
            } else {
                line += 'O '
            }
        }
        line = line.trim()
        result_train += data[type] + ',inform,' + line + '\n'
        result_test += data[type].replace('nhạc', '').trim() + ',inform,' + line.replace('O', '').trim() + '\n'
        result_test += data[type].replace('nhạc', 'thể loại') + ',inform,O ' + line + '\n'
        check.push(data[type])
    }
}
if (result_train.length > 0) {
    fs.writeFile('train_types.csv', result_train, 'utf8', function (err) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log('Saved data!');
        }
    });
    fs.writeFile('test_types.csv', result_test, 'utf8', function (err) {
        if (err) {
            console.log(err)
            throw err;
        } else {
            console.log('Saved data!');
        }
    });
}