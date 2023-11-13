const express = require('express');
const app = express();
const port = 3000;

const perfotmEvenMoreWork = async () => {
    console.log('performing even more work for', global.requestId);
};

const performWork = async () => {
    console.log('performing work for', global.requestId);
    await perfotmEvenMoreWork();
};

let requestId = 0;
app.get('/', async (req, res) => {
    global.requestId = requestId++;
    await performWork();
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
