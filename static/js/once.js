//initialise canvas variables
var canvas_main;
var canvas_main_cxt;
var game = 0;
var gameloop;
var level = 1;

var player;
var enemies = [];
var objects = [];

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//general object for main character
function characterobj(){
    this.sprite;
    this.spritex = 0;
    this.spritey = 0;
    this.spritewidth = 20;
    this.actorwidth;
    this.actorheight;
    this.xpos;
    this.ypos;
    this.speed = 1; //speed the character moves up the screen
    this.points = 0;
    this.level = 1;
    this.xp = 0;
    this.score = 1;
    this.active = 0;
    this.partysize = 1;

    this.runActions = function(){
        if(this.active){
            if(this.ypos > 0){
                this.ypos -= this.speed;
            }
            else { //proceed to next level if one exists
                if(level < levelimages.length){
                    level++;
                    enemies = [];
                    objects = [];
                    lenny.people.setupEnemies();
                    lenny.people.setupObjects();
                    this.ypos = canvas_main.height - this.actorheight;
                }
                else { //or end the game
                    lenny.general.endGame();
                }
            }
        }
        lenny.general.drawOnCanvas(this,canvas_main_cxt);
    };
    this.launch = function(){
        this.active = 1;
    };
    this.levelUp = function(levelup){
        if(this.xp > 2 || levelup){ //if the player has levelled up
            this.level += 1;
            this.xp = 0;
        }
    };
    this.expire = function(){
        //would be nice to change the player image here
        this.sprite = allimages[2];
        return(0);
    };
}

//general object for enemy
function enemyobj(){
    this.sprite;
    this.spritex = 0;
    this.spritey = 0;
    this.spritewidth = 0;
    this.actorwidth;
    this.actorheight;
    this.xpos;
    this.ypos;

    this.range = 0;
    this.direction = 0;
    this.startpos = 0;
    this.moveby = 0; //speed
    this.xp = 1;
    this.level = 1;

    this.runActions = function(){
        lenny.general.drawOnCanvas(this,canvas_main_cxt);
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
            if(checkPlayerCollision(this,theplayer)){
                //if we can kill this monster
                if(theplayer.level >= this.level){
                    console.log("Pre collision - player xp: %d, score: %d, level: %d. Enemy xp: %d, level: %d",theplayer.xp,theplayer.score,theplayer.level,this.xp,this.level);
                    theplayer.xp += this.xp;
                    theplayer.score += this.xp * this.level;
                    theplayer.ypos += 10;
                    this.moveby = 0;
                    theplayer.levelUp(0);
                    console.log("post collision - player xp: %d, score: %d, level: %d.",theplayer.xp,theplayer.score,theplayer.level);
                }
                else {
                    theplayer.score = theplayer.level * theplayer.score;
                    theplayer.expire();
                    lenny.general.endGame();
                }
            }
        }
        else { //perform death of this enemy
            this.spritewidth = 20; //reset this in case the enemy uses a larger sprite than the 'explosion' sprite
            this.sprite = allimages[1];
        }
        return(0);
    };
}

