const express = require('express');

const app = express();
const port = process.env.PORT || 5555;


//TODO:
//    1. Create an index of the data.json file
//    2. Load indexed field in a trie (prefix-tree)
//    3. Use the prefix tree for the auto-complete on the client



app.get('/api/users', (req, res) => {

    const text = req.query.q;
    const requestNumber = req.query.n;

    // Simulate delay for the requests

    // const randomTime = Math.floor(Math.random() * 6000) + 1000;
    // console.log(randomTime);
    // setTimeout(function () {
    //     res.send({ text : text , data : [], num : requestNumber });
    // },randomTime );
    //

    res.send({ text : text , data : [], num : requestNumber});

});

app.listen(port, () => console.log(`Listening on port ${port}`));
