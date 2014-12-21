
var skinpath = 'skins/christmas/';
var soundpath = skinpath + 'sound/';

var allimages = ['player.png','explosion.png','player_expired.png','levelup.png'];
var enemyimages = ['enemy1.png','enemy2.png','enemy3.png','enemy4.png','enemy5.png','enemy6.png','enemy7.png','enemy8.png'];
var objectimages = ['object1.png','object2.png','object3.png'];
var levelimages = ['level1.png','level2.png','level3.png']

var allSounds = ['moose.ogg','sigh1.ogg','sigh2.ogg','sigh3.ogg','mediacollege-beep-02.wav','mediacollege-beep-06.wav','soundbible-bells-quiet.ogg'];

var loaders = [];
callAllPreloads(allimages,skinpath,'img');
callAllPreloads(enemyimages,skinpath,'img');
callAllPreloads(objectimages,skinpath,'img');
callAllPreloads(levelimages,skinpath,'img');
callAllPreloads(allSounds,soundpath,'sfx');

function callAllPreloads(array,dir,obtype){
    for(var z = 0; z < array.length; z++){
        loaders.push(loadFile('static/img/' + dir + array[z], array, z, obtype));
    }
}

//preload images and sounds
function loadFile(src,array,num,obtype) {
    var deferred = $.Deferred();
    if(obtype == 'img'){
        var sprite = new Image();
        sprite.onload = function() {
            array[num] = sprite;
            deferred.resolve();
        };
        sprite.src = src;
    }
    else if(obtype == 'sfx'){
        var sound = new Howl({
            urls: [src],
            onload: function(){
                console.log('preloaded',src);
                console.log(allSounds);
                array[num] = sound;
                deferred.resolve();
            }
        });
    }
    return deferred.promise();
}

//function to return all the enemy information
function enemydata(canvas_main){
    var enemywidth = canvas_main.width / 20; //30;
    var enemyheight = canvas_main.width / 20; //30;
    var vertspeed = canvas_main.height / 267;
    var horzspeed = canvas_main.width / 200;
    var spritewidth = 20;
    var spriteheight = 20;
    
    //all calculations are done on the assumption that the general dimensions are 600x800
    //vertposmin = closest this can be positioned to the top
    //vertposmax = closest this can be positioned to the bottom
    var enemydata = [
        {
            'type': 'child1',
            'img': enemyimages[0],
            'imgleft':[0,0],
            'imgright':[20,0],
            'imgdone':[40,0],
            'speed': (horzspeed / 10) * 2,
            'level': 1,
            'xp': 1,
            'vertposmin': canvas_main.height / 4,
            'vertposmax': canvas_main.height - (canvas_main.height / 8),
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': spriteheight,
            'levelcount': [25,0,0]
        },
        {
            'type': 'child2',
            'img': enemyimages[1],
            'imgleft':[0,0],
            'imgright':[20,0],
            'imgdone':[40,0],
            'speed': 0.5,
            'level': 2,
            'xp': 1,
            'vertposmin': canvas_main.height / 3,
            'vertposmax': canvas_main.height - (canvas_main.height / 4),
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': spriteheight,
            'levelcount': [15,0,0]
        },
        {
            'type': 'man',
            'img': enemyimages[2],
            'imgleft':[0,0],
            'imgright':[20,0],
            'imgdone':[40,0],
            'speed': 0.6,
            'level': 4,
            'xp': 1,
            'vertposmin': canvas_main.height / 15,
            'vertposmax': canvas_main.height / 2,
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': spriteheight,
            'levelcount': [12,0,0]
        },
        {
            'type': 'sledge',
            'img': enemyimages[3],
            'imgleft':[0,0],
            'imgright':[40,0],
            'imgdone':[80,0],
            'speed': 0.3,
            'level': 5,
            'xp': 1,
            'vertposmin': canvas_main.height / 2,
            'vertposmax': canvas_main.height / 1.2,
            'width': enemywidth * 2,
            'height': enemyheight,
            'spritewidth': spritewidth * 2,
            'spriteheight': spriteheight,
            'levelcount': [0,12,0]
        },

        {
            'type': 'van',
            'img': enemyimages[4],
            'imgleft':[0,0],
            'imgright':[40,0],
            'imgdone':[80,0],
            'speed': 0.3,
            'level': 6,
            'xp': 1,
            'vertposmin': canvas_main.height / 1.6,
            'vertposmax': canvas_main.height / 1.35,
            'width': enemywidth * 2,
            'height': enemyheight * 1.5,
            'spritewidth': spritewidth * 2,
            'spriteheight': 30,
            'levelcount': [0,4,0]
        },
        {
            'type': 'shoveler',
            'img': enemyimages[5],
            'imgleft':[0,0],
            'imgright':[20,0],
            'imgdone':[40,0],
            'speed': 0.2,
            'level': 7,
            'xp': 1,
            'vertposmin': canvas_main.height / 3,
            'vertposmax': canvas_main.height / 1.7,
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': spriteheight,
            'levelcount': [0,8,0]
        },
        {
            'type': 'carolers',
            'img': enemyimages[6],
            'imgleft':[0,0],
            'imgright':[30,0],
            'imgdone':[60,0],
            'speed': 0.1,
            'level': 8,
            'xp': 1,
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height / 2.5,
            'width': enemywidth * 1.5,
            'height': enemyheight,
            'spritewidth': 30,
            'spriteheight': spriteheight,
            'levelcount': [0,10,0]
        },
        {
            'type': 'boss',
            'img': enemyimages[7],
            'imgleft':[0,0],
            'imgright':[0,0],
            'imgdone':[40,0],
            'speed': 0,
            'level': 11,
            'xp': 0,
            'xpos': (canvas_main.width / 2) - (enemywidth * 5) / 2,
            'ypos': canvas_main.height / 3.4,
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height / 2,
            'width': enemywidth * 2.5,
            'height': enemyheight * 3,
            'spritewidth': 40,
            'spriteheight': 45,
            'levelcount': [0,0,1]
        }
    ];
    return(enemydata);
}

//function to return all the powerups information
function objdata(canvas_main){
    var objwidth = canvas_main.width / 20; //30px;
    var objheight = canvas_main.width / 20; //30px;

    var objdata = [
        {
            'type': 'teleport',
            'img': objectimages[0],
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height - (canvas_main.height / 10),
            'action':0,
            'width': objwidth,
            'height': objheight
        },
        {
            'type': 'level up',
            'img': objectimages[1],
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height - (canvas_main.height / 10),
            'action':1,
            'width': objwidth,
            'height': objheight
        },
        {
            'type': 'party up',
            'img': objectimages[2],
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height - (canvas_main.height / 10),
            'action':2,
            'width': objwidth,
            'height': objheight
        }
    ];
    return(objdata);
}
