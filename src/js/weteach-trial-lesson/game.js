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
var Container = require('../hilo/view/Container')
var Drawable = require('../hilo/view/Drawable')
var Class = require('../hilo/core/Class')

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

var scaleX = (window.innerWidth / outerWidth)
var scaleY = window.innerHeight / outerHeight

var innerBgWidth = 637

var innerBgGapWidth = (outerWidth - innerBgWidth) / 2

var game = {
  init: function(stageContainer) {
    this.stageContainer = stageContainer;
    this.bindEvent();
    loading.start();
    resource.load();
  },
  previousScene: null,
  activeScene: null,
  activeQuestion: 0,
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

    this._initScene();
    this.preScene();
    this.earlyScene();
    this.speechScene();
    this.playCards()
    this.linkLink()

    // this.replaceLinkCards('pre')

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
      scaleX: scaleX,
      scaleY: scaleY
      //   background: 'rgb(8, 45, 105)'
    });

    stage.enableDOMEvent(Hilo.event.POINTER_START, true);

    var ticker = this.ticker = new Ticker(60);
    ticker.addTick(stage);
    ticker.addTick(this);
  },
  _initScene: function(properties) {
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
      width: 500,
      height: 50,
      x: 50,
      y: 30,
    })

    var galleryWith = 150;
    var galleryHeight = 210;
    var galleryTop = 150;

    var pre = new Bitmap({
      id: 'pre',
      x: 135,
      y: galleryTop,
      image: resource.get('pre'),
      rect: [0, 0, galleryWith, galleryHeight],
      style: {
        border: '3px solid rgb(66, 209, 252)'
      }
    })

    // click pre image jump to pre scene.
    pre.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      this.gameReadyScene.visible = false
      this.activeScene = this.gamePreScene
      this.gamePreScene.visible = true
    })

    var early = new Bitmap({
      id: 'early',
      x: 315,
      y: galleryTop,
      image: resource.get('early'),
      rect: [0, 0, galleryWith, galleryHeight]
    })

    // click to jump to early scene.
    early.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      this.gameReadyScene.visible = false
      this.activeScene = this.gameEarlyScene
      this.gameEarlyScene.visible = true
    })

    var speech = new Bitmap({
      id: 'speech',
      x: 505,
      y: galleryTop,
      image: resource.get('speech'),
      rect: [0, 0, galleryWith, galleryHeight]
    })

    // click to jump to speech scene.
    speech.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      this.gameReadyScene.visible = false
      this.activeScene = this.gameSpeechScene
      this.gameSpeechScene.visible = true
    })

    var scene = this.gameReadyScene = new Container()
    scene.addChild(bg, title, pre, early, speech);
    scene.addTo(this.stage)
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

    one.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      this.activeQuestion = 1
      this.gamePreScene.visible = false
      this.replaceCards('pre')
      this.gamePlayCardsScene.visible = true
    })

    var two = this.two = new Bitmap({
      x: 740,
      y: 306,
      image: resource.get('two'),
      rect: [0, 0, 42, 42]
    })

    two.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      this.activeQuestion = 2
      this.gamePreScene.visible = false
      this.replaceCards('pre2')
      this.gamePlayCardsScene.visible = true
    })

    var back = this.back = new Bitmap({
      x: 740,
      y: 357,
      image: resource.get('back'),
      rect: [0, 0, 42, 42]
    })

    back.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      this.gamePreScene.visible = false;
      this.gameReadyScene.visible = true;
    })

    link.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      window.open('http://www.starfall.com/n/level-k/index/load.htm')
    })

    var gamePreScene = this.gamePreScene = new Container({
      width: outerWidth,
      height: outerHeight,
      id: 'game-pre-scene',
      background: 'rgb(8, 45, 105)'
    })
    gamePreScene.addChild(bubble, one, two, back, star, atTheZoo, leftMenuContainer, clock, face, hand, correct, incorrect, link)
    gamePreScene.addTo(this.stage)
    gamePreScene.visible = false
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
      id: 'early-link',
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

    one.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      this.activeQuestion = 1
      this.gameEarlyScene.visible = false
      this.replaceCards('early')
      this.gamePlayCardsScene.visible = true
    })

    var two = this.two = new Bitmap({
      x: 740,
      y: 306,
      image: resource.get('two'),
      rect: [0, 0, 42, 42]
    })

    two.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      this.activeQuestion = 2
      this.gameEarlyScene.visible = false
      this.replaceCards('early2')
      this.gamePlayCardsScene.visible = true
    })

    var back = this.back = new Bitmap({
      x: 740,
      y: 357,
      image: resource.get('back'),
      rect: [0, 0, 42, 42]
    })

    back.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      this.gameEarlyScene.visible = false;
      this.gameReadyScene.visible = true;
    })

    link.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      window.open('http://www.starfall.com/n/level-a/learn-to-read/load.htm')
    })

    var gameEarlyScene = this.gameEarlyScene = new Container({
      width: outerWidth,
      height: outerHeight,
      id: 'game-early-scene',
      background: 'rgb(8, 45, 105)'
    })
    gameEarlyScene.addChild(bubble, one, two, back, star, atTheZoo, leftMenuContainer, clock, face, hand, correct, incorrect, link)
    gameEarlyScene.addTo(this.stage)
    gameEarlyScene.visible = false
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

    one.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      this.activeQuestion = 1
      this.gameSpeechScene.visible = false
      this.replaceCards('speech')
      this.gamePlayCardsScene.visible = true
    })

    var two = this.two = new Bitmap({
      x: 740,
      y: 306,
      image: resource.get('two'),
      rect: [0, 0, 42, 42]
    })

    two.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      this.activeQuestion = 2
      this.gameSpeechScene.visible = false
      this.replaceCards('speech2')
      this.gamePlayCardsScene.visible = true
    })

    var back = this.back = new Bitmap({
      x: 740,
      y: 357,
      image: resource.get('back'),
      rect: [0, 0, 42, 42]
    })

    back.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      this.gameSpeechScene.visible = false
      this.gameReadyScene.visible = true
    })

    link.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation();
      window.open('http://www.starfall.com/n/level-k/index/load.htm')
    })

    var gameSpeechScene = this.gameSpeechScene = new Container({
      width: outerWidth,
      height: outerHeight,
      id: 'game-speech-scene',
      background: 'rgb(8, 45, 105)'
    })
    gameSpeechScene.addChild(bubble, one, two, back, star, atTheZoo, leftMenuContainer, clock, face, hand, correct, incorrect, link)
    gameSpeechScene.addTo(this.stage)
    gameSpeechScene.visible = false
  },
  playCards: function() {
    var bg = this.bg = new Bitmap({
      x: 0,
      y: 0,
      image: resource.get('indexBg'),
      rect: [0, 0, outerWidth, outerHeight]
    });

    var that = this

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

    link.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      this.gamePlayCardsScene.visible = false
      this.activeScene.visible = true
      this.activeQuestion = 0
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

    back.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      var scene = that.activeScene.id
      switch (scene) {
        case 'game-pre-scene':
          if (this.activeQuestion === 1) {
            this.replaceLinkCards('pre')
          } else {
            this.replaceLinkCards('pre2')
          }
          break

        case 'game-early-scene':
          if (this.activeQuestion === 1) {
            this.replaceLinkCards('early')
          } else {
            this.replaceLinkCards('early2')
          }
          break

        case 'game-speech-scene':
          if (this.activeQuestion === 1) {
            this.replaceLinkCards('speech')
          } else {
            this.replaceLinkCards('speech2')
          }
          break
      }

      this.gamePlayCardsScene.visible = false
      this.gameLinkScene.visible = true
    })

    var gamePlayCardsScene = null
    gamePlayCardsScene = this.gamePlayCardsScene = new Container({
      width: outerWidth,
      height: outerHeight,
    })
    gamePlayCardsScene.addChild(bg, leftMenuContainer, clock, face, hand, correct, incorrect, link, back, bubble, star, bird)

    gamePlayCardsScene.addTo(this.stage)
    gamePlayCardsScene.visible = false
  },
  replaceCards: function(type) {
    // cards  below.
    var cardX = 258
    var cardY = 83
    var gap = 15
    var cardWidth = 133
    var cardHeight = 173

    var cardClick = 0

    var that = this
    var activeContainer = null

    function ifRemoveCard(view) {
      if (view) {
        activeContainer = view.parent
        var target = view.id
        var post = target.match(/-\d?$/)

        var textId = 'cardText' + post
        var bgId = 'cardBg' + post
        var txtBgId = 'cardTxtBg' + post
        var imgId = 'cardAnimal' + post

        var txtlist = [txtBgId, textId]
        var imgList = [imgId, bgId]

        switch (cardClick) {
          case 0:
            imgList.forEach(i => activeContainer.removeChildById(i))
            cardClick += 1
            break
          case 1:
            txtlist.forEach(item => activeContainer.removeChildById(item))
            cardClick = 0
            break
        }

        if (post[0] === '-0' && cardClick === 0) {
          var boomFlower = new Bitmap({
            x: 94,
            y: 47,
            image: resource.get('boomFlower'),
            rect: [0, 0, 542, 350]
          })

          that.gamePlayCardsScene.addChild(boomFlower)
        }
      }
    }

    function generateCards(arr = []) {
      var result = []

      arr.forEach((item, index) => {
        var x = cardX + gap * index
        var y = cardY + gap * index

        // white background for text card
        var txtBg = new DOMElement({
          id: 'cardTxtBg-' + index,
          element: Hilo.createElement('div', {
            style: {
              background: '#fff',
              position: 'absolute',
              borderRadius: '20px',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
            }
          }),
          width: cardWidth,
          height: cardHeight,
          x: x,
          y: y,
        })
        result.push(txtBg)

        // English words.   text
        var txt = ''
        switch (item) { // transform some words.
          case 'brownBird':
            txt = 'bird'
            break

          case 'rats':
            txt = 'mouse'
            break

          default:
            txt = item
        }

        var word = new DOMElement({
          id: 'cardText-' + index,
          element: Hilo.createElement('p', {
            style: {
              position: 'absolute',
              fontSize: '24px',
            },
            innerText: txt,
          }),
          x: x,
          y: y + 30,
          width: cardWidth,
          height: '50',
        })
        result.push(word)

        // white background for image
        var bg = new DOMElement({
          id: 'cardBg-' + index,
          element: Hilo.createElement('div', {
            style: {
              background: '#fff',
              position: 'absolute',
              borderRadius: '20px',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
            }
          }),
          width: cardWidth,
          height: cardHeight,
          x: x,
          y: y,
        })
        result.push(bg)

        // image.
        var img = new Bitmap({
          id: 'cardAnimal-' + index,
          x: x + 10,
          y: y + 40,
          image: resource.get(item),
          rect: [0, 0, cardWidth - 20, 90]
        })
        result.push(img)

        // bind click event on elements.
        var list = [bg, img, txtBg, word]

        list.forEach(item => {
          item.on(Hilo.event.POINTER_START, e => {
            e.stopImmediatePropagation()
            ifRemoveCard(item)
          })
        })
      })

      return result
    }

    this.gamePlayCardsScene.addChild(...generateCards(that.generateAnimals(type)))
  },
  generateAnimals: function(type) {
    var animals = []
    switch (type) {
      case 'pre':
        animals = ['brownBird', 'duck', 'tiger', 'monkey', 'rats', 'cow']
        break

      case 'pre2':
        animals = ['elephant', 'horse', 'sheep', 'chicken', 'crocodile', 'frog']
        break

      case 'early':
        animals = ['panda', 'kangaroo', 'dolphin', 'bear', 'lion', 'kitten']
        break

      case 'early2':
        animals = ['pirate', 'skates', 'puppy', 'rabbit', 'whale', 'shark']
        break

      case 'speech':
        animals = ['fridge', 'fallOver', 'ill', 'cook', 'cut', 'chemist']
        break

      case 'speech2':
        animals = ['saltPepper', 'meal', 'honey', 'jam', 'pizza', 'medicine']
        break

      default:
        animals = []
        break
    }

    return animals
  },
  linkLink: function() {
    var bg = this.bg = new Bitmap({
      x: 0,
      y: 0,
      image: resource.get('indexBg'),
      rect: [0, 0, outerWidth, outerHeight]
    });

    var that = this

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

    link.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      this.gameLinkScene.visible = false
      this.activeScene.visible = true
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

    back.on(Hilo.event.POINTER_START, e => {
      e.stopImmediatePropagation()

      if (this.activeQuestion === 2) {
        this.gameLinkScene.visible = false
        this.activeScene.visible = true
        return
      }

      var scene = that.activeScene.id
      switch (scene) {
        case 'game-pre-scene':
          this.replaceCards('pre2')
          break

        case 'game-early-scene':
          this.replaceCards('early2')
          break

        case 'game-speech-scene':
          this.replaceCards('speech2')
          break
      }

      this.activeQuestion = 2
      this.gameLinkScene.visible = false
      this.gamePlayCardsScene.visible = true
    })

    // Cards below.
    var gameLinkScene = this.gameLinkScene = new Container({
      width: outerWidth,
      height: outerHeight,
      id: 'game-link-scene',
      //   background: 'rgb(8, 45, 105)'
    })

    gameLinkScene.addTo(this.stage)
    gameLinkScene.visible = false
    gameLinkScene.addChild(bg, leftMenuContainer, clock, face, hand, correct, incorrect, link, back, bubble, star, bird)
  },
  getRandomInt: function(min, max) {
    var min = Math.ceil(min);
    var max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  replaceLinkCards: function(type) {
    var whiteBgWidth = 150
    var whiteBgHeight = 85
    var whiteBgTop = 60
    var whiteBgLeft = 70
    var gap = 20
    var that = this

    var animals = this.generateAnimals(type)
    var totalLength = animals.length * 2
    var cardsArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    animals.forEach(item => { //  这个随机数 不行，还需要能够枚举，且不能重复。这个问题非常有意思。
      var index = this.getRandomInt(0, 11)
      while (cardsArr[index] !== 0) {
        index = this.getRandomInt(0, 11)
      }

      if (cardsArr[index] === 0 && 0 <= index && index <= 11) {
        cardsArr[index] = item
      }
    })

    var tmp = []
    cardsArr.forEach((item, index) => {
      if (item === 0) {
        tmp.push(index)
      }
    })

    for (var i = 5; i > -1; i--) { //  逆向 push.
      cardsArr[tmp[5 - i]] = animals[i]
    }

    var colors = [
      'rgb(216,155,11)',
      'rgb(33,160,180)',
      'rgb(130,201,63)',
      'rgb(66,209,252)',
      'rgb(252,74,136)',
      'rgb(134,71,254)',
      'rgb(39,73,254)',
      'rgb(137,197,6)',
      'rgb(17,137,135)',
      'rgb(251,78,9)',
      'rgb(253,134,9)',
      'rgb(251,25,8)'
    ]

    var alphaBats = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

    function addAgain() {
      that.gameLinkScene.addChild(that.removedView)
    }

    function generateCards(animals) {
      var result = []

      if (animals) {
        animals.forEach((item, index) => {
          var xTimes = index % 4
          var yTimes = index % 3
          var x = whiteBgLeft + whiteBgWidth * xTimes + gap * xTimes
          var y = whiteBgTop + whiteBgHeight * yTimes + gap * yTimes

          var bg = new DOMElement({
            id: 'link-bg-' + index,
            element: Hilo.createElement('div', {
              style: {
                background: '#fff',
                position: 'absolute',
                borderRadius: '20px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
              }
            }),
            width: whiteBgWidth,
            height: whiteBgHeight,
            x: x,
            y: y,
          })
          result.push(bg)

          bg.on(Hilo.event.POINTER_START, e => {
            e.stopImmediatePropagation()
            addAgain()
          })

          var img = new Bitmap({
            id: 'link-img-' + index,
            x: x + 20,
            y: y,
            image: resource.get(item),
            rect: [0, 0, 100, whiteBgHeight]
          })
          result.push(img)

          img.on(Hilo.event.POINTER_START, e => {
            e.stopImmediatePropagation()
            addAgain()
          })

          var bgAlpha = new DOMElement({
            id: 'link-bg-alpha-' + index,
            element: Hilo.createElement('div', {
              style: {
                background: colors[index],
                position: 'absolute',
                borderRadius: '20px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                fontSize: '60px',
                color: '#fff',
                textAlign: 'center',
              },
              innerText: alphaBats[index]
            }),
            width: whiteBgWidth,
            height: whiteBgHeight,
            x: x,
            y: y,
          })
          result.push(bgAlpha)

          bgAlpha.on(Hilo.event.POINTER_START, e => {
            e.stopImmediatePropagation()
            that.removedView = bgAlpha
            that.gameLinkScene.removeChild(bgAlpha)
          })
        })
      }

      return result
    }

    this.gameLinkScene.addChild(...generateCards(cardsArr))
  },
  removedView: null,
};

module.exports = game;
