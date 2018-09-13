const signale = require('signale');
const jsonfile = require('jsonfile');

const IntentClassifier = require('molir/molir');
const yargs = require('yargs')
    .usage("$0 --i=intents.json --s=0.75 --txt='Whats todays news?'")
    .option('score', {
        alias: 's',
        default: 0.75,
        describe: 'Minimum confidence score',
        type: 'number'
    })
    .option('intents', {
        alias: 'i',
        demandOption: true,
        default: 'intents.json',
        describe: 'Intents JSON file',
        type: 'string'
    })
    .option('txt', {
        alias: 't',
        demandOption: true,
        default: 'Whats todays news?',
        describe: 'Text to classify',
        type: 'string'
    })
    .help('h')
    .alias('h', 'help');

if (yargs.argv.h) {
    yargs.showHelp();
}

let [intentsFile, minScore, txt] = [yargs.argv.intents, yargs.argv.score, yargs.argv.txt];

signale.await(`Opening intents file (${intentsFile})`);
jsonfile.readFile(intentsFile)
    .then( (intents) => {
        signale.complete('Intents file opened, building classifier');
        let classifier = new IntentClassifier(intents, minScore);
        return classifier.classify(txt);
    })
    .then( (result) => {
        signale.success('Text classified! Here are the results:');
        console.log(result);
    })
    .catch(error => console.error(error))