//general object for object
function objectobj(){
    this.sprite;
    this.spritex = 0;
    this.spritey = 0;
    this.spritewidth = 20;
    this.actorwidth;
    this.actorheight;
    this.xpos;
    this.ypos;

    this.active = 1;
    this.actiontype = 0;

    this.runActions = function(){
        lenny.general.drawOnCanvas(this,canvas_main_cxt);
    };
    //perform the action that happens when the player touches this object
    this.performTrigger = function(theplayer){
        this.active = 0;
        theplayer.points += 2;
        switch(this.actiontype){
            case 0: //teleport
                theplayer.ypos = Math.min(theplayer.ypos + canvas_main.height / 10, canvas_main.height - theplayer.actorheight);
                theplayer.xpos = getRandomArbitrary(10, canvas_main.width - 30);
                break;
            case 1: //sword, nothing yet
                break;
            case 2: //increase party size
                //player width is width of canvas / 20, maximum width is 3x, i.e. 3 party companions
                theplayer.partysize += 1;
                theplayer.actorwidth = Math.min(theplayer.actorwidth + (canvas_main.width / 20), (canvas_main.width / 20) * 3);
                theplayer.spritewidth = Math.min(theplayer.spritewidth + 20, 60); //these numbers are hard coded to reflect the actual size of the sprite, i.e. 60x20
                if(theplayer.partysize < 4){
                    theplayer.xpos -= theplayer.actorwidth / 4;
                }
                break;
        }
    }
    //check to see if this object has hit the player
    this.checkCollision = function(theplayer){
        if(this.active){
            if(checkPlayerCollision(this,theplayer)){
                this.performTrigger(theplayer);
                theplayer.levelUp(1);
                return(1);
            }
        }
        return(0);
    };
}

//generic collision checking function between any given object and the player
function checkPlayerCollision(obj,theplayer){
    var topleftx = obj.xpos;
    var toplefty = obj.ypos;
    var toprightx = obj.xpos + obj.actorwidth;
    var toprighty = obj.ypos;
    var botleftx = obj.xpos;
    var botlefty = obj.ypos + obj.actorheight;
    var botrightx = obj.xpos + obj.actorwidth;
    var botrighty = obj.ypos + obj.actorwidth;

    if(toplefty >= theplayer.ypos && toplefty <= (theplayer.ypos + theplayer.actorheight) || botlefty >= theplayer.ypos && botlefty <= (theplayer.ypos + theplayer.actorwidth)){
        if(topleftx >= theplayer.xpos && topleftx <= (theplayer.xpos + theplayer.actorwidth) || toprightx >= theplayer.xpos && toprightx <= (theplayer.xpos + theplayer.actorwidth)){
            return(1);
        }
    }
    return(0);
}


