MyGame.screens['credits'] = (function(game){
    'use strict';

    function initialize(){
        document.getElementById('back-button2').addEventListener(
            'click', function() {game.showScreen('main-menu'); });
    }

    function run(){/*empty*/}

    return {
        initialize : initialize,
        run : run
    }
}(MyGame.game));