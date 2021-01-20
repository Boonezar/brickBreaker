MyGame.screens['high-scores'] = (function(game){
    'use strict';

    function initialize(){
        MyGame.persistence.report('high-scores-list');
        document.getElementById('back-button1').addEventListener(
            'click', function() {game.showScreen('main-menu'); });
    }

    function run(){/*empty*/}

    return{
        initialize : initialize,
        run : run
    };
}(MyGame.game));