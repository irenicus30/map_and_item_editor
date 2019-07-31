// const fileloader = require('./fileloader');
const items = require('./items');

const f = './forgottenserver/items.otb';
// const f = './opentibiasprites/items.otb';
// fileloader.readOtb(f);

const itemDictionary = items.loadFromOtb(f);

// console.log(itemDictionary[681]);
