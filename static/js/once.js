//initialise canvas variables
var canvas_main;
var canvas_main_cxt;

//load images
var imagedir = 'static/img/';
var allimages = ['player.png','enemy1.png'];
//preload all images
var tempimg;
for(i in allimages){
    tempimg = new Image();
    tempimg.src = imagedir + allimages[i];
    allimages[i] = tempimg;
}


var player;
var enemies = [];

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//general object for a character
function character(mysprite, xsprite, ysprite, widthactor, heightactor, posx, posy){
    this.sprite = mysprite;
    this.spritex = xsprite;
    this.spritey = ysprite;
    this.actorwidth = widthactor;
    this.actorheight = heightactor;
    this.xpos = posx;
    this.ypos = posy;
    //for the player
    this.active = 0;
    //for enemies
    this.range = 0;
    this.direction = 0;
    this.startpos = 0;
    this.moveby = 1;

    this.runActions = function(){
        if(this.active){
            if(this.ypos > 0){
                this.ypos -= 1;
            }
        }
        lenny.general.drawCanvas(this,canvas_main_cxt);
    };
    //move character left or right
    this.move = function(){
        if(this.direction){
            if(this.xpos > (this.startpos - (this.range / 2)))
                this.xpos -= this.moveby;
            else
                this.direction = 0;
        }
        else {
            if(this.xpos < (this.startpos + (this.range / 2)))
                this.xpos += this.moveby;
            else
                this.direction = 1;
        }
    };
    this.launch = function(){
        this.active = 1;
    };
    //check to see if this enemy has hit the player
    this.checkCollision = function(theplayer){
        var topleftx = this.xpos;
        var toplefty = this.ypos;
        var toprightx = this.xpos + this.actorwidth;
        var toprighty = this.ypos;
        var botleftx = this.xpos;
        var botlefty = this.ypos + this.actorheight;
        var botrightx = this.xpos + this.actorwidth;
        var botrighty = this.ypos + this.actorwidth;

        if(toplefty >= theplayer.ypos && toplefty <= (theplayer.ypos + theplayer.actorheight) || botlefty >= theplayer.ypos && botlefty <= (theplayer.ypos + theplayer.actorwidth)){
            if(topleftx >= theplayer.xpos && topleftx <= (theplayer.xpos + theplayer.actorwidth) || botrightx + this.actorwidth >= theplayer.xpos && toprightx <= (theplayer.xpos + theplayer.actorwidth)){
                return(1);
            }
        }
        return(0);
    };
}


(function( window, undefined ) {
var lenny = {
    general: {
        //set up function, starts it off
        initialise: function(){
            console.log('init');
            canvas_main = document.getElementById('canvas_main');
            canvas_main_cxt = lenny.general.initCanvas(canvas_main,canvas_main_cxt);
            
            lenny.people.setupPlayer();
            lenny.people.setupEnemies();

            lenny.game.gameLoop();
        },
        //initialise the canvas and return the canvas context
        initCanvas: function(canvas, cxt){
            if(canvas.getContext){
                cxt = canvas.getContext('2d');
            }
            else {
                $('#' + canvas).html("Your browser does not support canvas. Sorry.");
            }
            return cxt;
        },
        //draw some object on the canvas
        drawCanvas: function(object, cxt){
            cxt.drawImage(object.sprite, object.spritex, object.spritey, object.actorwidth, object.actorheight, object.xpos, object.ypos, object.actorwidth, object.actorheight);
        },
        //completely clear the canvas
        clearCanvas: function(canvas, cxt){
            cxt.clearRect(0, 0, canvas.width, canvas.height);//clear the canvas
            var w = canvas.width;
            canvas.width = 1;
            canvas.width = w;
        }
    },
    people: {
        setupPlayer: function(){
            var playerimage = allimages[0];
            var playerimagex = 0;
            var playerimagey = 0;
            var playerwidth = 20;
            var playerheight = 20;
            var playerx = (canvas_main.width / 2) - (playerwidth / 2);
            var playery = canvas_main.height - playerheight;

            player = new character(playerimage, playerimagex, playerimagey, playerwidth, playerheight, playerx, playery);
        },
        setupEnemies: function(){
            var enemyimage = allimages[1];
            var enemyimagex = 0;
            var enemyimagey = 0;
            var enemywidth = 20;
            var enemyheight = 20;
            var enemyx = 0;
            var enemyy = 0;

            var enemycount = 100;
            var enemytmp;

            for(i = 0; i < enemycount; i++){
                enemyx = getRandomArbitrary(0,canvas_main.width); //randomly position x
                enemyy = getRandomArbitrary(20,canvas_main.height - 100); //randomly position y, but not right at the bottom or top
                enemytmp = new character(enemyimage, enemyimagex, enemyimagey, enemywidth, enemyheight, enemyx, enemyy);
                enemytmp.range = getRandomArbitrary(50,250);
                enemytmp.direction = getRandomArbitrary(0,1);
                enemytmp.startpos = enemyx;
                enemytmp.moveby = Math.random(); //getRandomArbitrary(1,2);
                enemies.push(enemytmp);
            }
        }
    },
    game: {
        gameLoop: function(){
            //put code in here that needs to run for the game to work
            lenny.general.clearCanvas(canvas_main,canvas_main_cxt);
            player.runActions();
            for(i = 0; i < enemies.length; i++){
                enemies[i].runActions();
                enemies[i].move();
                if(enemies[i].checkCollision(player)){
                    enemies.splice(i, 1);
                    console.log('hit');
                }
            }
            setTimeout(lenny.game.gameLoop,10);
        }
    }
};
window.lenny = lenny;
})(window);

//do stuff
window.onload = function(){
    lenny.general.initialise();
    
    $('#canvas_main').mousemove(function(e){
        if(!player.active){
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            player.xpos = parseInt(relX);
        }
    });
    
    $('#canvas_main').on('click',function(e){
        player.launch();
    });

};