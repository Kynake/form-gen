const fs = require('fs');

if(process.argv.length !== 4) {
    console.log(`Usage: npm start <input.json> <Output Folder>`);
    return;
}

let input = process.argv[2];
let output = process.argv[3];

fs.readFileSync(input, { encoding: 'utf8' })
