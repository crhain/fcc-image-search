const fetch = require('node-fetch');
const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const PAGE_SIZE = 10; //this is the number of results shown per page
var searchHistory = [];
var apiKey = process.env.SEARCH_API_KEY;

app.use(express.static('public'));

app.get('/api/imagesearch/:search', (request, response) =>{    
    var search = request.params.search,
        offset = request.query.offset,
        searchJSON = {term: search, when: new Date().toISOString()};
    //set default offset value if none passed
    offset = +offset || 0;
    //execute api call using a promise and fetch and then show results once they are returned
    //should return imageURL, pageURL, alt text
    //BING image api:
     //results.totalEstimatedMatches
     //results.value array:
        //contentUrl = imageURL
        //homePageUrl = pageURL
        //name = alt text
    updateSearchHistory(searchJSON);
    makeSearchRequest(search, offset)
        .then( res => res.json())
        .then(json => {            
            response.end(returnFormattedResults(json));
        });    
});

app.get('/api/latest/imagesearch/', (request, response) =>{    
    response.end(JSON.stringify(searchHistory));
});

app.listen(port, ()=>{
    console.log('Running server on port: ' + port);
});

function updateSearchHistory(search, limit = 10){
    if(searchHistory.length >= limit){
        searchHistory = [];
    }
    searchHistory.push(search);
}

function makeSearchRequest(search, offset = 0){
    let url = "https://api.cognitive.microsoft.com/bing/v5.0/images/search";
    let myHeaders = {
        "Ocp-Apim-Subscription-Key": apiKey        
    };
    let myInit = {
        method: 'GET',
        headers: myHeaders
    };

    url += "?q=" + search + "&count=" + PAGE_SIZE + "&offset=" + (offset * PAGE_SIZE);
    console.log(url);

   return fetch(url, myInit);
}

function returnFormattedResults(json){
    //iterate through json.values array and pick out the following:
    //  .name = alttext
    //  .thumbnailUrl = thumbnail
    //  .hostPageDisplayUrl = url
    var results = [];    
    for(let i = 0; i < json.value.length; i++){
        let o = Object.create(null);
        o.text = json.value[i].name;        
        o.url = json.value[i].hostPageDisplayUrl;
        o.thumbnail = json.value[i].hostPageDisplayUrl;                
        results.push(o);        
    }
    return JSON.stringify(results);
}