MyGame.persistence = (function(){
    'use strict';
    var highScores = {};
    var previousScores = localStorage.getItem('MyGame.highScores');
    if(previousScores !== null)
        highScores = JSON.parse(previousScores);

    function add(key, value){
        var count = 0;
        while(highScores.hasOwnProperty(key)){
            count += 1;
            key += count.toStrong();
        }
        highScores[key] = value;
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }
    function remove(key){
        delete highScores[key];
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }
    function report(id) {
        var htmlNode = document.getElementById(id);
        var key;
        var scores = [];
        for(key in highScores)
            scores.push(highScores[key]);
        scores.sort(function(a,b){ return b-a});

        htmlNode.innerHTML = '<br>Top 10 High Scores<br><br>';
        for(let i = 0; i < Math.min(scores.length, 10); i++)
            htmlNode.innerHTML += ('' + scores[i] + '<br>');
    }

    return {
        add : add,
        remove : remove,
        report : report
    };
}());

