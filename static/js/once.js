//initialise canvas variables
var canvas_main;
var canvas_main_cxt;
var game = 0;

//load images
var allimages = ['player.png','enemy1.png','enemy2.png','enemy3.png','explosion.png'];
var objectimages = ['object1.png','object2.png'];

allimages = preloadImages(allimages);
objectimages = preloadImages(objectimages);

var player;
var enemies = [];
var objects = [];

//preload images
function preloadImages(array){
    var imagedir = 'static/img/';
    var tempimg;
    for(i in array){
        tempimg = new Image();
        tempimg.src = imagedir + array[i];
        array[i] = tempimg;
    }
    return(array);
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//general object for main character
function characterobj(mysprite, widthactor, heightactor, posx, posy){
    this.sprite = mysprite;
    this.actorwidth = widthactor;
    this.actorheight = heightactor;
    this.xpos = posx;
    this.ypos = posy;
    this.speed = 1;
    this.points = 0;

    this.active = 0;

    this.runActions = function(){
        if(this.active){
            if(this.ypos > 0){
                this.ypos -= this.speed;
            }
            else {
                lenny.general.endGame();
            }
        }
        lenny.general.drawCanvas(this,canvas_main_cxt);
    };
    this.launch = function(){
        this.active = 1;
    };
}

//general object for enemy
function enemyobj(mysprite, widthactor, heightactor, posx, posy){
    this.sprite = mysprite;
    this.actorwidth = widthactor;
    this.actorheight = heightactor;
    this.xpos = posx;
    this.ypos = posy;

    this.range = 0;
    this.direction = 0;
    this.startpos = 0;
    this.moveby = 0; //speed

    this.runActions = function(){
        lenny.general.drawCanvas(this,canvas_main_cxt);
    };
    //move character left or right
    this.move = function(){
        if(this.moveby){
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
        }
    };
    //check to see if this enemy has hit the player
    this.checkCollision = function(theplayer){
        if(this.moveby){
            var topleftx = this.xpos;
            var toplefty = this.ypos;
            var toprightx = this.xpos + this.actorwidth;
            var toprighty = this.ypos;
            var botleftx = this.xpos;
            var botlefty = this.ypos + this.actorheight;
            var botrightx = this.xpos + this.actorwidth;
            var botrighty = this.ypos + this.actorwidth;

            //collision has occurred
            if(toplefty >= theplayer.ypos && toplefty <= (theplayer.ypos + theplayer.actorheight) || botlefty >= theplayer.ypos && botlefty <= (theplayer.ypos + theplayer.actorwidth)){
                if(topleftx >= theplayer.xpos && topleftx <= (theplayer.xpos + theplayer.actorwidth) || toprightx >= theplayer.xpos && toprightx <= (theplayer.xpos + theplayer.actorwidth)){
                    theplayer.points += 1;
                    this.moveby = 0;
                }
            }
        }
        else {
            this.expire();
        }
        return(0);
    };
    //perform death of this enemy
    this.expire = function(){
        this.sprite = allimages[4];
    }
}

//general object for object
function objectobj(mysprite, widthactor, heightactor, posx, posy){
    this.sprite = mysprite;
    this.actorwidth = widthactor;
    this.actorheight = heightactor;
    this.xpos = posx;
    this.ypos = posy;

    this.active = 1;
    this.actiontype = 0;

    this.runActions = function(){
        lenny.general.drawCanvas(this,canvas_main_cxt);
    };
    //perform the action that happens when the player touches this object
    this.performTrigger = function(theplayer){
        this.active = 0;
        switch(this.actiontype){
            case 0:
                theplayer.ypos += 100;
                theplayer.xpos = getRandomArbitrary(10, canvas_main.width - 10);
                break;
            case 1:
                theplayer.points += 2;
                break;
        }
    }
    //check to see if this object has hit the player
    this.checkCollision = function(theplayer){
        if(this.active){
            var topleftx = this.xpos;
            var toplefty = this.ypos;
            var toprightx = this.xpos + this.actorwidth;
            var toprighty = this.ypos;
            var botleftx = this.xpos;
            var botlefty = this.ypos + this.actorheight;
            var botrightx = this.xpos + this.actorwidth;
            var botrighty = this.ypos + this.actorwidth;
    
            if(toplefty >= theplayer.ypos && toplefty <= (theplayer.ypos + theplayer.actorheight) || botlefty >= theplayer.ypos && botlefty <= (theplayer.ypos + theplayer.actorwidth)){
                if(topleftx >= theplayer.xpos && topleftx <= (theplayer.xpos + theplayer.actorwidth) || toprightx >= theplayer.xpos && toprightx <= (theplayer.xpos + theplayer.actorwidth)){
                    this.performTrigger(theplayer);
                    return(1);
                }
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
            canvas_main = document.getElementById('canvas_main');
            canvas_main_cxt = lenny.general.initCanvas(canvas_main,canvas_main_cxt);
            this.initGame();
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
        initGame: function(){
            game = 1;
            player = 0;
            enemies = [];
            objects = [];

            lenny.people.setupPlayer();
            lenny.people.setupEnemies();
            lenny.people.setupObjects();
        },
        endGame: function(){
            game = 0;
            canvas_main_cxt.font = "30px Arial";
            canvas_main_cxt.fillStyle = "#000000";
            canvas_main_cxt.textAlign = "center";

            /*
            canvas_main_cxt.shadowColor = "#a98c8c";
            canvas_main_cxt.shadowOffsetX = 2;
            canvas_main_cxt.shadowOffsetY = 2;
            canvas_main_cxt.shadowBlur = 0;
            */
        },
        //draw some object on the canvas
        drawCanvas: function(object, cxt){
            //cxt.drawImage(object.sprite, object.spritex, object.spritey, object.actorwidth, object.actorheight, object.xpos, object.ypos, object.actorwidth, object.actorheight);
            cxt.drawImage(object.sprite, object.xpos, object.ypos, object.actorwidth, object.actorheight);
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
            var playerwidth = 30;
            var playerheight = 30;
            var playerx = (canvas_main.width / 2) - (playerwidth / 2);
            var playery = canvas_main.height - playerheight;

            player = new characterobj(playerimage, playerwidth, playerheight, playerx, playery);
        },
        setupEnemies: function(){
            var enemywidth = 30;
            var enemyheight = 30;

            var enemydata = [
                {
                    'type': 'level 1',
                    'img': allimages[1],
                    'speed': 0.5,
                    'vertposmin': 200,
                    'vertposmax': canvas_main.height - 100
                },
                {
                    'type': 'level 2',
                    'img': allimages[2],
                    'speed': 1,
                    'vertposmin': 120,
                    'vertposmax': canvas_main.height - 150
                },
                {
                    'type': 'level 3',
                    'img': allimages[3],
                    'speed': 0.2,
                    'vertposmin': 60,
                    'vertposmax': canvas_main.height - 300
                }
            ];

            var enemycount = 50;
            var enemytmp;

            for(i = 0; i < enemycount; i++){
                thisenemy = Math.floor(getRandomArbitrary(0,enemydata.length));

                enemyx = getRandomArbitrary(0,canvas_main.width); //randomly position x
                //enemyy = getRandomArbitrary(20,canvas_main.height - 100); //randomly position y, based on the limits for this enemy
                enemyy = getRandomArbitrary(enemydata[thisenemy]['vertposmin'],enemydata[thisenemy]['vertposmax']);
                enemyimage = enemydata[thisenemy]['img'];

                enemytmp = new enemyobj(enemyimage, enemywidth, enemyheight, enemyx, enemyy);
                enemytmp.range = getRandomArbitrary(50,canvas_main.width / 4); //distance the enemy will move
                enemytmp.direction = getRandomArbitrary(0,1);
                enemytmp.startpos = enemyx;
                enemytmp.moveby = enemydata[thisenemy]['speed']
                enemies.push(enemytmp);
            }
        },
        setupObjects: function(){
            var objwidth = 30;
            var objheight = 30;

            var objdata = [
                {
                    'type': 'teleport',
                    'img': objectimages[0],
                    'vertposmin': 10,
                    'vertposmax': canvas_main.height - 120,
                    'action':0
                },
                {
                    'type': 'level up',
                    'img': objectimages[1],
                    'vertposmin': 10,
                    'vertposmax': canvas_main.height - 120,
                    'action':1
                }
            ]

            var objcount = 5;
            var objtmp;

            for(i = 0; i < objcount; i++){
                thisobj = Math.floor(getRandomArbitrary(0,objdata.length));

                objx = getRandomArbitrary(0,canvas_main.width); //randomly position x
                objy = getRandomArbitrary(objdata[thisobj]['vertposmin'],objdata[thisobj]['vertposmax']);
                objimage = objdata[thisobj]['img'];

                objtmp = new objectobj(objimage, objwidth, objheight, objx, objy);
                objtmp.actiontype = objdata[thisobj]['action'];
                objects.push(objtmp);
            }
        }
    },
    game: {
        gameLoop: function(){
            //put code in here that needs to run for the game to work
            if(game){
                lenny.general.clearCanvas(canvas_main,canvas_main_cxt);
                player.runActions();
                for(i = 0; i < objects.length; i++){
                    objects[i].runActions();
                    if(objects[i].checkCollision(player)){
                        objects.splice(i, 1);
                    }
                }
                for(i = 0; i < enemies.length; i++){
                    enemies[i].runActions();
                    enemies[i].move();
                    if(enemies[i].checkCollision(player)){
                        enemies.splice(i, 1);
                    }
                }
                setTimeout(lenny.game.gameLoop,10);
            }
            else {
                canvas_main_cxt.fillText("GAME OVER", canvas_main.width / 2, canvas_main.height - 60);
                canvas_main_cxt.fillText("Score: " + player.points, canvas_main.width / 2, canvas_main.height - 30);
                canvas_main_cxt.font = "14px Arial";
                canvas_main_cxt.fillText("Click to play again", canvas_main.width / 2, canvas_main.height - 10);
            }
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
        if(!player.active){
            player.launch();
        }
        else {
            lenny.general.initGame();
            lenny.game.gameLoop();
        }
    });

};