var Stage = require('../hilo/view/Stage');
var Ticker = require('../hilo/util/Ticker');
var Bitmap = require('../hilo/view/Bitmap');
var mediator = require('./mediator');
var resource = require('./resource');
var loading = require('./loading');
var Hilo = require('../hilo/core/Hilo');
var Text = require('../hilo/view/Text');
var BitmapText = require('../hilo/view/BitmapText')
var DOMElement = require('../hilo/view/DOMElement')
var Drawable = require('../hilo/view/Drawable')

/**
 * @module weteach-trial-lesson/game
 * @requires hilo/view/Stage
 * @requires hilo/util/Ticker
 * @requires hilo/view/Bitmap
 * @requires weteach-trial-lesson/mediator
 * @requires weteach-trial-lesson/resource
 * @requires weteach-trial-lesson/loading
 */

var outerWidth = 800
var outerHeight = 450

var innerBgWidth = 637

var innerBgGapWidth = (outerWidth - innerBgWidth) / 2

var game = {
  init: function(stageContainer) {
    this.stageContainer = stageContainer;
    this.bindEvent();
    loading.start();
    resource.load();
  },
  bindEvent: function() {
    var that = this;
    mediator.on('resource:loaded', function(event) {
      loading.loaded(event.detail.num);
    });

    mediator.on('resource:complete', function() {
      that.initGame();
    });
  },
  initGame: function() {
    this._initStage();
    // this._initScene();
    // this.preScene();
    // this.earlyScene();
    // this.speechScene();
    // this.playCards()
    this.linkLink()
    mediator.fire('game:init');
    this.ticker.start();
  },
  tick: function(dt) {
    // this.fish.x += 3;
    // if (this.fish.x > this.stage.width) {
    //   this.fish.x = -this.fish.width;
    // }
  },
  _initStage: function() {
    var stage = this.stage = new Stage({
      width: outerWidth,
      height: outerHeight,
      renderType: 'dom',
      container: this.stageContainer,
      //   background: 'rgb(8, 45, 105)'
    });

    stage.enableDOMEvent(Hilo.event.POINTER_START, true);

    var ticker = this.ticker = new Ticker(60);
    ticker.addTick(stage);
    ticker.addTick(this);
  },
  _initScene: function() {
    var bg = this.bg = new Bitmap({
      x: 0,
      y: 0,
      image: resource.get('indexBg'),
      rect: [0, 0, outerWidth, outerHeight]
    });

    var title = this.text = new DOMElement({
      element: Hilo.createElement('p', {
        style: {
          color: '#fff',
          position: 'absolute',
          fontSize: '28px'
        },
        innerText: 'Choose a starting level'
      }),
      width: 300,
      height: 50,
      x: 50,
      y: 30,
    })

    var galleryWith = 150;
    var galleryHeight = 210;
    var galleryTop = 150;

    var pre = new Bitmap({
      x: 95,
      y: galleryTop,
      image: resource.get('pre'),
      rect: [0, 0, galleryWith, galleryHeight],
      style: {
        border: '3px solid rgb(66, 209, 252)'
      }
    })

    var early = new Bitmap({
      x: 285,
      y: galleryTop,
      image: resource.get('early'),
      rect: [0, 0, galleryWith, galleryHeight]
    })

    var speech = new Bitmap({
      x: 475,
      y: galleryTop,
      image: resource.get('speech'),
      rect: [0, 0, galleryWith, galleryHeight]
    })

    this.stage.addChild(bg, title, pre, early, speech);
  },
  preScene: function() {
    var atTheZoo = this.atTheZoo = new Bitmap({
      x: innerBgGapWidth,
      y: 0,
      image: resource.get('atTheZoo'),
      rect: [0, 0, innerBgWidth, outerHeight]
    })

    var leftMenuContainer = this.leftMenuContainer = new Bitmap({
      x: 16,
      y: 150,
      image: resource.get('menuBar'),
      rect: [0, 0, 48, 255]
    })

    var clock = this.clock = new Bitmap({
      x: 27,
      y: 164,
      image: resource.get('clock'),
      rect: [0, 0, 27, 27]
    })

    var face = this.face = new Bitmap({
      x: 27,
      y: 200,
      image: resource.get('face'),
      rect: [0, 0, 27, 27]
    })

    var hand = this.hand = new Bitmap({
      x: 27,
      y: 240,
      image: resource.get('hand'),
      rect: [0, 0, 27, 27]
    })

    var correct = this.correct = new Bitmap({
      x: 27,
      y: 287,
      image: resource.get('correct'),
      rect: [0, 0, 27, 27]
    })

    var incorrect = this.incorrect = new Bitmap({
      x: 27,
      y: 325,
      image: resource.get('incorrect'),
      rect: [0, 0, 27, 27]
    })

    var link = this.link = new Bitmap({
      x: 17,
      y: 357,
      image: resource.get('link'),
      rect: [0, 0, 48, 48]
    })

    var bubble = this.bubble = new Bitmap({
      x: 740,
      y: 148,
      image: resource.get('bubble'),
      rect: [0, 0, 42, 42]
    })

    var star = this.star = new Bitmap({
      x: 740,
      y: 201,
      image: resource.get('star'),
      rect: [0, 0, 42, 42]
    })

    var one = this.one = new Bitmap({
      x: 740,
      y: 255,
      image: resource.get('one'),
      rect: [0, 0, 42, 42]
    })

    var two = this.two = new Bitmap({
      x: 740,
      y: 306,
      image: resource.get('two'),
      rect: [0, 0, 42, 42]
    })

    var back = this.back = new Bitmap({
      x: 740,
      y: 357,
      image: resource.get('back'),
      rect: [0, 0, 42, 42]
    })

    this.stage.addChild(bubble, one, two, back, star, atTheZoo, leftMenuContainer, clock, face, hand, correct, incorrect, link)
  },
  earlyScene: function() {
    var atTheZoo = this.favourite = new Bitmap({
      x: innerBgGapWidth,
      y: 0,
      image: resource.get('favourite'),
      rect: [0, 0, innerBgWidth, outerHeight]
    })

    var leftMenuContainer = this.leftMenuContainer = new Bitmap({
      x: 16,
      y: 150,
      image: resource.get('menuBar'),
      rect: [0, 0, 48, 255]
    })

    var clock = this.clock = new Bitmap({
      x: 27,
      y: 164,
      image: resource.get('clock'),
      rect: [0, 0, 27, 27]
    })

    var face = this.face = new Bitmap({
      x: 27,
      y: 200,
      image: resource.get('face'),
      rect: [0, 0, 27, 27]
    })

    var hand = this.hand = new Bitmap({
      x: 27,
      y: 240,
      image: resource.get('hand'),
      rect: [0, 0, 27, 27]
    })

    var correct = this.correct = new Bitmap({
      x: 27,
      y: 287,
      image: resource.get('correct'),
      rect: [0, 0, 27, 27]
    })

    var incorrect = this.incorrect = new Bitmap({
      x: 27,
      y: 325,
      image: resource.get('incorrect'),
      rect: [0, 0, 27, 27]
    })

    var link = this.link = new Bitmap({
      x: 17,
      y: 357,
      image: resource.get('link'),
      rect: [0, 0, 48, 48]
    })

    var bubble = this.bubble = new Bitmap({
      x: 740,
      y: 148,
      image: resource.get('bubble'),
      rect: [0, 0, 42, 42]
    })

    var star = this.star = new Bitmap({
      x: 740,
      y: 201,
      image: resource.get('star'),
      rect: [0, 0, 42, 42]
    })

    var one = this.one = new Bitmap({
      x: 740,
      y: 255,
      image: resource.get('one'),
      rect: [0, 0, 42, 42]
    })

    var two = this.two = new Bitmap({
      x: 740,
      y: 306,
      image: resource.get('two'),
      rect: [0, 0, 42, 42]
    })

    var back = this.back = new Bitmap({
      x: 740,
      y: 357,
      image: resource.get('back'),
      rect: [0, 0, 42, 42]
    })

    this.stage.addChild(bubble, one, two, back, star, atTheZoo, leftMenuContainer, clock, face, hand, correct, incorrect, link)
  },
  speechScene: function() {
    var atTheZoo = this.favourite = new Bitmap({
      x: innerBgGapWidth,
      y: 0,
      image: resource.get('autumnFall'),
      rect: [0, 0, innerBgWidth, outerHeight]
    })

    var leftMenuContainer = this.leftMenuContainer = new Bitmap({
      x: 16,
      y: 150,
      image: resource.get('menuBar'),
      rect: [0, 0, 48, 255]
    })

    var clock = this.clock = new Bitmap({
      x: 27,
      y: 164,
      image: resource.get('clock'),
      rect: [0, 0, 27, 27]
    })

    var face = this.face = new Bitmap({
      x: 27,
      y: 200,
      image: resource.get('face'),
      rect: [0, 0, 27, 27]
    })

    var hand = this.hand = new Bitmap({
      x: 27,
      y: 240,
      image: resource.get('hand'),
      rect: [0, 0, 27, 27]
    })

    var correct = this.correct = new Bitmap({
      x: 27,
      y: 287,
      image: resource.get('correct'),
      rect: [0, 0, 27, 27]
    })

    var incorrect = this.incorrect = new Bitmap({
      x: 27,
      y: 325,
      image: resource.get('incorrect'),
      rect: [0, 0, 27, 27]
    })

    var link = this.link = new Bitmap({
      x: 17,
      y: 357,
      image: resource.get('leftArrow'),
      rect: [0, 0, 48, 48]
    })

    var bubble = this.bubble = new Bitmap({
      x: 740,
      y: 148,
      image: resource.get('bubble'),
      rect: [0, 0, 42, 42]
    })

    var star = this.star = new Bitmap({
      x: 740,
      y: 201,
      image: resource.get('star'),
      rect: [0, 0, 42, 42]
    })

    var one = this.one = new Bitmap({
      x: 740,
      y: 255,
      image: resource.get('one'),
      rect: [0, 0, 42, 42]
    })

    var two = this.two = new Bitmap({
      x: 740,
      y: 306,
      image: resource.get('two'),
      rect: [0, 0, 42, 42]
    })

    var back = this.back = new Bitmap({
      x: 740,
      y: 357,
      image: resource.get('rightArrow'),
      rect: [0, 0, 42, 42]
    })

    this.stage.addChild(bubble, one, two, back, star, atTheZoo, leftMenuContainer, clock, face, hand, correct, incorrect, link)
  },
  playCards: function() {
    var bg = this.bg = new Bitmap({
      x: 0,
      y: 0,
      image: resource.get('indexBg'),
      rect: [0, 0, outerWidth, outerHeight]
    });

    var leftMenuContainer = this.leftMenuContainer = new Bitmap({
      x: 16,
      y: 150,
      image: resource.get('menuBar'),
      rect: [0, 0, 48, 255]
    })

    var clock = this.clock = new Bitmap({
      x: 27,
      y: 164,
      image: resource.get('clock'),
      rect: [0, 0, 27, 27]
    })

    var face = this.face = new Bitmap({
      x: 27,
      y: 200,
      image: resource.get('face'),
      rect: [0, 0, 27, 27]
    })

    var hand = this.hand = new Bitmap({
      x: 27,
      y: 240,
      image: resource.get('hand'),
      rect: [0, 0, 27, 27]
    })

    var correct = this.correct = new Bitmap({
      x: 27,
      y: 287,
      image: resource.get('correct'),
      rect: [0, 0, 27, 27]
    })

    var incorrect = this.incorrect = new Bitmap({
      x: 27,
      y: 325,
      image: resource.get('incorrect'),
      rect: [0, 0, 27, 27]
    })

    var link = this.link = new Bitmap({
      x: 17,
      y: 357,
      image: resource.get('leftArrow'),
      rect: [0, 0, 48, 48]
    })

    var bubble = this.bubble = new Bitmap({
      x: 740,
      y: 148,
      image: resource.get('bubble'),
      rect: [0, 0, 42, 42]
    })

    var star = this.star = new Bitmap({
      x: 740,
      y: 201,
      image: resource.get('star'),
      rect: [0, 0, 42, 42]
    })

    var bird = this.bird = new Bitmap({
      x: 720,
      y: 265,
      image: resource.get('bird'),
      rect: [0, 0, 75, 75]
    })

    var back = this.back = new Bitmap({
      x: 740,
      y: 357,
      image: resource.get('rightArrow'),
      rect: [0, 0, 42, 42]
    })

    var cardX = 258
    var cardY = 83
    var gap = 15

    var whiteBgBird = this.whiteBg = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: 133,
      height: 173,
      x: cardX,
      y: cardY,
    })

    var brownBird = new Bitmap({
      x: cardX + 30,
      y: cardY + 35,
      image: resource.get('brownBird'),
      rect: [0, 0, 73, 90]
    })

    var whiteBgDuck = this.whiteBg = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: 133,
      height: 173,
      x: cardX + gap,
      y: cardY + gap,
    })

    var duck = new Bitmap({
      x: cardX + gap,
      y: cardY + 38 + gap,
      image: resource.get('duck'),
      rect: [0, 0, 131, 79]
    })

    var whiteBgTiger = this.whiteBg = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: 133,
      height: 173,
      x: cardX + gap * 2,
      y: cardY + gap * 2,
    })

    var tiger = new Bitmap({
      x: cardX + 0 + gap * 2,
      y: cardY + 38 + gap * 2,
      image: resource.get('tiger'),
      rect: [0, 0, 133, 138]
    })

    var whiteBgMonkey = this.whiteBg = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: 133,
      height: 173,
      x: cardX + gap * 3,
      y: cardY + gap * 3,
    })

    var monkey = new Bitmap({
      x: cardX + 5 + gap * 3,
      y: cardY + 20 + gap * 3,
      image: resource.get('monkey'),
      rect: [0, 0, 121, 138]
    })

    var whiteBgRats = this.whiteBg = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: 133,
      height: 173,
      x: cardX + gap * 4,
      y: cardY + gap * 4,
    })

    var rats = new Bitmap({
      x: cardX + 10 + gap * 4,
      y: cardY + 40 + gap * 4,
      image: resource.get('rats'),
      rect: [0, 0, 106, 73]
    })

    var whiteBgCow = this.whiteBg = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: 133,
      height: 173,
      x: cardX + gap * 5,
      y: cardY + gap * 5,
    })

    var cow = new Bitmap({
      x: cardX + 5 + gap * 5,
      y: cardY + 40 + gap * 5,
      image: resource.get('cow'),
      rect: [0, 0, 117, 80]
    })

    this.stage.addChild(bg, leftMenuContainer, clock, face, hand, correct, incorrect, link, back, bubble, star, bird, whiteBgBird, brownBird, whiteBgDuck, duck, whiteBgTiger, tiger, whiteBgMonkey, monkey, whiteBgRats, rats, whiteBgCow, cow)
  },
  linkLink: function() {
    var bg = this.bg = new Bitmap({
      x: 0,
      y: 0,
      image: resource.get('indexBg'),
      rect: [0, 0, outerWidth, outerHeight]
    });

    var leftMenuContainer = this.leftMenuContainer = new Bitmap({
      x: 16,
      y: 150,
      image: resource.get('menuBar'),
      rect: [0, 0, 48, 255]
    })

    var clock = this.clock = new Bitmap({
      x: 27,
      y: 164,
      image: resource.get('clock'),
      rect: [0, 0, 27, 27]
    })

    var face = this.face = new Bitmap({
      x: 27,
      y: 200,
      image: resource.get('face'),
      rect: [0, 0, 27, 27]
    })

    var hand = this.hand = new Bitmap({
      x: 27,
      y: 240,
      image: resource.get('hand'),
      rect: [0, 0, 27, 27]
    })

    var correct = this.correct = new Bitmap({
      x: 27,
      y: 287,
      image: resource.get('correct'),
      rect: [0, 0, 27, 27]
    })

    var incorrect = this.incorrect = new Bitmap({
      x: 27,
      y: 325,
      image: resource.get('incorrect'),
      rect: [0, 0, 27, 27]
    })

    var link = this.link = new Bitmap({
      x: 17,
      y: 357,
      image: resource.get('leftArrow'),
      rect: [0, 0, 48, 48]
    })

    var bubble = this.bubble = new Bitmap({
      x: 740,
      y: 148,
      image: resource.get('bubble'),
      rect: [0, 0, 42, 42]
    })

    var star = this.star = new Bitmap({
      x: 740,
      y: 201,
      image: resource.get('star'),
      rect: [0, 0, 42, 42]
    })

    var bird = this.bird = new Bitmap({
      x: 720,
      y: 265,
      image: resource.get('bird'),
      rect: [0, 0, 75, 75]
    })

    var back = this.back = new Bitmap({
      x: 740,
      y: 357,
      image: resource.get('rightArrow'),
      rect: [0, 0, 42, 42]
})

    var whiteBgWidth = 150
    var whiteBgHeight = 85
    var whiteBgTop = 60
    var whiteBgLeft = 70
    var gap = 20

    var whiteBgDuck = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft,
      y: whiteBgTop,
    })
    var whiteBgMonkey = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth + gap,
      y: whiteBgTop,
    })
    var whiteBgDuck2 = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth * 2 + gap * 2,
      y: whiteBgTop,
    })
    var whiteBgCow = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth * 3 + gap * 3,
      y: whiteBgTop,
    })
    var whiteBgBird = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft,
      y: whiteBgTop + whiteBgHeight + gap,
    })
    var whiteBgBird2 = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth + gap,
      y: whiteBgTop + whiteBgHeight + gap,
    })
    var whiteBgRats = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth * 2 + gap * 2,
      y: whiteBgTop + whiteBgHeight + gap,
    })
    var whiteBgRats2 = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth * 3 + gap * 3,
      y: whiteBgTop + whiteBgHeight + gap,
    })
    var whiteBgCow2 = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft,
      y: whiteBgTop + whiteBgHeight * 2 + gap * 2,
    })
    var whiteBgTiger = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth + gap,
      y: whiteBgTop + whiteBgHeight * 2 + gap * 2,
    })
    var whiteBgMonkey2 = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth * 2 + gap * 2,
      y: whiteBgTop + whiteBgHeight * 2 + gap * 2,
    })

    var whiteBgTiger2 = new DOMElement({
      element: Hilo.createElement('div', {
        style: {
          background: '#fff',
          position: 'absolute',
          borderRadius: '20px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
        }
      }),
      width: whiteBgWidth,
      height: whiteBgHeight,
      x: whiteBgLeft + whiteBgWidth * 3 + gap * 3,
      y: whiteBgTop + whiteBgHeight * 2 + gap * 2,
    })

    this.stage.addChild(bg, leftMenuContainer, clock, face, hand, correct, incorrect, link, back, bubble, star, bird, whiteBgDuck, whiteBgMonkey, whiteBgDuck2, whiteBgCow, whiteBgBird, whiteBgBird2, whiteBgRats, whiteBgRats2, whiteBgCow2, whiteBgTiger, whiteBgTiger2, whiteBgMonkey2)
  }
};

module.exports = game;
