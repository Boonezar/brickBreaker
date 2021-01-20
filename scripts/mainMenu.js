MyGame.screens['main-menu'] = (function(game){
    'use strict';

    function initialize(){
        document.getElementById('new-game-button').addEventListener(
            'click', function() {game.showScreen('game-play'); });
        document.getElementById('high-scores-button').addEventListener(
            'click', function() {game.showScreen('high-scores'); });
        document.getElementById('credits-button').addEventListener(
            'click', function() {game.showScreen('credits'); });
    }

    function run(){/*empty*/}

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));