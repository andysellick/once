
var skinpath = 'skins/christmas/';

//load images
var allimages = ['player.png','explosion.png','player_expired.png','levelup.png'];
var enemyimages = ['enemy1.png','enemy2.png','enemy3.png','enemy4.png','enemy5.png','enemy6.png','enemy7.png'];
var objectimages = ['object1.png','object2.png','object3.png'];
var levelimages = ['level1.png','level2.png','level3.png','level4.png']
var expiredimages = ['enemy1_end.png','enemy2_end.png']

allimages = preloadImages(allimages);
enemyimages = preloadImages(enemyimages);
objectimages = preloadImages(objectimages);
levelimages = preloadImages(levelimages);
expiredimages = preloadImages(expiredimages);

//preload images
function preloadImages(array){
    var imagedir = 'static/img/' + skinpath;
    var tempimg;
    for(i in array){
        tempimg = new Image();
        tempimg.src = imagedir + array[i];
        array[i] = tempimg;
    }
    return(array);
}

//function to return all the enemy information
function enemydata(canvas_main){
    var enemywidth = canvas_main.width / 20; //30;
    var enemyheight = canvas_main.width / 20; //30;
    var spritewidth = 20;
    
    //all calculations are done on the assumption that the general dimensions are 600x800
    //vertposmin = closest this can be positioned to the top
    //vertposmax = closest this can be positioned to the bottom
    var enemydata = [
        {
            'type': '',
            'img': enemyimages[0],
            'expired':expiredimages[0],
            'speed': 0.4,
            'level': 1,
            'xp': 1,
            'vertposmin': canvas_main.height / 4,
            'vertposmax': canvas_main.height - (canvas_main.height / 8),
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': 20,
            'levelcount': [24,0,0]
        },
        {
            'type': '',
            'img': enemyimages[1],
            'expired':expiredimages[1],
            'speed': 0.5,
            'level': 2,
            'xp': 1,
            'vertposmin': canvas_main.height / 3,
            'vertposmax': canvas_main.height - (canvas_main.height / 4),
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': 20,
            'levelcount': [15,0,0]
        },
        {
            'type': 'wolf',
            'img': enemyimages[2],
            'speed': 0.6,
            'level': 3,
            'xp': 1,
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height / 2,
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': 20,
            'levelcount': [12,12,4]
        },
        {
            'type': 'bear',
            'img': enemyimages[3],
            'speed': 0.3,
            'level': 7,
            'xp': 1,
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height / 2 + canvas_main.height / 3,
            'width': enemywidth * 2,
            'height': enemyheight,
            'spritewidth': 40,
            'spriteheight': 20,
            'levelcount': [0,10,5]
        },
        {
            'type': 'dragon',
            'img': enemyimages[4],
            'speed': 0.3,
            'level': 8,
            'xp': 1,
            'vertposmin': canvas_main.height / 20,
            'vertposmax': canvas_main.height / 4,
            'width': enemywidth * 2,
            'height': enemyheight * 1.5,
            'spritewidth': 40,
            'spriteheight': 30,
            'levelcount': [0,10,5]
        },
        {
            'type': 'ogre',
            'img': enemyimages[5],
            'speed': 0.2,
            'level': 10,
            'xp': 1,
            'vertposmin': canvas_main.height / 20,
            'vertposmax': canvas_main.height / 3,
            'width': enemywidth * 2.5,
            'height': enemyheight * 2.5,
            'spritewidth': 50,
            'spriteheight': 50,
            'levelcount': [0,0,3]
        },
        {
            'type': 'boss',
            'img': enemyimages[6],
            'speed': 0,
            'level': 14,
            'xp': 20,
            'xpos': (canvas_main.width / 2) - (enemywidth * 5) / 2,
            'ypos': canvas_main.height / 4,
            'vertposmin': canvas_main.height / 20,
            'vertposmax': canvas_main.height / 3,
            'width': enemywidth * 5,
            'height': enemyheight * 3.5,
            'spritewidth': 100,
            'spriteheight': 70,
            'levelcount': [0,0,0,1]
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
