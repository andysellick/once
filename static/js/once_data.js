
//load images
var allimages = ['player.png','explosion.png','player_expired.png'];
var enemyimages = ['enemy1.png','enemy2.png','enemy3.png','enemy4.png','enemy5.png'];
var objectimages = ['object1.png','object2.png','object3.png'];
var levelimages = ['level1.png','level2.png']

allimages = preloadImages(allimages);
enemyimages = preloadImages(enemyimages);
objectimages = preloadImages(objectimages);
levelimages = preloadImages(levelimages);

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
            'type': 'ghost',
            'img': enemyimages[0],
            'speed': 0.5,
            'level': 1,
            'xp': 1,
            'vertposmin': canvas_main.height / 4,
            'vertposmax': canvas_main.height - (canvas_main.height / 8),
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': 20,
            'levelcount': [20,15]
        },
        {
            'type': 'blob',
            'img': enemyimages[1],
            'speed': 0.7,
            'level': 2,
            'xp': 1,
            'vertposmin': canvas_main.height / 3,
            'vertposmax': canvas_main.height - (canvas_main.height / 4),
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': 20,
            'levelcount': [10,15]
        },
        {
            'type': 'wolf',
            'img': enemyimages[2],
            'speed': 0.9,
            'level': 3,
            'xp': 1,
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height - (canvas_main.height / 2),
            'width': enemywidth,
            'height': enemyheight,
            'spritewidth': spritewidth,
            'spriteheight': 20,
            'levelcount': [6,8]
        },
        {
            'type': 'bear',
            'img': enemyimages[3],
            'speed': 0.3,
            'level': 5,
            'xp': 1,
            'vertposmin': canvas_main.height / 10,
            'vertposmax': canvas_main.height - (canvas_main.height / 1.5),
            'width': enemywidth * 2,
            'height': enemyheight,
            'spritewidth': 40,
            'spriteheight': 20,
            'levelcount': [5,5]
        },
        {
            'type': 'dragon',
            'img': enemyimages[4],
            'speed': 0.2,
            'level': 7,
            'xp': 1,
            'vertposmin': canvas_main.height / 20,
            'vertposmax': canvas_main.height / 10,
            'width': enemywidth * 2,
            'height': enemyheight * 1.5,
            'spritewidth': 40,
            'spriteheight': 30,
            'levelcount': [2,5]
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
