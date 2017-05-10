const express = require('express');
const port = process.env.PORT || 5000;
const app = express();

app.use(express.static('public'));

app.get('/api/imagesearch/:search', (request, response) =>{    
    var search = request.params.search,
        offset = request.query.offset;
    //set default offset value if none passed
    offset = +offset || 10;

    //execute api call using a promise and fetch and then show results once they are returned
    

    response.end('Executing image search: ' + search + ' using page offset of ' + offset );
});

app.get('/api/latest/imagesearch/', (request, response) =>{
    response.end('Getting latest image searches!');
});

app.listen(port, ()=>{
    console.log('Running server on port: ' + port);
});