(function( window, undefined ) {
var lenny = {
    general: {
        //set up function, starts it off
        initialise: function(){
            canvas_main = document.getElementById('canvas_main');
            this.initCanvasSize();
            canvas_main_cxt = lenny.general.initCanvas(canvas_main,canvas_main_cxt);
            this.initGame();
            lenny.game.gameLoop();
        },
        initCanvasSize: function(){
            //ideal size for canvas
            var destwidth = 600;
            var destheight = 800;
            var aspect = Math.floor(($(window).height() / destheight) * destwidth);

            var cwidth = Math.min(destwidth, $(window).width());
            var cheight = Math.min(destheight, $(window).height());

            //resize the canvas to maintain aspect ratio depending on screen size
            canvas_main.width = Math.min($(window).width(),aspect);
            canvas_main.height = (canvas_main.width / destwidth) * destheight;
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
            canvas_main_cxt.font = "30px Arial";
            canvas_main_cxt.fillStyle = "#000000";
            canvas_main_cxt.textAlign = "center";
            game = 0;
            /*
            canvas_main_cxt.shadowColor = "#a98c8c";
            canvas_main_cxt.shadowOffsetX = 2;
            canvas_main_cxt.shadowOffsetY = 2;
            canvas_main_cxt.shadowBlur = 0;
            */
        },
        //draw some object on the canvas
        drawOnCanvas: function(object, cxt){
            cxt.drawImage(object.sprite, object.spritex, object.spritey, object.spritewidth, 20, object.xpos, object.ypos, object.actorwidth, object.actorheight);
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
        //initialise data for the player object
        setupPlayer: function(){
            player = new characterobj();
            player.sprite = allimages[0];
            player.actorwidth = canvas_main.width / 20; //30;
            player.actorheight = canvas_main.width / 20; //30;
            player.xpos = (canvas_main.width / 2) - (player.actorwidth / 2);
            player.ypos = canvas_main.height - player.actorheight;
        },
        //initialise data for the enemies
        setupEnemies: function(){
            var enemyinfo = enemydata(canvas_main);
            var enemycount = 50;
            var enemytmp;

            for(i = 0; i < enemycount; i++){
                thisenemy = Math.floor(getRandomArbitrary(0,enemyinfo.length));

                enemyx = getRandomArbitrary(0,canvas_main.width); //randomly position x
                enemyy = getRandomArbitrary(enemyinfo[thisenemy]['vertposmin'],enemyinfo[thisenemy]['vertposmax']);

                enemytmp = new enemyobj();
                enemytmp.sprite = enemyinfo[thisenemy]['img'];
                enemytmp.spritewidth = enemyinfo[thisenemy]['spritewidth'];
                enemytmp.actorwidth = enemyinfo[thisenemy]['width'];
                enemytmp.actorheight = enemyinfo[thisenemy]['height'];
                enemytmp.xpos = getRandomArbitrary(0,canvas_main.width); //randomly position x
                enemytmp.ypos = getRandomArbitrary(enemyinfo[thisenemy]['vertposmin'],enemyinfo[thisenemy]['vertposmax']);
                enemytmp.range = getRandomArbitrary(50,canvas_main.width / 4); //distance the enemy will move
                enemytmp.direction = getRandomArbitrary(0,1);
                enemytmp.startpos = enemytmp.xpos;
                enemytmp.xp = enemyinfo[thisenemy]['xp'];
                enemytmp.level = enemyinfo[thisenemy]['level'];
                enemytmp.moveby = enemyinfo[thisenemy]['speed'];
                enemies.push(enemytmp);
            }
        },
        //initialise data for power ups
        setupObjects: function(){
            var objectinfo = objdata(canvas_main);
            var objcount = 5;
            var objtmp;

            for(i = 0; i < objcount; i++){
                thisobj = Math.floor(getRandomArbitrary(0,objectinfo.length));
                objtmp = new objectobj();
                objtmp.sprite = objectinfo[thisobj]['img'];
                objtmp.actorwidth = objectinfo[thisobj]['width'];
                objtmp.actorheight = objectinfo[thisobj]['height'];
                objtmp.xpos = getRandomArbitrary(0,canvas_main.width); //randomly position x
                objtmp.ypos = getRandomArbitrary(objectinfo[thisobj]['vertposmin'],objectinfo[thisobj]['vertposmax']);
                objtmp.actiontype = objectinfo[thisobj]['action'];
                objects.push(objtmp);
            }
        }
    },
    game: {
        gameLoop: function(){ //put code in here that needs to run for the game to work
            if(game){
                lenny.general.clearCanvas(canvas_main,canvas_main_cxt); //clear canvas
                canvas_main_cxt.drawImage(levelimages[level - 1],0,0,levelimages[0].width,levelimages[0].height,0,0,canvas_main.width,canvas_main.height); //draw level

                for(i = 0; i < objects.length; i++){ //draw objects
                    objects[i].runActions();
                    if(objects[i].checkCollision(player)){
                        objects.splice(i, 1);
                    }
                }

                for(i = 0; i < enemies.length; i++){ //draw enemies
                    enemies[i].runActions();
                    enemies[i].move();
                    if(enemies[i].checkCollision(player)){
                        enemies.splice(i, 1);
                    }
                }
                player.runActions(); //draw player
                gameloop = setTimeout(lenny.game.gameLoop,10); //repeat
            }
            else {
                canvas_main_cxt.fillText("GAME OVER", canvas_main.width / 2, canvas_main.height - 60);
                canvas_main_cxt.fillText("Score: " + player.score, canvas_main.width / 2, canvas_main.height - 30);
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

    $(window).on('resize',function(){
        resetAndResize();
    });

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
            resetAndResize();
        }
    });

    function resetAndResize(){
        game = 0;
        level = 1;
        clearTimeout(gameloop);
        lenny.general.initCanvasSize();
        lenny.general.initGame();
        lenny.game.gameLoop();
    }

};