/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var game = __webpack_require__(1);
	game.init(document.getElementById('stageContainer'));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Stage = __webpack_require__(2);
	var Ticker = __webpack_require__(14);
	var Bitmap = __webpack_require__(15);
	var mediator = __webpack_require__(16);
	var resource = __webpack_require__(17);
	var loading = __webpack_require__(21);
	var Hilo = __webpack_require__(3);
	var Text = __webpack_require__(22);
	var BitmapText = __webpack_require__(24)
	var DOMElement = __webpack_require__(25)
	var Container = __webpack_require__(5)
	var Drawable = __webpack_require__(12)
	var Class = __webpack_require__(4)

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Hilo = __webpack_require__(3);
	var Class = __webpack_require__(4);
	var Container = __webpack_require__(5);
	var CanvasRenderer = __webpack_require__(9);
	var DOMRenderer = __webpack_require__(11);
	var WebGLRenderer = __webpack_require__(13);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * 示例:
	 * <pre>
	 * var stage = new Hilo.Stage({
	 *     container: containerElement,
	 *     width: 320,
	 *     height: 480
	 * });
	 * </pre>
	 * @class 舞台是可视对象树的根，可视对象只有添加到舞台或其子对象后才会被渲染出来。创建一个hilo应用一般都是从创建一个stage开始的。
	 * @augments Container
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。主要有：
	 * <ul>
	 * <li><b>container</b>:String|HTMLElement - 指定舞台在页面中的父容器元素。它是一个dom容器或id。若不传入此参数且canvas未被加入到dom树，则需要在舞台创建后手动把舞台画布加入到dom树中，否则舞台不会被渲染。可选。</li>
	 * <li><b>renderType</b>:String - 指定渲染方式，canvas|dom|webgl，默认canvas。可选。</li>
	 * <li><b>canvas</b>:String|HTMLCanvasElement|HTMLElement - 指定舞台所对应的画布元素。它是一个canvas或普通的div，也可以传入元素的id。若为canvas，则使用canvas来渲染所有对象，否则使用dom+css来渲染。可选。</li>
	 * <li><b>width</b>:Number</li> - 指定舞台的宽度。默认为canvas的宽度。可选。
	 * <li><b>height</b>:Number</li> - 指定舞台的高度。默认为canvas的高度。可选。
	 * <li><b>paused</b>:Boolean</li> - 指定舞台是否停止渲染。默认为false。可选。
	 * </ul>
	 * @module hilo/view/Stage
	 * @requires hilo/core/Hilo
	 * @requires hilo/core/Class
	 * @requires hilo/view/Container
	 * @requires hilo/renderer/CanvasRenderer
	 * @requires hilo/renderer/DOMRenderer
	 * @requires hilo/renderer/WebGLRenderer
	 * @property {HTMLCanvasElement|HTMLElement} canvas 舞台所对应的画布。它可以是一个canvas或一个普通的div。只读属性。
	 * @property {Renderer} renderer 舞台渲染器。只读属性。
	 * @property {Boolean} paused 指示舞台是否暂停刷新渲染。
	 * @property {Object} viewport 舞台内容在页面中的渲染区域。包含的属性有：left、top、width、height。只读属性。
	 */
	var Stage = Class.create(/** @lends Stage.prototype */{
	    Extends: Container,
	    constructor: function(properties){
	        properties = properties || {};
	        this.id = this.id || properties.id || Hilo.getUid('Stage');
	        Stage.superclass.constructor.call(this, properties);

	        this._initRenderer(properties);

	        //init size
	        var width = this.width, height = this.height,
	            viewport = this.updateViewport();
	        if(!properties.width) width = (viewport && viewport.width) || 320;
	        if(!properties.height) height = (viewport && viewport.height) || 480;
	        this.resize(width, height, true);
	    },

	    canvas: null,
	    renderer: null,
	    paused: false,
	    viewport: null,

	    /**
	     * @private
	     */
	    _initRenderer: function(properties){
	        var canvas = properties.canvas;
	        var container = properties.container;
	        var renderType = properties.renderType||'canvas';

	        if(typeof canvas === 'string') canvas = Hilo.getElement(canvas);
	        if(typeof container === 'string') container = Hilo.getElement(container);

	        if(!canvas){
	            var canvasTagName = renderType === 'dom'?'div':'canvas';
	            canvas = Hilo.createElement(canvasTagName, {
	                style: {
	                    position: 'absolute'
	                }
	            });
	        }
	        else if(!canvas.getContext){
	            renderType = 'dom';
	        }

	        this.canvas = canvas;
	        if(container) container.appendChild(canvas);

	        var props = {canvas:canvas, stage:this};
	        switch(renderType){
	            case 'dom':
	                this.renderer = new DOMRenderer(props);
	                break;
	            case 'webgl':
	                if(WebGLRenderer.isSupport()){
	                    this.renderer = new WebGLRenderer(props);
	                }
	                else{
	                    this.renderer = new CanvasRenderer(props);
	                }
	                break;
	            case 'canvas':
	            default:
	                this.renderer = new CanvasRenderer(props);
	                break;
	        }
	    },

	    /**
	     * 添加舞台画布到DOM容器中。注意：此方法覆盖了View.addTo方法。
	     * @param {HTMLElement} domElement 一个dom元素。
	     * @returns {Stage} 舞台本身，可用于链式调用。
	     */
	    addTo: function(domElement){
	        var canvas = this.canvas;
	        if(canvas.parentNode !== domElement){
	            domElement.appendChild(canvas);
	        }
	        return this;
	    },

	    /**
	     * 调用tick会触发舞台的更新和渲染。开发者一般无需使用此方法。
	     * @param {Number} delta 调度器当前调度与上次调度tick之间的时间差。
	     */
	    tick: function(delta){
	        if(!this.paused){
	            this._render(this.renderer, delta);
	        }
	    },

	    /**
	     * 开启/关闭舞台的DOM事件响应。要让舞台上的可视对象响应用户交互，必须先使用此方法开启舞台的相应事件的响应。
	     * @param {String|Array} type 要开启/关闭的事件名称或数组。
	     * @param {Boolean} enabled 指定开启还是关闭。如果不传此参数，则默认为开启。
	     * @returns {Stage} 舞台本身。链式调用支持。
	     */
	    enableDOMEvent: function(type, enabled){
	        var me = this,
	            canvas = me.canvas,
	            types = typeof type === 'string' ? [type] : type,
	            enabled = enabled !== false,
	            handler = me._domListener || (me._domListener = function(e){me._onDOMEvent(e)});

	        for(var i = 0; i < types.length; i++){
	            var type = types[i];

	            if(enabled){
	                canvas.addEventListener(type, handler, false);
	            }else{
	                canvas.removeEventListener(type, handler);
	            }
	        }

	        return me;
	    },

	    /**
	     * DOM事件处理函数。此方法会把事件调度到事件的坐标点所对应的可视对象。
	     * @private
	     */
	    _onDOMEvent: function(e){
	        var type = e.type, event = e, isTouch = type.indexOf('touch') == 0;

	        //calculate stageX/stageY
	        var posObj = e;
	        if(isTouch){
	            var touches = e.touches, changedTouches = e.changedTouches;
	            posObj = (touches && touches.length) ? touches[0] :
	                     (changedTouches && changedTouches.length) ? changedTouches[0] : null;
	        }

	        var x = posObj.pageX || posObj.clientX, y = posObj.pageY || posObj.clientY,
	            viewport = this.viewport || this.updateViewport();

	        event.stageX = x = (x - viewport.left) / this.scaleX;
	        event.stageY = y = (y - viewport.top) / this.scaleY;

	        //鼠标事件需要阻止冒泡方法
	        event.stopPropagation = function(){
	            this._stopPropagationed = true;
	        };

	        var obj = this.getViewAtPoint(x, y, true, false, true)||this,
	            canvas = this.canvas, target = this._eventTarget;

	        //fire mouseout/touchout event for last event target
	        var leave = type === 'mouseout';
	        //当obj和target不同 且obj不是target的子元素时才触发out事件
	        if(target && (target != obj && (!target.contains || !target.contains(obj))|| leave)){
	            var out = (type === 'touchmove') ? 'touchout' :
	                      (type === 'mousemove' || leave || !obj) ? 'mouseout' : null;
	            if(out) {
	                var outEvent = Hilo.copy({}, event);
	                outEvent.type = out;
	                outEvent.eventTarget = target;
	                target._fireMouseEvent(outEvent);
	            }
	            event.lastEventTarget = target;
	            this._eventTarget = null;
	        }

	        //fire event for current view
	        if(obj && obj.pointerEnabled && type !== 'mouseout'){
	            event.eventTarget = this._eventTarget = obj;
	            obj._fireMouseEvent(event);
	        }

	        //set cursor for current view
	        if(!isTouch){
	            var cursor = (obj && obj.pointerEnabled && obj.useHandCursor) ? 'pointer' : '';
	            canvas.style.cursor = cursor;
	        }

	        //fix android: `touchmove` fires only once
	        if(Hilo.browser.android && type === 'touchmove'){
	            e.preventDefault();
	        }
	    },

	    /**
	     * 更新舞台在页面中的可视区域，即渲染区域。当舞台canvas的样式border、margin、padding等属性更改后，需要调用此方法更新舞台渲染区域。
	     * @returns {Object} 舞台的可视区域。即viewport属性。
	     */
	    updateViewport: function(){
	        var canvas = this.canvas, viewport = null;
	        if(canvas.parentNode){
	            viewport = this.viewport = Hilo.getElementRect(canvas);
	        }
	        return viewport;
	    },

	    /**
	     * 改变舞台的大小。
	     * @param {Number} width 指定舞台新的宽度。
	     * @param {Number} height 指定舞台新的高度。
	     * @param {Boolean} forceResize 指定是否强制改变舞台大小，即不管舞台大小是否相同，仍然强制执行改变动作，可确保舞台、画布以及视窗之间的尺寸同步。
	     */
	    resize: function(width, height, forceResize){
	        if(forceResize || this.width !== width || this.height !== height){
	            this.width = width;
	            this.height = height;
	            this.renderer.resize(width, height);
	            this.updateViewport();
	        }
	    }

	});


	module.exports = Stage;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @namespace Hilo的基础核心方法集合。
	 * @static
	 * @module hilo/core/Hilo
	 */
	var Hilo = (function(){

	var win = window, doc = document, docElem = doc.documentElement,
	    uid = 0;

	return {
	    /**
	     * 获取一个全局唯一的id。如Stage1，Bitmap2等。
	     * @param {String} prefix 生成id的前缀。
	     * @returns {String} 全局唯一id。
	     */
	    getUid: function(prefix){
	        var id = ++uid;
	        if(prefix){
	            var charCode = prefix.charCodeAt(prefix.length - 1);
	            if (charCode >= 48 && charCode <= 57) prefix += "_"; //0至9之间添加下划线
	            return prefix + id;
	        }
	        return id;
	    },

	    /**
	     * 为指定的可视对象生成一个包含路径的字符串表示形式。如Stage1.Container2.Bitmap3。
	     * @param {View} view 指定的可视对象。
	     * @returns {String} 可视对象的字符串表示形式。
	     */
	    viewToString: function(view){
	        var result, obj = view;
	        while(obj){
	            result = result ? (obj.id + '.' + result) : obj.id;
	            obj = obj.parent;
	        }
	        return result;
	    },

	    /**
	     * 简单的浅复制对象。
	     * @param {Object} target 要复制的目标对象。
	     * @param {Object} source 要复制的源对象。
	     * @param {Boolean} strict 指示是否复制未定义的属性，默认为false，即不复制未定义的属性。
	     * @returns {Object} 复制后的对象。
	     */
	    copy: function(target, source, strict){
	        for(var key in source){
	            if(!strict || target.hasOwnProperty(key) || target[key] !== undefined){
	                target[key] = source[key];
	            }
	        }
	        return target;
	    },

	    /**
	     * 浏览器特性集合。包括：
	     * <ul>
	     * <li><b>jsVendor</b> - 浏览器厂商CSS前缀的js值。比如：webkit。</li>
	     * <li><b>cssVendor</b> - 浏览器厂商CSS前缀的css值。比如：-webkit-。</li>
	     * <li><b>supportTransform</b> - 是否支持CSS Transform变换。</li>
	     * <li><b>supportTransform3D</b> - 是否支持CSS Transform 3D变换。</li>
	     * <li><b>supportStorage</b> - 是否支持本地存储localStorage。</li>
	     * <li><b>supportTouch</b> - 是否支持触碰事件。</li>
	     * <li><b>supportCanvas</b> - 是否支持canvas元素。</li>
	     * </ul>
	     */
	    browser: (function(){
	        var ua = navigator.userAgent;
	        var data = {
	            iphone: /iphone/i.test(ua),
	            ipad: /ipad/i.test(ua),
	            ipod: /ipod/i.test(ua),
	            ios: /iphone|ipad|ipod/i.test(ua),
	            android: /android/i.test(ua),
	            webkit: /webkit/i.test(ua),
	            chrome: /chrome/i.test(ua),
	            safari: /safari/i.test(ua),
	            firefox: /firefox/i.test(ua),
	            ie: /msie/i.test(ua),
	            opera: /opera/i.test(ua),
	            supportTouch: 'ontouchstart' in win,
	            supportCanvas: doc.createElement('canvas').getContext != null,
	            supportStorage: false,
	            supportOrientation: 'orientation' in win,
	            supportDeviceMotion: 'ondevicemotion' in win
	        };

	        //`localStorage` is null or `localStorage.setItem` throws error in some cases (e.g. localStorage is disabled)
	        try{
	            var value = 'hilo';
	            localStorage.setItem(value, value);
	            localStorage.removeItem(value);
	            data.supportStorage = true;
	        }catch(e){ };

	        //vendro prefix
	        var jsVendor = data.jsVendor = data.webkit ? 'webkit' : data.firefox ? 'Moz' : data.opera ? 'O' : data.ie ? 'ms' : '';
	        var cssVendor = data.cssVendor = '-' + jsVendor + '-';

	        //css transform/3d feature dectection
	        var testElem = doc.createElement('div'), style = testElem.style;
	        var supportTransform = style[jsVendor + 'Transform'] != undefined;
	        var supportTransform3D = style[jsVendor + 'Perspective'] != undefined;
	        if(supportTransform3D){
	            testElem.id = 'test3d';
	            style = doc.createElement('style');
	            style.textContent = '@media ('+ cssVendor +'transform-3d){#test3d{height:3px}}';
	            doc.head.appendChild(style);

	            docElem.appendChild(testElem);
	            supportTransform3D = testElem.offsetHeight == 3;
	            doc.head.removeChild(style);
	            docElem.removeChild(testElem);
	        };
	        data.supportTransform = supportTransform;
	        data.supportTransform3D = supportTransform3D;

	        return data;
	    })(),

	    /**
	     * 事件类型枚举对象。包括：
	     * <ul>
	     * <li><b>POINTER_START</b> - 鼠标或触碰开始事件。对应touchstart或mousedown。</li>
	     * <li><b>POINTER_MOVE</b> - 鼠标或触碰移动事件。对应touchmove或mousemove。</li>
	     * <li><b>POINTER_END</b> - 鼠标或触碰结束事件。对应touchend或mouseup。</li>
	     * </ul>
	     */
	    event: (function(){
	        var supportTouch = 'ontouchstart' in win;
	        return {
	            POINTER_START: supportTouch ? 'touchstart' : 'mousedown',
	            POINTER_MOVE: supportTouch ? 'touchmove' : 'mousemove',
	            POINTER_END: supportTouch ? 'touchend' : 'mouseup'
	        };
	    })(),

	    /**
	     * 可视对象对齐方式枚举对象。包括：
	     * <ul>
	     * <li><b>TOP_LEFT</b> - 左上角对齐。</li>
	     * <li><b>TOP</b> - 顶部居中对齐。</li>
	     * <li><b>TOP_RIGHT</b> - 右上角对齐。</li>
	     * <li><b>LEFT</b> - 左边居中对齐。</li>
	     * <li><b>CENTER</b> - 居中对齐。</li>
	     * <li><b>RIGHT</b> - 右边居中对齐。</li>
	     * <li><b>BOTTOM_LEFT</b> - 左下角对齐。</li>
	     * <li><b>BOTTOM</b> - 底部居中对齐。</li>
	     * <li><b>BOTTOM_RIGHT</b> - 右下角对齐。</li>
	     * </ul>
	     */
	    align: {
	        TOP_LEFT: 'TL', //top & left
	        TOP: 'T', //top & center
	        TOP_RIGHT: 'TR', //top & right
	        LEFT: 'L', //left & center
	        CENTER: 'C', //center
	        RIGHT: 'R', //right & center
	        BOTTOM_LEFT: 'BL', //bottom & left
	        BOTTOM: 'B', //bottom & center
	        BOTTOM_RIGHT: 'BR' //bottom & right
	    },

	    /**
	     * 获取DOM元素在页面中的内容显示区域。
	     * @param {HTMLElement} elem DOM元素。
	     * @returns {Object} DOM元素的可视区域。格式为：{left:0, top:0, width:100, height:100}。
	     */
	    getElementRect: function(elem){
	        try{
	            //this fails if it's a disconnected DOM node
	            var bounds = elem.getBoundingClientRect();
	        }catch(e){
	            bounds = {top:elem.offsetTop, left:elem.offsetLeft, width:elem.offsetWidth, height:elem.offsetHeight};
	        }

	        var offsetX = ((win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)) || 0;
	        var offsetY = ((win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0)) || 0;
	        var styles = win.getComputedStyle ? getComputedStyle(elem) : elem.currentStyle;
	        var parseIntFn = parseInt;

	        var padLeft = (parseIntFn(styles.paddingLeft) + parseIntFn(styles.borderLeftWidth)) || 0;
	        var padTop = (parseIntFn(styles.paddingTop) + parseIntFn(styles.borderTopWidth)) || 0;
	        var padRight = (parseIntFn(styles.paddingRight) + parseIntFn(styles.borderRightWidth)) || 0;
	        var padBottom = (parseIntFn(styles.paddingBottom) + parseIntFn(styles.borderBottomWidth)) || 0;
	        var top = bounds.top || 0;
	        var left = bounds.left || 0;

	        return {
	            left: left + offsetX + padLeft,
	            top: top + offsetY + padTop,
	            width: bounds.right - padRight - left - padLeft,
	            height: bounds.bottom - padBottom - top - padTop
	        };
	    },

	    /**
	     * 创建一个DOM元素。可指定属性和样式。
	     * @param {String} type 要创建的DOM元素的类型。比如：'div'。
	     * @param {Object} properties 指定DOM元素的属性和样式。
	     * @returns {HTMLElement} 一个DOM元素。
	     */
	    createElement: function(type, properties){
	        var elem = doc.createElement(type), p, val, s;
	        for(p in properties){
	            val = properties[p];
	            if(p === 'style'){
	                for(s in val) elem.style[s] = val[s];
	            }else{
	                elem[p] = val;
	            }
	        }
	        return elem;
	    },

	    /**
	     * 根据参数id获取一个DOM元素。此方法等价于document.getElementById(id)。
	     * @param {String} id 要获取的DOM元素的id。
	     * @returns {HTMLElement} 一个DOM元素。
	     */
	    getElement: function(id){
	        return doc.getElementById(id);
	    },

	    /**
	     * 设置可视对象DOM元素的CSS样式。
	     * @param {View} obj 指定要设置CSS样式的可视对象。
	     * @private
	     */
	    setElementStyleByView: function(obj){
	        var drawable = obj.drawable,
	            style = drawable.domElement.style,
	            stateCache = obj._stateCache || (obj._stateCache = {}),
	            prefix = Hilo.browser.jsVendor, px = 'px', flag = false;

	        if(this.cacheStateIfChanged(obj, ['visible'], stateCache)){
	            style.display = !obj.visible ? 'none' : '';
	        }
	        if(this.cacheStateIfChanged(obj, ['alpha'], stateCache)){
	            style.opacity = obj.alpha;
	        }
	        if(!obj.visible || obj.alpha <= 0) return;

	        if(this.cacheStateIfChanged(obj, ['width'], stateCache)){
	            style.width = obj.width + px;
	        }
	        if(this.cacheStateIfChanged(obj, ['height'], stateCache)){
	            style.height = obj.height + px;
	        }
	        if(this.cacheStateIfChanged(obj, ['depth'], stateCache)){
	            style.zIndex = obj.depth + 1;
	        }
	        if(flag = this.cacheStateIfChanged(obj, ['pivotX', 'pivotY'], stateCache)){
	            style[prefix + 'TransformOrigin'] = obj.pivotX + px + ' ' + obj.pivotY + px;
	        }
	        if(this.cacheStateIfChanged(obj, ['x', 'y', 'rotation', 'scaleX', 'scaleY'], stateCache) || flag){
	            style[prefix + 'Transform'] = this.getTransformCSS(obj);
	        }
	        if(this.cacheStateIfChanged(obj, ['background'], stateCache)){
	            style.backgroundColor = obj.background;
	        }
	        if(!style.pointerEvents){
	            style.pointerEvents = 'none';
	        }

	        //render image as background
	        var image = drawable.image;
	        if(image){
	            var src = image.src;
	            if(src !== stateCache.image){
	                stateCache.image = src;
	                style.backgroundImage = 'url(' + src + ')';
	            }

	            var rect = drawable.rect;
	            if(rect){
	                var sx = rect[0], sy = rect[1];
	                if(sx !== stateCache.sx){
	                    stateCache.sx = sx;
	                    style.backgroundPositionX = -sx + px;
	                }
	                if(sy !== stateCache.sy){
	                    stateCache.sy = sy;
	                    style.backgroundPositionY = -sy + px;
	                }
	            }
	        }

	        //render mask
	        var mask = obj.mask;
	        if(mask){
	            var maskImage = mask.drawable.domElement.style.backgroundImage;
	            if(maskImage !== stateCache.maskImage){
	                stateCache.maskImage = maskImage;
	                style[prefix + 'MaskImage'] = maskImage;
	                style[prefix + 'MaskRepeat'] = 'no-repeat';
	            }

	            var maskX = mask.x, maskY = mask.y;
	            if(maskX !== stateCache.maskX || maskY !== stateCache.maskY){
	                stateCache.maskX = maskX;
	                stateCache.maskY = maskY;
	                style[prefix + 'MaskPosition'] = maskX + px + ' ' + maskY + px;
	            }
	        }
	    },

	    /**
	     * @private
	     */
	    cacheStateIfChanged: function(obj, propNames, stateCache){
	        var i, len, name, value, changed = false;
	        for(i = 0, len = propNames.length; i < len; i++){
	            name = propNames[i];
	            value = obj[name];
	            if(value != stateCache[name]){
	                stateCache[name] = value;
	                changed = true;
	            }
	        }
	        return changed;
	    },

	    /**
	     * 生成可视对象的CSS变换样式。
	     * @param {View} obj 指定生成CSS变换样式的可视对象。
	     * @returns {String} 生成的CSS样式字符串。
	     */
	    getTransformCSS: function(obj){
	        var use3d = this.browser.supportTransform3D,
	            str3d = use3d ? '3d' : '';

	        return 'translate' + str3d + '(' + (obj.x - obj.pivotX) + 'px, ' + (obj.y - obj.pivotY) + (use3d ? 'px, 0px)' : 'px)')
	             + 'rotate' + str3d + (use3d ? '(0, 0, 1, ' : '(') + obj.rotation + 'deg)'
	             + 'scale' + str3d + '(' + obj.scaleX + ', ' + obj.scaleY + (use3d ? ', 1)' : ')');
	    }
	};

	})();

	module.exports = Hilo;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */ 

	/**
	 * 创建类示例：
	 * <pre>
	 * var Bird = Hilo.Class.create({
	 *     Extends: Animal,
	 *     Mixes: EventMixin,
	 *     constructor: function(name){
	 *         this.name = name;
	 *     },
	 *     fly: function(){
	 *         console.log('I am flying');
	 *     },
	 *     Statics: {
	 *         isBird: function(bird){
	 *             return bird instanceof Bird;
	 *         }
	 *     }
	 * });
	 *
	 * var swallow = new Bird('swallow');
	 * swallow.fly();
	 * Bird.isBird(swallow);
	 * </pre>
	 * @namespace Class是提供类的创建的辅助工具。
	 * @static
	 * @module hilo/core/Class
	 */
	var Class = (function(){

	/**
	 * 根据参数指定的属性和方法创建类。
	 * @param {Object} properties 要创建的类的相关属性和方法。主要有：
	 * <ul>
	 * <li><b>Extends</b> - 指定要继承的父类。</li>
	 * <li><b>Mixes</b> - 指定要混入的成员集合对象。</li>
	 * <li><b>Statics</b> - 指定类的静态属性或方法。</li>
	 * <li><b>constructor</b> - 指定类的构造函数。</li>
	 * <li>其他创建类的成员属性或方法。</li>
	 * </ul>
	 * @returns {Object} 创建的类。
	 */
	var create = function(properties){
	    properties = properties || {};
	    var clazz = properties.hasOwnProperty('constructor') ? properties.constructor : function(){};
	    implement.call(clazz, properties);
	    return clazz;
	}

	/**
	 * @private
	 */
	var implement = function(properties){
	    var proto = {}, key, value;
	    for(key in properties){
	        value = properties[key];
	        if(classMutators.hasOwnProperty(key)){
	            classMutators[key].call(this, value);
	        }else{
	            proto[key] = value;
	        }
	    }

	    mix(this.prototype, proto);
	};

	var classMutators = /** @ignore */{
	    Extends: function(parent){
	        var existed = this.prototype, proto = createProto(parent.prototype);
	        //inherit static properites
	        mix(this, parent);
	        //keep existed properties
	        mix(proto, existed);
	        //correct constructor
	        proto.constructor = this;
	        //prototype chaining
	        this.prototype = proto;
	        //shortcut to parent's prototype
	        this.superclass = parent.prototype;
	    },

	    Mixes: function(items){
	        items instanceof Array || (items = [items]);
	        var proto = this.prototype, item;

	        while(item = items.shift()){
	            mix(proto, item.prototype || item);
	        }
	    },

	    Statics: function(properties){
	        mix(this, properties);
	    }
	};

	/**
	 * @private
	 */
	var createProto = (function(){
	    if(Object.__proto__){
	        return function(proto){
	            return {__proto__: proto};
	        }
	    }else{
	        var Ctor = function(){};
	        return function(proto){
	            Ctor.prototype = proto;
	            return new Ctor();
	        }
	    }
	})();

	/**
	 * 混入属性或方法。
	 * @param {Object} target 混入目标对象。
	 * @param {Object} source 要混入的属性和方法来源。可支持多个来源参数。
	 * @returns {Object} 混入目标对象。
	 */
	var mix = function(target){
	    for(var i = 1, len = arguments.length; i < len; i++){
	        var source  = arguments[i], defineProps;
	        for(var key in source){
	            var prop = source[key];
	            if(prop && typeof prop === 'object'){
	                if(prop.value !== undefined || typeof prop.get === 'function' || typeof prop.set === 'function'){
	                    defineProps = defineProps || {};
	                    defineProps[key] = prop;
	                    continue;
	                }
	            }
	            target[key] = prop;
	        }
	        if(defineProps) defineProperties(target, defineProps);
	    }

	    return target;
	};

	try{
	    var defineProperty = Object.defineProperty,
	        defineProperties = Object.defineProperties;
	    defineProperty({}, '$', {value:0});
	}catch(e){
	    if('__defineGetter__' in Object){
	        defineProperty = function(obj, prop, desc){
	            if('value' in desc) obj[prop] = desc.value;
	            if('get' in desc) obj.__defineGetter__(prop, desc.get);
	            if('set' in desc) obj.__defineSetter__(prop, desc.set);
	            return obj;
	        };
	        defineProperties = function(obj, props){
	            for(var prop in props){
	                if(props.hasOwnProperty(prop)){
	                    defineProperty(obj, prop, props[prop]);
	                }
	            }
	            return obj;
	        };
	    }
	}

	return {create:create, mix:mix};

	})();


	module.exports = Class;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Hilo = __webpack_require__(3);
	var Class = __webpack_require__(4);
	var View = __webpack_require__(6);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class Container是所有容器类的基类。每个Container都可以添加其他可视对象为子级。
	 * @augments View
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/view/Container
	 * @requires hilo/core/Hilo
	 * @requires hilo/core/Class
	 * @requires hilo/view/View
	 * @property {Array} children 容器的子元素列表。只读。
	 * @property {Boolean} pointerChildren 指示容器的子元素是否能响应用户交互事件。默认为true。
	 * @property {Boolean} clipChildren 指示是否裁剪超出容器范围的子元素。默认为false。
	 */
	var Container = Class.create(/** @lends Container.prototype */{
	    Extends: View,
	    constructor: function(properties){
	        properties = properties || {};
	        this.id = this.id || properties.id || Hilo.getUid("Container");
	        Container.superclass.constructor.call(this, properties);

	        if(this.children) this._updateChildren();
	        else this.children = [];
	    },

	    children: null,
	    pointerChildren: true,
	    clipChildren: false,

	    /**
	     * 返回容器的子元素的数量。
	     * @returns {Uint} 容器的子元素的数量。
	     */
	    getNumChildren: function(){
	        return this.children.length;
	    },

	    /**
	     * 在指定索引位置添加子元素。
	     * @param {View} child 要添加的子元素。
	     * @param {Number} index 指定的索引位置，从0开始。
	     */
	    addChildAt: function(child, index){
	        var children = this.children,
	            len = children.length,
	            parent = child.parent;

	        index = index < 0 ? 0 : index > len ? len : index;
	        var childIndex = this.getChildIndex(child);
	        if(childIndex == index){
	            return this;
	        }else if(childIndex >= 0){
	            children.splice(childIndex, 1);
	            index = index == len ? len - 1 : index;
	        }else if(parent){
	            parent.removeChild(child);
	        }

	        children.splice(index, 0, child);

	        //直接插入，影响插入位置之后的深度
	        if(childIndex < 0){
	            this._updateChildren(index);
	        }
	        //只是移动时影响中间段的深度
	        else{
	            var startIndex = childIndex < index ? childIndex : index;
	            var endIndex = childIndex < index ? index : childIndex;;
	            this._updateChildren(startIndex, endIndex + 1);
	        }

	        return this;
	    },

	    /**
	     * 在最上面添加子元素。
	     * @param {View} child 要添加的子元素。
	     */
	    addChild: function(child){
	        var total = this.children.length,
	            args = arguments;

	        for(var i = 0, len = args.length; i < len; i++){
	            this.addChildAt(args[i], total + i);
	        }
	        return this;
	    },

	    /**
	     * 在指定索引位置删除子元素。
	     * @param {Int} index 指定删除元素的索引位置，从0开始。
	     * @returns {View} 被删除的对象。
	     */
	    removeChildAt: function(index){
	        var children = this.children;
	        if(index < 0 || index >= children.length) return null;

	        var child = children[index];
	        if(child){
	            //NOTE: use `__renderer` for fixing child removal (DOMRenderer and FlashRenderer only).
	            //Do `not` use it in any other case.
	            if(!child.__renderer){
	                var obj = child;
	                while(obj = obj.parent){
	                    //obj is stage
	                    if(obj.renderer){
	                        child.__renderer = obj.renderer;
	                        break;
	                    }
	                    else if(obj.__renderer){
	                        child.__renderer = obj.__renderer;
	                        break;
	                    }
	                }
	            }

	            if(child.__renderer){
	                child.__renderer.remove(child);
	            }

	            child.parent = null;
	            child.depth = -1;
	        }

	        children.splice(index, 1);
	        this._updateChildren(index);

	        return child;
	    },

	    /**
	     * 删除指定的子元素。
	     * @param {View} child 指定要删除的子元素。
	     * @returns {View} 被删除的对象。
	     */
	    removeChild: function(child){
	        return this.removeChildAt(this.getChildIndex(child));
	    },

	    /**
	     * 删除指定id的子元素。
	     * @param {String} id 指定要删除的子元素的id。
	     * @returns {View} 被删除的对象。
	     */
	    removeChildById: function(id){
	        var children = this.children, child;
	        for(var i = 0, len = children.length; i < len; i++){
	            child = children[i];
	            if(child.id === id){
	                this.removeChildAt(i);
	                return child;
	            }
	        }
	        return null;
	    },

	    /**
	     * 删除所有的子元素。
	     * @returns {Container} 容器本身。
	     */
	    removeAllChildren: function(){
	        while(this.children.length) this.removeChildAt(0);
	        return this;
	    },

	    /**
	     * 返回指定索引位置的子元素。
	     * @param {Number} index 指定要返回的子元素的索引值，从0开始。
	     */
	    getChildAt: function(index){
	        var children = this.children;
	        if(index < 0 || index >= children.length) return null;
	        return children[index];
	    },

	    /**
	     * 返回指定id的子元素。
	     * @param {String} id 指定要返回的子元素的id。
	     */
	    getChildById: function(id){
	        var children = this.children, child;
	        for(var i = 0, len = children.length; i < len; i++){
	            child = children[i];
	            if(child.id === id) return child;
	        }
	        return null;
	    },

	    /**
	     * 返回指定子元素的索引值。
	     * @param {View} child 指定要返回索引值的子元素。
	     */
	    getChildIndex: function(child){
	        return this.children.indexOf(child);
	    },

	    /**
	     * 设置子元素的索引位置。
	     * @param {View} child 指定要设置的子元素。
	     * @param {Number} index 指定要设置的索引值。
	     */
	    setChildIndex: function(child, index){
	        var children = this.children,
	            oldIndex = children.indexOf(child);

	        if(oldIndex >= 0 && oldIndex != index){
	            var len = children.length;
	            index = index < 0 ? 0 : index >= len ? len - 1 : index;
	            children.splice(oldIndex, 1);
	            children.splice(index, 0, child);
	            this._updateChildren();
	        }
	        return this;
	    },

	    /**
	     * 交换两个子元素的索引位置。
	     * @param {View} child1 指定要交换的子元素A。
	     * @param {View} child2 指定要交换的子元素B。
	     */
	    swapChildren: function(child1, child2){
	        var children = this.children,
	            index1 = this.getChildIndex(child1),
	            index2 = this.getChildIndex(child2);

	        child1.depth = index2;
	        children[index2] = child1;
	        child2.depth = index1;
	        children[index1] = child2;
	    },

	    /**
	     * 交换两个指定索引位置的子元素。
	     * @param {Number} index1 指定要交换的索引位置A。
	     * @param {Number} index2 指定要交换的索引位置B。
	     */
	    swapChildrenAt: function(index1, index2){
	        var children = this.children,
	            child1 = this.getChildAt(index1),
	            child2 = this.getChildAt(index2);

	        child1.depth = index2;
	        children[index2] = child1;
	        child2.depth = index1;
	        children[index1] = child2;
	    },

	    /**
	     * 根据指定键值或函数对子元素进行排序。
	     * @param {Object} keyOrFunction 如果此参数为String时，则根据子元素的某个属性值进行排序；如果此参数为Function时，则根据此函数进行排序。
	     */
	    sortChildren: function(keyOrFunction){
	        var fn = keyOrFunction,
	            children = this.children;
	        if(typeof fn == "string"){
	            var key = fn;
	            fn = function(a, b){
	                return b[key] - a[key];
	            };
	        }
	        children.sort(fn);
	        this._updateChildren();
	    },

	    /**
	     * 更新子元素。
	     * @private
	     */
	    _updateChildren: function(start, end){
	        var children = this.children, child,
	            start = start || 0,
	            end = end || children.length;
	        for(var i = start; i < end; i++){
	            child = children[i];
	            child.depth = i + 1;
	            child.parent = this;
	        }
	    },

	    /**
	     * 返回是否包含参数指定的子元素。
	     * @param {View} child 指定要测试的子元素。
	     */
	    contains: function(child){
	        while(child = child.parent){
	            if(child === this){
	                return true;
	            }
	        }
	        return false;
	    },

	    /**
	     * 返回由x和y指定的点下的对象。
	     * @param {Number} x 指定点的x轴坐标。
	     * @param {Number} y 指定点的y轴坐标。
	     * @param {Boolean} usePolyCollision 指定是否使用多边形碰撞检测。默认为false。
	     * @param {Boolean} global 使用此标志表明将查找所有符合的对象，而不仅仅是第一个，即全局匹配。默认为false。
	     * @param {Boolean} eventMode 使用此标志表明将在事件模式下查找对象。默认为false。
	     */
	    getViewAtPoint: function(x, y, usePolyCollision, global, eventMode){
	        var result = global ? [] : null,
	            children = this.children, child, obj;

	        for(var i = children.length - 1; i >= 0; i--){
	            child = children[i];
	            //skip child which is not shown or pointer enabled
	            if(!child || !child.visible || child.alpha <= 0 || (eventMode && !child.pointerEnabled)) continue;
	            //find child recursively
	            if(child.children && child.children.length && !(eventMode && !child.pointerChildren)){
	                obj = child.getViewAtPoint(x, y, usePolyCollision, global, eventMode);
	            }

	            if(obj){
	                if(!global) return obj;
	                else if(obj.length) result = result.concat(obj);
	            }else if(child.hitTestPoint(x, y, usePolyCollision)){
	                if(!global) return child;
	                else result.push(child);
	            }
	        }

	        return global && result.length ? result : null;
	    },

	    /**
	     * 覆盖渲染方法。
	     * @private
	     */
	    render: function(renderer, delta){
	        Container.superclass.render.call(this, renderer, delta);

	        var children = this.children.slice(0), i, len, child;
	        for(i = 0, len = children.length; i < len; i++){
	            child = children[i];
	            //NOTE: the child could remove or change it's parent
	            if(child.parent === this) child._render(renderer, delta);
	        }
	    }

	});

	module.exports = Container;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Hilo = __webpack_require__(3);
	var Class = __webpack_require__(4);
	var EventMixin = __webpack_require__(7);
	var Matrix = __webpack_require__(8);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class View类是所有可视对象或组件的基类。
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/view/View
	 * @requires hilo/core/Hilo
	 * @requires hilo/core/Class
	 * @requires hilo/event/EventMixin
	 * @requires hilo/geom/Matrix
	 * @property {String} id 可视对象的唯一标识符。
	 * @property {Number} x 可视对象的x轴坐标。默认值为0。
	 * @property {Number} y 可视对象的y轴坐标。默认值为0。
	 * @property {Number} width 可视对象的宽度。默认值为0。
	 * @property {Number} height 可视对象的高度。默认值为0。
	 * @property {Number} alpha 可视对象的透明度。默认值为1。
	 * @property {Number} rotation 可视对象的旋转角度。默认值为0。
	 * @property {Boolean} visible 可视对象是否可见。默认为可见，即true。
	 * @property {Number} pivotX 可视对象的中心点的x轴坐标。默认值为0。
	 * @property {Number} pivotY 可视对象的中心点的y轴坐标。默认值为0。
	 * @property {Number} scaleX 可视对象在x轴上的缩放比例。默认为不缩放，即1。
	 * @property {Number} scaleY 可视对象在y轴上的缩放比例。默认为不缩放，即1。
	 * @property {Boolean} pointerEnabled 可视对象是否接受交互事件。默认为接受交互事件，即true。
	 * @property {Object} background 可视对象的背景样式。可以是CSS颜色值、canvas的gradient或pattern填充。
	 * @property {Graphics} mask 可视对象的遮罩图形。
	 * @property {String|Function} align 可视对象相对于父容器的对齐方式。取值可查看Hilo.align枚举对象。
	 * @property {Container} parent 可视对象的父容器。只读属性。
	 * @property {Number} depth 可视对象的深度，也即z轴的序号。只读属性。
	 * @property {Drawable} drawable 可视对象的可绘制对象。供高级开发使用。
	 * @property {Array} boundsArea 可视对象的区域顶点数组。格式为：[{x:10, y:10}, {x:20, y:20}]。
	 */
	var View = (function(){

	return Class.create(/** @lends View.prototype */{
	    Mixes: EventMixin,
	    constructor: function(properties){
	        properties = properties || {};
	        this.id = this.id || properties.id || Hilo.getUid("View");
	        Hilo.copy(this, properties, true);
	    },

	    id: null,
	    x: 0,
	    y: 0,
	    width: 0,
	    height: 0,
	    alpha: 1,
	    rotation: 0,
	    visible: true,
	    pivotX: 0,
	    pivotY: 0,
	    scaleX: 1,
	    scaleY: 1,
	    pointerEnabled: true,
	    background: null,
	    mask: null,
	    align: null,
	    drawable: null,
	    boundsArea: null,
	    parent: null,
	    depth: -1,

	    /**
	     * 返回可视对象的舞台引用。若对象没有被添加到舞台，则返回null。
	     * @returns {Stage} 可视对象的舞台引用。
	     */
	    getStage: function(){
	        var obj = this, parent;
	        while(parent = obj.parent) obj = parent;
	        //NOTE: don't use `instanceof` to prevent circular module requirement.
	        //But it's not a very reliable way to check it's a stage instance.
	        if(obj.canvas) return obj;
	        return null;
	    },

	    /**
	     * 返回可视对象缩放后的宽度。
	     * @returns {Number} 可视对象缩放后的宽度。
	     */
	    getScaledWidth: function(){
	        return this.width * this.scaleX;
	    },

	    /**
	     * 返回可视对象缩放后的高度。
	     * @returns {Number} 可视对象缩放后的高度。
	     */
	    getScaledHeight: function(){
	        return this.height * this.scaleY;
	    },

	    /**
	     * 添加此对象到父容器。
	     * @param {Container} container 一个容器。
	     * @param {Uint} index 要添加到索引位置。
	     * @returns {View} 可视对象本身。
	     */
	    addTo: function(container, index){
	        if(typeof index === 'number') container.addChildAt(this, index);
	        else container.addChild(this);
	        return this;
	    },

	    /**
	     * 从父容器里删除此对象。
	     * @returns {View} 可视对象本身。
	     */
	    removeFromParent: function(){
	        var parent = this.parent;
	        if(parent) parent.removeChild(this);
	        return this;
	    },

	    /**
	     * 获取可视对象在舞台全局坐标系内的外接矩形以及所有顶点坐标。
	     * @returns {Array} 可视对象的顶点坐标数组vertexs。另vertexs还包含属性：
	     * <ul>
	     * <li><b>x</b> - 可视对象的外接矩形x轴坐标。</li>
	     * <li><b>y</b> - 可视对象的外接矩形y轴坐标。</li>
	     * <li><b>width</b> - 可视对象的外接矩形的宽度。</li>
	     * <li><b>height</b> - 可视对象的外接矩形的高度。</li>
	     * </ul>
	     */
	    getBounds: function(){
	        var w = this.width, h = this.height,
	            mtx = this.getConcatenatedMatrix(),
	            poly = this.boundsArea || [{x:0, y:0}, {x:w, y:0}, {x:w, y:h}, {x:0, y:h}],
	            vertexs = [], point, x, y, minX, maxX, minY, maxY;

	        for(var i = 0, len = poly.length; i < len; i++){
	            point = mtx.transformPoint(poly[i], true, true);
	            x = point.x;
	            y = point.y;

	            if(i == 0){
	                minX = maxX = x;
	                minY = maxY = y;
	            }else{
	                if(minX > x) minX = x;
	                else if(maxX < x) maxX = x;
	                if(minY > y) minY = y;
	                else if(maxY < y) maxY = y;
	            }
	            vertexs[i] = point;
	        }

	        vertexs.x = minX;
	        vertexs.y = minY;
	        vertexs.width = maxX - minX;
	        vertexs.height = maxY - minY;
	        return vertexs;
	    },

	    /**
	     * 获取可视对象相对于其某个祖先（默认为最上层容器）的连接矩阵。
	     * @param {View} ancestor 可视对象的相对的祖先容器。
	     * @private
	     */
	    getConcatenatedMatrix: function(ancestor){
	        var mtx = new Matrix(1, 0, 0, 1, 0, 0);

	        for(var o = this; o != ancestor && o.parent; o = o.parent){
	            var cos = 1, sin = 0,
	                rotation = o.rotation % 360,
	                pivotX = o.pivotX, pivotY = o.pivotY,
	                scaleX = o.scaleX, scaleY = o.scaleY;

	            if(rotation){
	                var r = rotation * Math.PI / 180;
	                cos = Math.cos(r);
	                sin = Math.sin(r);
	            }

	            if(pivotX != 0) mtx.tx -= pivotX;
	            if(pivotY != 0) mtx.ty -= pivotY;
	            mtx.concat(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, o.x, o.y);
	        }
	        return mtx;
	    },

	    /**
	     * 检测由x和y参数指定的点是否在其外接矩形之内。
	     * @param {Number} x 要检测的点的x轴坐标。
	     * @param {Number} y 要检测的点的y轴坐标。
	     * @param {Boolean} usePolyCollision 是否使用多边形碰撞检测。默认为false。
	     * @returns {Boolean} 点是否在可视对象之内。
	     */
	    hitTestPoint: function(x, y, usePolyCollision){
	        var bound = this.getBounds(),
	            hit = x >= bound.x && x <= bound.x + bound.width &&
	                  y >= bound.y && y <= bound.y + bound.height;

	        if(hit && usePolyCollision){
	            hit = pointInPolygon(x, y, bound);
	        }
	        return hit;
	    },

	    /**
	     * 检测object参数指定的对象是否与其相交。
	     * @param {View} object 要检测的可视对象。
	     * @param {Boolean} usePolyCollision 是否使用多边形碰撞检测。默认为false。
	     */
	    hitTestObject: function(object, usePolyCollision){
	        var b1 = this.getBounds(),
	            b2 = object.getBounds(),
	            hit = b1.x <= b2.x + b2.width && b2.x <= b1.x + b1.width &&
	                  b1.y <= b2.y + b2.height && b2.y <= b1.y + b1.height;

	        if(hit && usePolyCollision){
	            hit = polygonCollision(b1, b2);
	        }
	        return !!hit;
	    },

	    /**
	     * 可视对象的基本渲染实现，用于框架内部或高级开发使用。通常应该重写render方法。
	     * @param {Renderer} renderer 渲染器。
	     * @param {Number} delta 渲染时时间偏移量。
	     * @protected
	     */
	    _render: function(renderer, delta){
	        if((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)){
	            renderer.transform(this);
	            this.render(renderer, delta);
	            renderer.endDraw(this);
	        }
	    },
	    /**
	     * 冒泡鼠标事件
	    */
	    _fireMouseEvent:function(e){
	        e.eventCurrentTarget = this;
	        this.fire(e);

	        //处理mouseover事件 mouseover不需要阻止冒泡
	        if(e.type == "mousemove"){
	            if(!this.__mouseOver){
	                this.__mouseOver = true;
	                var overEvent = Hilo.copy({}, e);
	                overEvent.type = "mouseover";
	                this.fire(overEvent);
	            }
	        }
	        else if(e.type == "mouseout"){
	            this.__mouseOver = false;
	        }

	        //向上冒泡
	        var parent = this.parent;
	        if(!e._stopped && !e._stopPropagationed && parent){
	            if(e.type == "mouseout" || e.type == "touchout"){
	                if(!parent.hitTestPoint(e.stageX, e.stageY, true)){
	                    parent._fireMouseEvent(e);
	                }
	            }
	            else{
	                parent._fireMouseEvent(e);
	            }
	        }
	    },

	    /**
	     * 更新可视对象，此方法会在可视对象渲染之前调用。此函数可以返回一个Boolean值。若返回false，则此对象不会渲染。默认值为null。
	     * 限制：如果在此函数中改变了可视对象在其父容器中的层级，当前渲染帧并不会正确渲染，而是在下一渲染帧。可在其父容器的onUpdate方法中来实现。
	     * @type Function
	     * @default null
	     */
	    onUpdate: null,

	    /**
	     * 可视对象的具体渲染逻辑。子类可通过覆盖此方法实现自己的渲染。
	     * @param {Renderer} renderer 渲染器。
	     * @param {Number} delta 渲染时时间偏移量。
	     */
	    render: function(renderer, delta){
	        renderer.draw(this);
	    },

	    /**
	     * 返回可视对象的字符串表示。
	     * @returns {String} 可视对象的字符串表示。
	     */
	    toString: function(){
	        return Hilo.viewToString(this);
	    }
	});

	/**
	 * @private
	 */
	function pointInPolygon(x, y, poly){
	    var cross = 0, onBorder = false, minX, maxX, minY, maxY;

	    for(var i = 0, len = poly.length; i < len; i++){
	        var p1 = poly[i], p2 = poly[(i+1)%len];

	        if(p1.y == p2.y && y == p1.y){
	            p1.x > p2.x ? (minX = p2.x, maxX = p1.x) : (minX = p1.x, maxX = p2.x);
	            if(x >= minX && x <= maxX){
	                onBorder = true;
	                continue;
	            }
	        }

	        p1.y > p2.y ? (minY = p2.y, maxY = p1.y) : (minY = p1.y, maxY = p2.y);
	        if(y < minY || y > maxY) continue;

	        var nx = (y - p1.y)*(p2.x - p1.x) / (p2.y - p1.y) + p1.x;
	        if(nx > x) cross++;
	        else if(nx == x) onBorder = true;

	        //当射线和多边形相交
	        if(p1.x > x && p1.y == y){
	            var p0 = poly[(len+i-1)%len];
	            //当交点的两边在射线两旁
	            if(p0.y < y && p2.y > y || p0.y > y && p2.y < y){
	                cross ++;
	            }
	        }
	    }

	    return onBorder || (cross % 2 == 1);
	}

	/**
	 * @private
	 */
	function polygonCollision(poly1, poly2){
	    var result = doSATCheck(poly1, poly2, {overlap:-Infinity, normal:{x:0, y:0}});
	    if(result) return doSATCheck(poly2, poly1, result);
	    return false;
	}

	/**
	 * @private
	 */
	function doSATCheck(poly1, poly2, result){
	    var len1 = poly1.length, len2 = poly2.length,
	        currentPoint, nextPoint, distance,
	        min1, max1, min2, max2, dot, overlap, normal = {x:0, y:0};

	    for(var i = 0; i < len1; i++){
	        currentPoint = poly1[i];
	        nextPoint = poly1[(i < len1-1 ? i+1 : 0)];

	        normal.x = currentPoint.y - nextPoint.y;
	        normal.y = nextPoint.x - currentPoint.x;

	        distance = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
	        normal.x /= distance;
	        normal.y /= distance;

	        min1 = max1 = poly1[0].x * normal.x + poly1[0].y * normal.y;
	        for(var j = 1; j < len1; j++){
	            dot = poly1[j].x * normal.x + poly1[j].y * normal.y;
	            if(dot > max1) max1 = dot;
	            else if(dot < min1) min1 = dot;
	        }

	        min2 = max2 = poly2[0].x * normal.x + poly2[0].y * normal.y;
	        for(j = 1; j < len2; j++){
	            dot = poly2[j].x * normal.x + poly2[j].y * normal.y;
	            if(dot > max2) max2 = dot;
	            else if(dot < min2) min2 = dot;
	        }

	        if(min1 < min2){
	            overlap = min2 - max1;
	            normal.x = -normal.x;
	            normal.y = -normal.y;
	        }else{
	            overlap = min1 - max2;
	        }

	        if(overlap >= 0){
	            return false;
	        }else if(overlap > result.overlap){
	            result.overlap = overlap;
	            result.normal.x = normal.x;
	            result.normal.y = normal.y;
	        }
	    }

	    return result;
	}

	})();

	module.exports = View;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class EventMixin是一个包含事件相关功能的mixin。可以通过 Class.mix(target, EventMixin) 来为target增加事件功能。
	 * @mixin
	 * @static
	 * @module hilo/event/EventMixin
	 * @requires hilo/core/Class
	 */
	var EventMixin = {
	    _listeners: null,

	    /**
	     * 增加一个事件监听。
	     * @param {String} type 要监听的事件类型。
	     * @param {Function} listener 事件监听回调函数。
	     * @param {Boolean} once 是否是一次性监听，即回调函数响应一次后即删除，不再响应。
	     * @returns {Object} 对象本身。链式调用支持。
	     */
	    on: function(type, listener, once){
	        var listeners = (this._listeners = this._listeners || {});
	        var eventListeners = (listeners[type] = listeners[type] || []);
	        for(var i = 0, len = eventListeners.length; i < len; i++){
	            var el = eventListeners[i];
	            if(el.listener === listener) return;
	        }
	        eventListeners.push({listener:listener, once:once});
	        return this;
	    },

	    /**
	     * 删除一个事件监听。如果不传入任何参数，则删除所有的事件监听；如果不传入第二个参数，则删除指定类型的所有事件监听。
	     * @param {String} type 要删除监听的事件类型。
	     * @param {Function} listener 要删除监听的回调函数。
	     * @returns {Object} 对象本身。链式调用支持。
	     */
	    off: function(type, listener){
	        //remove all event listeners
	        if(arguments.length == 0){
	            this._listeners = null;
	            return this;
	        }

	        var eventListeners = this._listeners && this._listeners[type];
	        if(eventListeners){
	            //remove event listeners by specified type
	            if(arguments.length == 1){
	                delete this._listeners[type];
	                return this;
	            }

	            for(var i = 0, len = eventListeners.length; i < len; i++){
	                var el = eventListeners[i];
	                if(el.listener === listener){
	                    eventListeners.splice(i, 1);
	                    if(eventListeners.length === 0) delete this._listeners[type];
	                    break;
	                }
	            }
	        }
	        return this;
	    },

	    /**
	     * 发送事件。当第一个参数类型为Object时，则把它作为一个整体事件对象。
	     * @param {String} type 要发送的事件类型。
	     * @param {Object} detail 要发送的事件的具体信息，即事件随带参数。
	     * @returns {Boolean} 是否成功调度事件。
	     */
	    fire: function(type, detail){
	        var event, eventType;
	        if(typeof type === 'string'){
	            eventType = type;
	        }else{
	            event = type;
	            eventType = type.type;
	        }

	        var listeners = this._listeners;
	        if(!listeners) return false;

	        var eventListeners = listeners[eventType];
	        if(eventListeners){
	            eventListeners = eventListeners.slice(0);
	            event = event || new EventObject(eventType, this, detail);
	            if(event._stopped) return false;

	            for(var i = 0; i < eventListeners.length; i++){
	                var el = eventListeners[i];
	                el.listener.call(this, event);
	                if(el.once) eventListeners.splice(i--, 1);
	            }

	            if(eventListeners.length == 0) delete listeners[eventType];
	            return true;
	        }
	        return false;
	    }
	};

	/**
	 * 事件对象类。当前仅为内部类，以后有需求的话可能会考虑独立为公开类。
	 */
	var EventObject = Class.create({
	    constructor: function EventObject(type, target, detail){
	        this.type = type;
	        this.target = target;
	        this.detail = detail;
	        this.timeStamp = +new Date();
	    },

	    type: null,
	    target: null,
	    detail: null,
	    timeStamp: 0,

	    stopImmediatePropagation: function(){
	        this._stopped = true;
	    }
	});

	//Trick: `stopImmediatePropagation` compatibility
	var RawEvent = window.Event;
	if(RawEvent){
	    var proto = RawEvent.prototype,
	        stop = proto.stopImmediatePropagation;
	    proto.stopImmediatePropagation = function(){
	        stop && stop.call(this);
	        this._stopped = true;
	    }
	}


	module.exports = EventMixin;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class Matrix类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
	 * @param {Number} a 缩放或旋转图像时影响像素沿 x 轴定位的值。
	 * @param {Number} b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
	 * @param {Number} c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
	 * @param {Number} d 缩放或旋转图像时影响像素沿 y 轴定位的值。
	 * @param {Number} tx 沿 x 轴平移每个点的距离。
	 * @param {Number} ty 沿 y 轴平移每个点的距离。
	 * @module hilo/geom/Matrix
	 * @requires hilo/core/Class
	 */
	var Matrix = Class.create(/** @lends Matrix.prototype */{
	    constructor: function(a, b, c, d, tx, ty){
	        this.a = a;
	        this.b = b;
	        this.c = c;
	        this.d = d;
	        this.tx = tx;
	        this.ty = ty;
	    },

	    /**
	     * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
	     * @param {Matrix} mtx 要连接到源矩阵的矩阵。
	     * @returns {Matrix} 一个Matrix对象。
	     */
	    concat: function(mtx){
	        var args = arguments,
	            a = this.a, b = this.b, c = this.c, d = this.d,
	            tx = this.tx, ty = this.ty;

	        if(args.length >= 6){
	            var ma = args[0], mb = args[1], mc = args[2],
	                md = args[3], mx = args[4], my = args[5];
	        }else{
	            ma = mtx.a;
	            mb = mtx.b;
	            mc = mtx.c;
	            md = mtx.d;
	            mx = mtx.tx;
	            my = mtx.ty;
	        }

	        this.a = a * ma + b * mc;
	        this.b = a * mb + b * md;
	        this.c = c * ma + d * mc;
	        this.d = c * mb + d * md;
	        this.tx = tx * ma + ty * mc + mx;
	        this.ty = tx * mb + ty * md + my;
	        return this;
	    },

	    /**
	     * 对 Matrix 对象应用旋转转换。
	     * @param {Number} angle 旋转的角度。
	     * @returns {Matrix} 一个Matrix对象。
	     */
	    rotate: function(angle){
	        var sin = Math.sin(angle), cos = Math.cos(angle),
	            a = this.a, b = this.b, c = this.c, d = this.d,
	            tx = this.tx, ty = this.ty;

	        this.a = a * cos - b * sin;
	        this.b = a * sin + b * cos;
	        this.c = c * cos - d * sin;
	        this.d = c * sin + d * cos;
	        this.tx = tx * cos - ty * sin;
	        this.ty = tx * sin + ty * cos;
	        return this;
	    },

	    /**
	     * 对矩阵应用缩放转换。
	     * @param {Number} sx 用于沿 x 轴缩放对象的乘数。
	     * @param {Number} sy 用于沿 y 轴缩放对象的乘数。
	     * @returns {Matrix} 一个Matrix对象。
	     */
	    scale: function(sx, sy){
	        this.a *= sx;
	        this.d *= sy;
	        this.c *= sx;
	        this.b *= sy;
	        this.tx *= sx;
	        this.ty *= sy;
	        return this;
	    },

	    /**
	     * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
	     * @param {Number} dx 沿 x 轴向右移动的量（以像素为单位）。
	     * @param {Number} dy 沿 y 轴向右移动的量（以像素为单位）。
	     * @returns {Matrix} 一个Matrix对象。
	     */
	    translate: function(dx, dy){
	        this.tx += dx;
	        this.ty += dy;
	        return this;
	    },

	    /**
	     * 为每个矩阵属性设置一个值，该值将导致 null 转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。
	     * @returns {Matrix} 一个Matrix对象。
	     */
	    identity: function(){
	        this.a = this.d = 1;
	        this.b = this.c = this.tx = this.ty = 0;
	        return this;
	    },

	    /**
	     * 执行原始矩阵的逆转换。您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
	     * @returns {Matrix} 一个Matrix对象。
	     */
	    invert: function(){
	        var a = this.a;
	        var b = this.b;
	        var c = this.c;
	        var d = this.d;
	        var tx = this.tx;
	        var i = a * d - b * c;

	        this.a = d / i;
	        this.b = -b / i;
	        this.c = -c / i;
	        this.d = a / i;
	        this.tx = (c * this.ty - d * tx) / i;
	        this.ty = -(a * this.ty - b * tx) / i;
	        return this;
	    },

	    /**
	     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
	     * @param {Object} point 想要获得其矩阵转换结果的点。
	     * @param {Boolean} round 是否对点的坐标进行向上取整。
	     * @param {Boolean} returnNew 是否返回一个新的点。
	     * @returns {Object} 由应用矩阵转换所产生的点。
	     */
	    transformPoint: function(point, round, returnNew){
	        var x = point.x * this.a + point.y * this.c + this.tx,
	            y = point.x * this.b + point.y * this.d + this.ty;

	        if(round){
	            x = x + 0.5 >> 0;
	            y = y + 0.5 >> 0;
	        }
	        if(returnNew) return {x:x, y:y};
	        point.x = x;
	        point.y = y;
	        return point;
	    }

	});

	module.exports = Matrix;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);
	var Hilo = __webpack_require__(3);
	var Renderer = __webpack_require__(10);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class canvas画布渲染器。所有可视对象将渲染在canvas画布上。舞台Stage会根据参数canvas选择不同的渲染器，开发者无需直接使用此类。
	 * @augments Renderer
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/renderer/CanvasRenderer
	 * @requires hilo/core/Class
	 * @requires hilo/core/Hilo
	 * @requires hilo/renderer/Renderer
	 * @property {CanvasRenderingContext2D} context canvas画布的上下文。只读属性。
	 */
	var CanvasRenderer = Class.create(/** @lends CanvasRenderer.prototype */{
	    Extends: Renderer,
	    constructor: function(properties){
	        CanvasRenderer.superclass.constructor.call(this, properties);

	        this.context = this.canvas.getContext("2d");
	    },
	    renderType:'canvas',
	    context: null,

	    /**
	     * @private
	     * @see Renderer#startDraw
	     */
	    startDraw: function(target){
	        if(target.visible && target.alpha > 0){
	            if(target === this.stage){
	                this.context.clearRect(0, 0, target.width, target.height);
	            }
	            this.context.save();
	            return true;
	        }
	        return false;
	    },

	    /**
	     * @private
	     * @see Renderer#draw
	     */
	    draw: function(target){
	        var ctx = this.context, w = target.width, h = target.height;

	        //draw background
	        var bg = target.background;
	        if(bg){
	            ctx.fillStyle = bg;
	            ctx.fillRect(0, 0, w, h);
	        }

	        //draw image
	        var drawable = target.drawable, image = drawable && drawable.image;
	        if(image){
	            var rect = drawable.rect, sw = rect[2], sh = rect[3], offsetX = rect[4], offsetY = rect[5];
	            //ie9+浏览器宽高为0时会报错
	            if(!sw || !sh){
	                return;
	            }
	            if(!w && !h){
	                //fix width/height TODO: how to get rid of this?
	                w = target.width = sw;
	                h = target.height = sh;
	            }
	            //the pivot is the center of frame if has offset, otherwise is (0, 0)
	            if(offsetX || offsetY) ctx.translate(offsetX - sw * 0.5, offsetY - sh * 0.5);
	            ctx.drawImage(image, rect[0], rect[1], sw, sh, 0, 0, w, h);
	        }
	    },

	    /**
	     * @private
	     * @see Renderer#endDraw
	     */
	    endDraw: function(target){
	        this.context.restore();
	    },

	    /**
	     * @private
	     * @see Renderer#transform
	     */
	    transform: function(target){
	        var drawable = target.drawable;
	        if(drawable && drawable.domElement){
	            Hilo.setElementStyleByView(target);
	            return;
	        }

	        var ctx = this.context,
	            scaleX = target.scaleX,
	            scaleY = target.scaleY;

	        if(target === this.stage){
	            var style = this.canvas.style,
	                oldScaleX = target._scaleX,
	                oldScaleY = target._scaleY;

	            if((!oldScaleX && scaleX != 1) || (oldScaleX && oldScaleX != scaleX)){
	                target._scaleX = scaleX;
	                style.width = scaleX * target.width + "px";
	            }
	            if((!oldScaleY && scaleY != 1) || (oldScaleY && oldScaleY != scaleY)){
	                target._scaleY = scaleY;
	                style.height = scaleY * target.height + "px";
	            }
	        }else{
	            var x = target.x,
	                y = target.y,
	                pivotX = target.pivotX,
	                pivotY = target.pivotY,
	                rotation = target.rotation % 360,
	                mask = target.mask;

	            if(mask){
	                mask._render(this);
	                ctx.clip();
	            }

	            //alignment
	            var align = target.align;
	            if(align){
	                if(typeof align === 'function'){
	                    target.align();
	                }else{
	                    var parent = target.parent;
	                    if(parent){
	                        var w = target.width, h = target.height,
	                            pw = parent.width, ph = parent.height;
	                        switch(align){
	                            case 'TL':
	                                x = 0;
	                                y = 0;
	                                break;
	                            case 'T':
	                                x = pw - w >> 1;
	                                y = 0;
	                                break;
	                            case 'TR':
	                                x = pw - w;
	                                y = 0;
	                                break;
	                            case 'L':
	                                x = 0;
	                                y = ph - h >> 1;
	                                break;
	                            case 'C':
	                                x = pw - w >> 1;
	                                y = ph - h >> 1;
	                                break;
	                            case 'R':
	                                x = pw - w;
	                                y = ph - h >> 1;
	                                break;
	                            case 'BL':
	                                x = 0;
	                                y = ph - h;
	                                break;
	                            case 'B':
	                                x = pw - w >> 1;
	                                y = ph - h;
	                                break;
	                            case 'BR':
	                                x = pw - w;
	                                y = ph - h;
	                                break;
	                        }
	                    }
	                }
	            }

	            if(x != 0 || y != 0) ctx.translate(x, y);
	            if(rotation != 0) ctx.rotate(rotation * Math.PI / 180);
	            if(scaleX != 1 || scaleY != 1) ctx.scale(scaleX, scaleY);
	            if(pivotX != 0 || pivotY != 0) ctx.translate(-pivotX, -pivotY);
	        }

	        if(target.alpha > 0) ctx.globalAlpha *= target.alpha;
	    },

	    /**
	     * @private
	     * @see Renderer#remove
	     */
	    remove: function(target){
	        var drawable = target.drawable;
	        var elem = drawable && drawable.domElement;

	        if(elem){
	            var parentElem = elem.parentNode;
	            if(parentElem){
	                parentElem.removeChild(elem);
	            }
	        }
	    },

	    /**
	     * @private
	     * @see Renderer#clear
	     */
	    clear: function(x, y, width, height){
	        this.context.clearRect(x, y, width, height);
	    },

	    /**
	     * @private
	     * @see Renderer#resize
	     */
	    resize: function(width, height){
	        this.canvas.width = width;
	        this.canvas.height = height;
	    }

	});

	module.exports = CanvasRenderer;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Hilo = __webpack_require__(3);
	var Class = __webpack_require__(4);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class 渲染器抽象基类。
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/renderer/Renderer
	 * @requires hilo/core/Hilo
	 * @requires hilo/core/Class
	 * @property {Object} canvas 渲染器对应的画布。它可能是一个普通的DOM元素，比如div，也可以是一个canvas画布元素。只读属性。
	 * @property {Object} stage 渲染器对应的舞台。只读属性。
	 * @property {String} renderType 渲染方式。只读属性。
	 */
	var Renderer = Class.create(/** @lends Renderer.prototype */{
	    constructor: function(properties){
	        properties = properties || {};
	        Hilo.copy(this, properties, true);
	    },

	    renderType:null,
	    canvas: null,
	    stage: null,

	    /**
	     * 为开始绘制可视对象做准备。需要子类来实现。
	     * @param {View} target 要绘制的可视对象。
	     */
	    startDraw: function(target){ },

	    /**
	     * 绘制可视对象。需要子类来实现。
	     * @param {View} target 要绘制的可视对象。
	     */
	    draw: function(target){ },

	    /**
	     * 结束绘制可视对象后的后续处理方法。需要子类来实现。
	     * @param {View} target 要绘制的可视对象。
	     */
	    endDraw: function(target){ },

	    /**
	     * 对可视对象进行变换。需要子类来实现。
	     */
	    transform: function(){ },

	    /**
	     * 隐藏可视对象。需要子类来实现。
	     */
	    hide: function(){ },

	    /**
	     * 从画布中删除可视对象。注意：不是从stage中删除对象。需要子类来实现。
	     * @param {View} target 要删除的可视对象。
	     */
	    remove: function(target){ },

	    /**
	     * 清除画布指定区域。需要子类来实现。
	     * @param {Number} x 指定区域的x轴坐标。
	     * @param {Number} y 指定区域的y轴坐标。
	     * @param {Number} width 指定区域的宽度。
	     * @param {Number} height 指定区域的高度。
	     */
	    clear: function(x, y, width, height){ },

	    /**
	     * 改变渲染器的画布大小。
	     * @param {Number} width 指定渲染画布新的宽度。
	     * @param {Number} height 指定渲染画布新的高度。
	     */
	    resize: function(width, height){ }

	});

	module.exports = Renderer;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);
	var Hilo = __webpack_require__(3);
	var Renderer = __webpack_require__(10);
	var Drawable = __webpack_require__(12);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class DOM+CSS3渲染器。将可视对象以DOM元素方式渲染出来。舞台Stage会根据参数canvas选择不同的渲染器，开发者无需直接使用此类。
	 * @augments Renderer
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/renderer/DOMRenderer
	 * @requires hilo/core/Class
	 * @requires hilo/core/Hilo
	 * @requires hilo/renderer/Renderer
	 * @requires hilo/view/Drawable
	 */
	var DOMRenderer = (function(){

	return Class.create({
	    Extends: Renderer,
	    constructor: function(properties){
	        DOMRenderer.superclass.constructor.call(this, properties);
	    },
	    renderType:'dom',
	    /**
	     * @private
	     * @see Renderer#startDraw
	     */
	    startDraw: function(target){
	        //prepare drawable
	        var drawable = (target.drawable = target.drawable || new Drawable());
	        drawable.domElement = drawable.domElement || createDOMDrawable(target, drawable);
	        return true;
	    },

	    /**
	     * @private
	     * @see Renderer#draw
	     */
	    draw: function(target){
	        var parent = target.parent,
	            targetElem = target.drawable.domElement,
	            currentParent = targetElem.parentNode;

	        if(parent){
	            var parentElem = parent.drawable.domElement;
	            if(parentElem != currentParent){
	                parentElem.appendChild(targetElem);
	            }
	            //fix image load bug
	            if(!target.width && !target.height){
	                var rect = target.drawable.rect;
	                if(rect && (rect[2] || rect[3])){
	                    target.width = rect[2];
	                    target.height = rect[3];
	                }
	            }
	        }
	        else if(target === this.stage && !currentParent){
	            targetElem.style.overflow = 'hidden';
	            this.canvas.appendChild(targetElem);
	        }
	    },

	    /**
	     * @private
	     * @see Renderer#transform
	     */
	    transform: function(target){
	        Hilo.setElementStyleByView(target);
	        if(target === this.stage){
	            var style = this.canvas.style,
	                oldScaleX = target._scaleX,
	                oldScaleY = target._scaleY,
	                scaleX = target.scaleX,
	                scaleY = target.scaleY;

	            if((!oldScaleX && scaleX != 1) || (oldScaleX && oldScaleX != scaleX)){
	                target._scaleX = scaleX;
	                style.width = scaleX * target.width + "px";
	            }
	            if((!oldScaleY && scaleY != 1) || (oldScaleY && oldScaleY != scaleY)){
	                target._scaleY = scaleY;
	                style.height = scaleY * target.height + "px";
	            }
	        }
	    },

	    /**
	     * @private
	     * @see Renderer#remove
	     */
	    remove: function(target){
	        var drawable = target.drawable;
	        var elem = drawable && drawable.domElement;

	        if(elem){
	            var parentElem = elem.parentNode;
	            if(parentElem){
	                parentElem.removeChild(elem);
	            }
	        }
	    },

	    /**
	     * @private
	     * @see Renderer#hide
	     */
	    hide: function(target){
	        var elem = target.drawable && target.drawable.domElement;
	        if(elem) elem.style.display = 'none';
	    },

	    /**
	     * @private
	     * @see Renderer#resize
	     */
	    resize: function(width, height){
	        var style = this.canvas.style;
	        style.width = width + 'px';
	        style.height = height + 'px';
	        if(style.position != "absolute") {
	          style.position = "relative";
	        }
	    }
	});

	/**
	 * 创建一个可渲染的DOM，可指定tagName，如canvas或div。
	 * @param {Object} view 一个可视对象或类似的对象。
	 * @param {Object} imageObj 指定渲染的image及相关设置，如绘制区域rect。
	 * @return {HTMLElement} 新创建的DOM对象。
	 * @private
	 */
	function createDOMDrawable(view, imageObj){
	    var tag = view.tagName || "div",
	        img = imageObj.image,
	        w = view.width || (img && img.width),
	        h =  view.height || (img && img.height),
	        elem = Hilo.createElement(tag), style = elem.style;

	    if(view.id) elem.id = view.id;
	    style.position = "absolute";
	    style.left = (view.left || 0) + "px";
	    style.top = (view.top || 0) + "px";
	    style.width = w + "px";
	    style.height = h + "px";

	    if(tag == "canvas"){
	        elem.width = w;
	        elem.height = h;
	        if(img){
	            var ctx = elem.getContext("2d");
	            var rect = imageObj.rect || [0, 0, w, h];
	            ctx.drawImage(img, rect[0], rect[1], rect[2], rect[3],
	                         (view.x || 0), (view.y || 0),
	                         (view.width || rect[2]),
	                         (view.height || rect[3]));
	        }
	    }else{
	        style.opacity = view.alpha != undefined ? view.alpha : 1;
	        if(view === this.stage || view.clipChildren) style.overflow = "hidden";
	        if(img && img.src){
	            style.backgroundImage = "url(" + img.src + ")";
	            var bgX = view.rectX || 0, bgY = view.rectY || 0;
	            style.backgroundPosition = (-bgX) + "px " + (-bgY) + "px";
	        }
	    }
	    return elem;
	}

	})();


	module.exports = DOMRenderer;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Hilo = __webpack_require__(3);
	var Class = __webpack_require__(4);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class Drawable是可绘制图像的包装。
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/view/Drawable
	 * @requires hilo/core/Hilo
	 * @requires hilo/core/Class
	 * @property {Object} image 要绘制的图像。即可被CanvasRenderingContext2D.drawImage使用的对象类型，可以是HTMLImageElement、HTMLCanvasElement、HTMLVideoElement等对象。
	 * @property {array} rect 要绘制的图像的矩形区域。
	 */
	var Drawable = Class.create(/** @lends Drawable.prototype */{
	    constructor: function(properties){
	        this.init(properties);
	    },

	    image: null,
	    rect: null,

	    /**
	     * 初始化可绘制对象。
	     * @param {Object} properties 要初始化的属性。
	     */
	    init: function(properties){
	        var me = this, oldImage = me.image;
	        if(Drawable.isDrawable(properties)){
	            me.image = properties;
	        }else{
	            Hilo.copy(me, properties, true);
	        }

	        var image = me.image;
	        if(typeof image === 'string'){
	            if(oldImage && image === oldImage.getAttribute('src')){
	                image = me.image = oldImage;
	            }else{
	                me.image = null;
	                //load image dynamically
	                var img = new Image();
	                img.onload = function(){
	                    img.onload = null;
	                    me.init(img);
	                };
	                img.src = image;
	                return;
	            }
	        }

	        if(image && !me.rect) me.rect = [0, 0, image.width, image.height];
	    },

	    Statics: /** @lends Drawable */{
	        /**
	         * 判断参数elem指定的元素是否可包装成Drawable对象。
	         * @param {Object} elem 要测试的对象。
	         * @return {Boolean} 如果是可包装成Drawable对象则返回true，否则为false。
	         */
	        isDrawable: function(elem){
	            if(!elem || !elem.tagName) return false;
	            var tagName = elem.tagName.toLowerCase();
	            return tagName === "img" || tagName === "canvas" || tagName === "video";
	        }
	    }
	});

	module.exports = Drawable;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);
	var Renderer = __webpack_require__(10);
	var Matrix = __webpack_require__(8);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * Heavily inspired by PIXI's SpriteRenderer:
	 * https://github.com/pixijs/pixi.js/blob/v3.0.9/src/core/sprites/webgl/SpriteRenderer.js
	 */

	var DEG2RAD = Math.PI / 180;
	/**
	 * @class webgl画布渲染器。所有可视对象将渲染在canvas画布上。
	 * @augments Renderer
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/renderer/WebGLRenderer
	 * @requires hilo/core/Class
	 * @requires hilo/renderer/Renderer
	 * @requires  hilo/geom/Matrix
	 * @property {WebGLRenderingContext} gl webgl上下文。只读属性。
	 */
	var WebGLRenderer = Class.create(/** @lends WebGLRenderer.prototype */{
	    Extends: Renderer,
	    Statics:/** @lends WebGLRenderer */{
	        /**
	         * 最大批渲染数量。
	         * @type {Number}
	         */
	        MAX_BATCH_NUM:2000,
	        /**
	         * 顶点属性数。只读属性。
	         * @type {Number}
	         */
	        ATTRIBUTE_NUM:5,
	        /**
	         * 是否支持WebGL。只读属性。
	         * @type {Boolean}
	         */
	        isSupport:null
	    },
	    renderType:'webgl',
	    gl:null,
	    constructor: function(properties){
	        window.__render = this;
	        WebGLRenderer.superclass.constructor.call(this, properties);
	        var gl = this.gl = this.canvas.getContext("webgl")||this.canvas.getContext('experimental-webgl');

	        this.maxBatchNum = WebGLRenderer.MAX_BATCH_NUM;
	        this.positionStride = WebGLRenderer.ATTRIBUTE_NUM * 4;
	        var vertexNum = this.maxBatchNum * WebGLRenderer.ATTRIBUTE_NUM * 4;
	        var indexNum = this.maxBatchNum * 6;
	        this.positions = new Float32Array(vertexNum);
	        this.indexs = new Uint16Array(indexNum);
	        for (var i=0, j=0; i < indexNum; i += 6, j += 4)
	        {
	            this.indexs[i + 0] = j + 0;
	            this.indexs[i + 1] = j + 1;
	            this.indexs[i + 2] = j + 2;
	            this.indexs[i + 3] = j + 1;
	            this.indexs[i + 4] = j + 2;
	            this.indexs[i + 5] = j + 3;
	        }
	        this.batchIndex = 0;
	        this.sprites = [];

	        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	        gl.clearColor(0, 0, 0, 0);
	        gl.disable(gl.DEPTH_TEST);
	        gl.disable(gl.CULL_FACE);
	        gl.enable(gl.BLEND);

	        this._initShaders();
	        this.defaultShader.active();

	        this.positionBuffer = gl.createBuffer();
	        this.indexBuffer = gl.createBuffer();

	        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexs, gl.STATIC_DRAW);

	        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);

	        gl.vertexAttribPointer(this.a_position, 2, gl.FLOAT, false, this.positionStride, 0);//x, y
	        gl.vertexAttribPointer(this.a_TexCoord, 2, gl.FLOAT, false, this.positionStride, 2 * 4);//x, y
	        gl.vertexAttribPointer(this.a_alpha, 1, gl.FLOAT, false, this.positionStride, 4 * 4);//alpha
	    },

	    context: null,

	    /**
	     * @private
	     * @see Renderer#startDraw
	     */
	    startDraw: function(target){
	        if(target.visible && target.alpha > 0){
	            if(target === this.stage){
	                this.clear();
	            }
	            return true;
	        }
	        return false;
	    },

	    /**
	     * @private
	     * @see Renderer#draw
	     */
	    draw: function(target){
	        var ctx = this.context, w = target.width, h = target.height;

	        //TODO:draw background
	        var bg = target.background;

	        //draw image
	        var drawable = target.drawable, image = drawable && drawable.image;
	        if(image){
	            var gl = this.gl;
	            if(!image.texture){
	                this.activeShader.uploadTexture(image);
	            }

	            var rect = drawable.rect, sw = rect[2], sh = rect[3], offsetX = rect[4], offsetY = rect[5];
	            if(!w && !h){
	                //fix width/height TODO: how to get rid of this?
	                w = target.width = sw;
	                h = target.height = sh;
	            }

	            if(this.batchIndex >= this.maxBatchNum){
	                this._renderBatches();
	            }

	            var vertexs = this._createVertexs(image, rect[0], rect[1], sw, sh, -target.pivotX, -target.pivotY, w, h);
	            var index = this.batchIndex * this.positionStride;
	            var positions = this.positions;
	            var alpha = target.__webglRenderAlpha;
	            positions[index + 0] = vertexs[0];//x
	            positions[index + 1] = vertexs[1];//y
	            positions[index + 2] = vertexs[2];//uvx
	            positions[index + 3] = vertexs[3];//uvy
	            positions[index + 4] = alpha;//alpha

	            positions[index + 5] = vertexs[4];
	            positions[index + 6] = vertexs[5];
	            positions[index + 7] = vertexs[6];
	            positions[index + 8] = vertexs[7];
	            positions[index + 9] = alpha;

	            positions[index + 10] = vertexs[8]
	            positions[index + 11] = vertexs[9]
	            positions[index + 12] = vertexs[10]
	            positions[index + 13] = vertexs[11]
	            positions[index + 14] = alpha;

	            positions[index + 15] = vertexs[12]
	            positions[index + 16] = vertexs[13]
	            positions[index + 17] = vertexs[14]
	            positions[index + 18] = vertexs[15]
	            positions[index + 19] = alpha;

	            var matrix = target.__webglWorldMatrix;
	            for(var i = 0;i < 4;i ++){
	                var x = positions[index + i*5];
	                var y = positions[index + i*5 + 1];

	                positions[index + i*5] = matrix.a*x+matrix.c*y + matrix.tx;
	                positions[index + i*5 + 1] = matrix.b*x+matrix.d*y + matrix.ty;
	            }

	            target.texture = image.texture;
	            this.sprites[this.batchIndex++] = target;
	        }
	    },

	    /**
	     * @private
	     * @see Renderer#endDraw
	     */
	    endDraw: function(target){
	        if(target === this.stage){
	            this._renderBatches();
	        }
	    },
	    /**
	     * @private
	     * @see Renderer#transform
	     */
	    transform: function(target){
	        var drawable = target.drawable;
	        if(drawable && drawable.domElement){
	            Hilo.setElementStyleByView(target);
	            return;
	        }

	        var ctx = this.context,
	            scaleX = target.scaleX,
	            scaleY = target.scaleY;

	        if(target === this.stage){
	            var style = this.canvas.style,
	                oldScaleX = target._scaleX,
	                oldScaleY = target._scaleY;

	            if((!oldScaleX && scaleX != 1) || (oldScaleX && oldScaleX != scaleX)){
	                target._scaleX = scaleX;
	                style.width = scaleX * target.width + "px";
	            }
	            if((!oldScaleY && scaleY != 1) || (oldScaleY && oldScaleY != scaleY)){
	                target._scaleY = scaleY;
	                style.height = scaleY * target.height + "px";
	            }
	            target.__webglWorldMatrix = target.__webglWorldMatrix||new Matrix(1, 0, 0, 1, 0, 0);
	        }else{
	            target.__webglWorldMatrix = target.__webglWorldMatrix||new Matrix(1, 0, 0, 1, 0, 0);
	            this._setConcatenatedMatrix(target, target.parent);
	        }

	        if(target.alpha > 0) {
	            if(target.parent && target.parent.__webglRenderAlpha){
	                target.__webglRenderAlpha = target.alpha * target.parent.__webglRenderAlpha;
	            }
	            else{
	                target.__webglRenderAlpha = target.alpha;
	            }
	        }
	    },

	    /**
	     * @private
	     * @see Renderer#remove
	     */
	    remove: function(target){
	        var drawable = target.drawable;
	        var elem = drawable && drawable.domElement;

	        if(elem){
	            var parentElem = elem.parentNode;
	            if(parentElem){
	                parentElem.removeChild(elem);
	            }
	        }
	    },

	    /**
	     * @private
	     * @see Renderer#clear
	     */
	    clear: function(x, y, width, height){
	        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	    },

	    /**
	     * @private
	     * @see Renderer#resize
	     */
	    resize: function(width, height){
	        if(this.width !== width || this.height !== height){
	            this.width = this.canvas.width = width;
	            this.height = this.canvas.height = height;
	            this.gl.viewport(0, 0, width, height);

	            this.canvasHalfWidth = width * .5;
	            this.canvasHalfHeight = height * .5;

	            this._uploadProjectionTransform(true);
	        }
	    },
	    _renderBatches:function(){
	        var gl = this.gl;
	        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positions.subarray(0, this.batchIndex * this.positionStride));
	        var startIndex = 0;
	        var batchNum = 0;
	        var preTexture = null;
	        for(var i = 0;i < this.batchIndex;i ++){
	            var sprite = this.sprites[i];
	            if(preTexture && preTexture !== sprite.texture){
	                this._renderBatch(startIndex, i);
	                startIndex = i;
	                batchNum = 1;
	            }
	            preTexture = sprite.texture;
	        }
	        this._renderBatch(startIndex, this.batchIndex);
	        this.batchIndex = 0;
	    },
	    _renderBatch:function(start, end){
	        var gl = this.gl;
	        var num = end - start;
	        if(num > 0){
	            gl.bindTexture(gl.TEXTURE_2D, this.sprites[start].texture);
	            gl.drawElements(gl.TRIANGLES, num * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
	        }
	    },
	    _uploadProjectionTransform:function(force){
	        if(!this._projectionTransformElements||force){
	            this._projectionTransformElements = new Float32Array([
	                1/this.canvasHalfWidth, 0, 0,
	                0, 1/this.canvasHalfHeight, 0,
	                -1, 1, 1,
	            ]);
	        }

	        this.gl.uniformMatrix3fv(this.u_projectionTransform, false, this._projectionTransformElements);
	    },
	    _initShaders:function(){
	        var VSHADER_SOURCE ='\
	            attribute vec2 a_position;\n\
	            attribute vec2 a_TexCoord;\n\
	            attribute float a_alpha;\n\
	            uniform mat3 u_projectionTransform;\n\
	            varying vec2 v_TexCoord;\n\
	            varying float v_alpha;\n\
	            void main(){\n\
	                gl_Position =  vec4((u_projectionTransform * vec3(a_position, 1.0)).xy, 1.0, 1.0);\n\
	                v_TexCoord = a_TexCoord;\n\
	                v_alpha = a_alpha;\n\
	            }\n\
	        ';

	        var FSHADER_SOURCE = '\n\
	            precision mediump float;\n\
	            uniform sampler2D u_Sampler;\n\
	            varying vec2 v_TexCoord;\n\
	            varying float v_alpha;\n\
	            void main(){\n\
	                gl_FragColor = texture2D(u_Sampler, v_TexCoord) * v_alpha;\n\
	            }\n\
	        ';

	        this.defaultShader = new Shader(this, {
	            v:VSHADER_SOURCE,
	            f:FSHADER_SOURCE
	        },{
	            attributes:["a_position", "a_TexCoord", "a_alpha"],
	            uniforms:["u_projectionTransform", "u_Alpha", "u_Sampler"]
	        });
	    },
	    _createVertexs:function(img, tx, ty, tw, th, x, y, w, h){
	        var tempVertexs = this.__tempVertexs||[];
	        var width = img.width;
	        var height = img.height;

	        tw = tw/width;
	        th = th/height;
	        tx = tx/width;
	        ty = ty/height;

	        w = w;
	        h = h;
	        x = x;
	        y = y;

	        if(tw + tx > 1){
	            tw = 1 - tx;
	        }

	        if(th + ty > 1){
	            th = 1 - ty;
	        }

	        ty = 1 - ty - th;

	        y = -h - y;

	        var index = 0;
	        tempVertexs[index++] = x; tempVertexs[index++] = y; tempVertexs[index++] = tx; tempVertexs[index++] = ty;
	        tempVertexs[index++] = x+w;tempVertexs[index++] = y; tempVertexs[index++] = tx+tw; tempVertexs[index++] = ty;
	        tempVertexs[index++] = x; tempVertexs[index++] = y+h; tempVertexs[index++] = tx;tempVertexs[index++] = ty+th;
	        tempVertexs[index++] = x+w;tempVertexs[index++] = y+h;tempVertexs[index++] = tx+tw;tempVertexs[index++] = ty+th;

	        return tempVertexs;
	    },
	    _setConcatenatedMatrix:function(view, ancestor){
	        var mtx = view.__webglWorldMatrix;
	        var cos = 1, sin = 0,
	            rotation = 360-view.rotation % 360,
	            pivotX = view.pivotX, pivotY = view.pivotY,
	            scaleX = view.scaleX, scaleY = view.scaleY;

	        if(rotation){
	            var r = rotation * DEG2RAD;
	            cos = Math.cos(r);
	            sin = Math.sin(r);
	        }

	        mtx.a = cos*scaleX;
	        mtx.b = sin*scaleX;
	        mtx.c = -sin*scaleY;
	        mtx.d = cos*scaleY;
	        mtx.tx = view.x;
	        mtx.ty = -view.y;

	        var aMtx = ancestor.__webglWorldMatrix;
	        mtx.concat(aMtx.a, aMtx.b, aMtx.c, aMtx.d, aMtx.tx, aMtx.ty);
	    }
	});

	/**
	 * shader
	 * @param {WebGLRenderer} renderer [description]
	 * @param {Object} source
	 * @param {String} source.v 顶点shader
	 * @param {String} source.f 片段shader
	 * @param {Object} attr
	 * @param {Array} attr.attributes attribute数组
	 * @param {Array} attr.uniforms uniform数组
	 */
	var _cacheTexture = {};
	var Shader = function(renderer, source, attr){
	    this.renderer = renderer;
	    this.gl = renderer.gl;
	    this.program = this._createProgram(this.gl, source.v, source.f);

	    attr = attr||{};
	    this.attributes = attr.attributes||[];
	    this.uniforms = attr.uniforms||[];
	}

	Shader.prototype = {
	    active:function(){
	        var that = this;
	        var renderer = that.renderer;
	        var gl = that.gl;
	        var program = that.program;

	        if(program && gl){
	            renderer.activeShader = that;
	            gl.useProgram(program);
	            that.attributes.forEach(function(attribute){
	                renderer[attribute] = gl.getAttribLocation(program, attribute);
	                gl.enableVertexAttribArray(renderer[attribute]);
	            });

	            that.uniforms.forEach(function(uniform){
	                renderer[uniform] = gl.getUniformLocation(program, uniform);
	            });

	            if(that.width !== renderer.width || that.height !== renderer.height){
	                that.width = renderer.width;
	                that.height = renderer.height;
	                renderer._uploadProjectionTransform();
	            }
	        }
	    },
	    uploadTexture:function(image){
	        var gl = this.gl;
	        var renderer = this.renderer;
	        if(_cacheTexture[image.src]){
	            image.texture = _cacheTexture[image.src];
	        }
	        else{
	            var texture = gl.createTexture();
	            var u_Sampler = renderer.u_Sampler;


	            gl.activeTexture(gl.TEXTURE0);
	            gl.bindTexture(gl.TEXTURE_2D, texture);

	            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
	            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	            gl.uniform1i(u_Sampler, 0);
	            gl.bindTexture(gl.TEXTURE_2D, null);

	            image.texture = texture;
	            _cacheTexture[image.src] = texture;
	        }
	    },
	    _createProgram:function(gl, vshader, fshader){
	        var vertexShader = this._createShader(gl, gl.VERTEX_SHADER, vshader);
	        var fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, fshader);
	        if (!vertexShader || !fragmentShader) {
	            return null;
	        }

	        var program = gl.createProgram();
	        if (program) {
	            gl.attachShader(program, vertexShader);
	            gl.attachShader(program, fragmentShader);

	            gl.linkProgram(program);

	            gl.deleteShader(fragmentShader);
	            gl.deleteShader(vertexShader);
	            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	            if (!linked) {
	                var error = gl.getProgramInfoLog(program);
	                console.log('Failed to link program: ' + error);
	                gl.deleteProgram(program);
	                return null;
	            }
	        }
	        return program;
	    },
	    _createShader:function(gl, type, source){
	        var shader = gl.createShader(type);
	        if(shader){
	            gl.shaderSource(shader, source);
	            gl.compileShader(shader);

	            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	            if (!compiled) {
	                var error = gl.getShaderInfoLog(shader);
	                console.log('Failed to compile shader: ' + error);
	                gl.deleteShader(shader);
	                return null;
	            }
	        }
	        return shader;
	    }
	};

	WebGLRenderer.isSupport = function(){
	    if(this._isSupport !== undefined){
	        return this._isSupport;
	    }
	    else{
	        var canvas = document.createElement('canvas');
	        if(canvas.getContext && (canvas.getContext('webgl')||canvas.getContext('experimental-webgl'))){
	            this._isSupport = true;
	        }
	        else{
	            this._isSupport = false;
	        }
	        return this._isSupport;
	    }
	};

	module.exports = WebGLRenderer;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);
	var Hilo = __webpack_require__(3);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class Ticker是一个定时器类。它可以按指定帧率重复运行，从而按计划执行代码。
	 * @param {Number} fps 指定定时器的运行帧率。
	 * @module hilo/util/Ticker
	 * @requires hilo/core/Class
	 * @requires hilo/core/Hilo
	 */
	var Ticker = Class.create(/** @lends Ticker.prototype */{
	    constructor: function(fps){
	        this._targetFPS = fps || 30;
	        this._interval = 1000 / this._targetFPS;
	        this._tickers = [];
	    },

	    _paused: false,
	    _targetFPS: 0,
	    _interval: 0,
	    _intervalId: null,
	    _tickers: null,
	    _lastTime: 0,
	    _tickCount: 0,
	    _tickTime: 0,
	    _measuredFPS: 0,

	    /**
	     * 启动定时器。
	     * @param {Boolean} userRAF 是否使用requestAnimationFrame，默认为false。
	     */
	    start: function(useRAF){
	        if(this._intervalId) return;
	        this._lastTime = +new Date();

	        var self = this, interval = this._interval,
	            raf = window.requestAnimationFrame ||
	                  window[Hilo.browser.jsVendor + 'RequestAnimationFrame'];

	        if(useRAF && raf){
	            var tick = function(){
	                self._tick();
	            }
	            var runLoop = function(){
	                self._intervalId = setTimeout(runLoop, interval);
	                raf(tick);
	            };
	        }else{
	            runLoop = function(){
	                self._intervalId = setTimeout(runLoop, interval);
	                self._tick();
	            };
	        }

	        runLoop();
	    },

	    /**
	     * 停止定时器。
	     */
	    stop: function(){
	        clearTimeout(this._intervalId);
	        this._intervalId = null;
	        this._lastTime = 0;
	    },

	    /**
	     * 暂停定时器。
	     */
	    pause: function(){
	        this._paused = true;
	    },

	    /**
	     * 恢复定时器。
	     */
	    resume: function(){
	        this._paused = false;
	    },

	    /**
	     * @private
	     */
	    _tick: function(){
	        if(this._paused) return;
	        var startTime = +new Date(),
	            deltaTime = startTime - this._lastTime,
	            tickers = this._tickers;

	        //calculates the real fps
	        if(++this._tickCount >= this._targetFPS){
	            this._measuredFPS = 1000 / (this._tickTime / this._tickCount) + 0.5 >> 0;
	            this._tickCount = 0;
	            this._tickTime = 0;
	        }else{
	            this._tickTime += startTime - this._lastTime;
	        }
	        this._lastTime = startTime;

	        for(var i = 0, len = tickers.length; i < len; i++){
	            tickers[i].tick(deltaTime);
	        }
	    },

	    /**
	     * 获得测定的运行时帧率。
	     */
	    getMeasuredFPS: function(){
	        return this._measuredFPS;
	    },

	    /**
	     * 添加定时器对象。定时器对象必须实现 tick 方法。
	     * @param {Object} tickObject 要添加的定时器对象。此对象必须包含 tick 方法。
	     */
	    addTick: function(tickObject){
	        if(!tickObject || typeof(tickObject.tick) != 'function'){
	            throw new Error('Ticker: The tick object must implement the tick method.');
	        }
	        this._tickers.push(tickObject);
	    },

	    /**
	     * 删除定时器对象。
	     * @param {Object} tickObject 要删除的定时器对象。
	     */
	    removeTick: function(tickObject){
	        var tickers = this._tickers,
	            index = tickers.indexOf(tickObject);
	        if(index >= 0){
	            tickers.splice(index, 1);
	        }
	    }

	});

	module.exports = Ticker;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Hilo = __webpack_require__(3);
	var Class = __webpack_require__(4);
	var View = __webpack_require__(6);
	var Drawable = __webpack_require__(12);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * 使用示例:
	 * <pre>
	 * var bmp = new Hilo.Bitmap({image:imgElem, rect:[0, 0, 100, 100]});
	 * stage.addChild(bmp);
	 * </pre>
	 * @class Bitmap类表示位图图像类。
	 * @augments View
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。此外还包括：
	 * <ul>
	 * <li><b>image</b> - 位图所在的图像image。必需。</li>
	 * <li><b>rect</b> - 位图在图像image中矩形区域。</li>
	 * </ul>
	 * @module hilo/view/Bitmap
	 * @requires hilo/core/Hilo
	 * @requires hilo/core/Class
	 * @requires hilo/view/View
	 * @requires hilo/view/Drawable
	 */
	 var Bitmap = Class.create(/** @lends Bitmap.prototype */{
	    Extends: View,
	    constructor: function(properties){
	        properties = properties || {};
	        this.id = this.id || properties.id || Hilo.getUid("Bitmap");
	        Bitmap.superclass.constructor.call(this, properties);

	        this.drawable = new Drawable(properties);

	        //init width and height
	        if(!this.width || !this.height){
	            var rect = this.drawable.rect;
	            if(rect){
	                this.width = rect[2];
	                this.height = rect[3];
	            }
	        }
	    },

	    /**
	     * 设置位图的图片。
	     * @param {Image|String} image 图片对象或地址。
	     * @param {Array} rect 指定位图在图片image的矩形区域。
	     * @returns {Bitmap} 位图本身。
	     */
	    setImage: function(image, rect){
	        this.drawable.init({image:image, rect:rect});
	        if(rect){
	            this.width = rect[2];
	            this.height = rect[3];
	        }
	        return this;
	    }
	 });

	module.exports = Bitmap;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var EventMixin = __webpack_require__(7);
	var Class = __webpack_require__(4);

	/**
	 * @module weteach-trial-lesson/mediator
	 * @requires hilo/event/EventMixin
	 * @requires hilo/core/Class
	 */
	var mediator = Class.mix({}, EventMixin);

	module.exports = mediator;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var LoadQueue = __webpack_require__(18);
	var mediator = __webpack_require__(16);

	/**
	 * @module weteach-trial-lesson/resource
	 * @requires hilo/loader/LoadQueue
	 * @requires weteach-trial-lesson/mediator
	 */
	var resource = {
	  loadedRes: {},
	  res: [
	    { id: 'fish', src: 'src/images/fish.png' },
	    { id: 'bg', src: 'src/images/bg.png' },
	    { id: 'atTheZoo', src: 'src/images/at-the-zoo.jpeg' },
	    { id: 'autumnFall', src: 'src/images/autumn-fall.jpeg' },
	    { id: 'early', src: 'src/images/early-production.jpg' },
	    { id: 'favourite', src: 'src/images/favourite-toy-shop.jpg' },
	    { id: 'indexBg', src: 'src/images/index-bg.jpeg' },
	    { id: 'pre', src: 'src/images/pre-production.jpg' },
	    { id: 'speech', src: 'src/images/speech.jpg' },
	    { id: 'menuBar', src: 'src/images/menu-bar.png' },
	    { id: 'face', src: 'src/images/face.png' },
	    { id: 'hand', src: 'src/images/hand.png' },
	    { id: 'correct', src: 'src/images/correct.png' },
	    { id: 'incorrect', src: 'src/images/incorrect.png' },
	    { id: 'clock', src: 'src/images/clock.png' },
	    { id: 'two', src: 'src/images/two.png' },
	    { id: 'one', src: 'src/images/one.png' },
	    { id: 'bubble', src: 'src/images/bubble.png' },
	    { id: 'link', src: 'src/images/link.png' },
	    { id: 'back', src: 'src/images/back.png' },
	    { id: 'star', src: 'src/images/star.png' },
	    { id: 'boomFlower', src: 'src/images/boom-flower.png' },
	    { id: 'bird', src: 'src/images/bird.gif' },
	    { id: 'rats', src: 'src/images/rats.jpg' },
	    { id: 'tiger', src: 'src/images/tiger.jpg' },
	    { id: 'monkey', src: 'src/images/monkey.jpg' },
	    { id: 'duck', src: 'src/images/duck.jpg' },
	    { id: 'brownBird', src: 'src/images/brown-bird.jpg' },
	    { id: 'cow', src: 'src/images/cow.jpg' },
	    { id: 'leftArrow', src: 'src/images/left-arrow.png' },
	    { id: 'rightArrow', src: 'src/images/right-arrow.png' },
	    { id: 'sheep', src: 'src/images/sheep.jpg' },
	    { id: 'chicken', src: 'src/images/chicken.jpg' },
	    { id: 'frog', src: 'src/images/frog.jpg' },
	    { id: 'crocodile', src: 'src/images/crocodile.jpg' },
	    { id: 'elephant', src: 'src/images/elephant.jpg' },
	    { id: 'horse', src: 'src/images/horse.jpg' },

	    { id: 'panda', src: 'src/images/panda.jpg' },
	    { id: 'kangaroo', src: 'src/images/kangaroo.jpg' },
	    { id: 'dolphin', src: 'src/images/dolphin.jpg' },
	    { id: 'bear', src: 'src/images/bear.jpg' },
	    { id: 'lion', src: 'src/images/lion.jpg' },
	    { id: 'kitten', src: 'src/images/kitten.jpg' },

	    { id: 'pirate', src: 'src/images/pirate.jpg' },
	    { id: 'skates', src: 'src/images/skates.jpg' },
	    { id: 'puppy', src: 'src/images/puppy.jpg' },
	    { id: 'rabbit', src: 'src/images/rabbit.jpg' },
	    { id: 'whale', src: 'src/images/whale.jpg' },
	    { id: 'shark', src: 'src/images/shark.jpg' },

	    { id: 'fridge', src: 'src/images/fridge.jpg' },
	    { id: 'fallOver', src: 'src/images/fall-over.jpg' },
	    { id: 'ill', src: 'src/images/ill.png' },
	    { id: 'cook', src: 'src/images/cook.jpg' },
	    { id: 'cut', src: 'src/images/cut.jpg' },
	    { id: 'chemist', src: 'src/images/chemist.png' },

	    { id: 'saltPepper', src: 'src/images/salt-pepper.jpg' },
	    { id: 'meal', src: 'src/images/meal.jpg' },
	    { id: 'honey', src: 'src/images/honey.jpg' },
	    { id: 'jam', src: 'src/images/jam.jpg' },
	    { id: 'pizza', src: 'src/images/pizza.jpg' },
	    { id: 'medicine', src: 'src/images/medicine.jpg' },
	  ],
	  load: function() {
	    var res = this.res;
	    var loadedRes = this.loadedRes;

	    var queue = this.queue = new LoadQueue;
	    queue.add(res);

	    queue.on("complete", function() {
	      var imgs = [];
	      for (var i = 0; i < res.length; i++) {
	        var id = res[i].id;
	        loadedRes[id] = queue.getContent(id);
	      }
	      mediator.fire("resource:complete");
	    });

	    queue.on("load", function(d) {
	      mediator.fire("resource:loaded", {
	        num: queue._loaded / (queue._source.length + 1)
	      });
	    });

	    queue.start();
	  },
	  get: function(id) {
	    return this.loadedRes[id];
	  }
	};

	module.exports = resource;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);
	var EventMixin = __webpack_require__(7);
	var ImageLoader = __webpack_require__(19);
	var ScriptLoader = __webpack_require__(20);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	 
	//TODO: 超时timeout，失败重连次数maxTries，更多的下载器Loader，队列暂停恢复等。

	/**
	 * @class LoadQueue是一个队列下载工具。
	 * @param {Object} source 要下载的资源。可以是单个资源对象或多个资源的数组。
	 * @module hilo/loader/LoadQueue
	 * @requires hilo/core/Class
	 * @requires hilo/event/EventMixin
	 * @requires hilo/loader/ImageLoader
	 * @requires hilo/loader/ScriptLoader
	 * @property {Int} maxConnections 同时下载的最大连接数。默认为2。
	 */
	var LoadQueue = Class.create(/** @lends LoadQueue.prototype */{
	    Mixes: EventMixin,
	    constructor: function(source){
	        this._source = [];
	        this.add(source);
	    },

	    maxConnections: 2, //TODO: 应该是每个host的最大连接数。

	    _source: null,
	    _loaded: 0,
	    _connections: 0,
	    _currentIndex: -1,

	    /**
	     * 增加要下载的资源。可以是单个资源对象或多个资源的数组。
	     * @param {Object|Array} source 资源对象或资源对象数组。每个资源对象包含以下属性：
	     * <ul>
	     * <li><b>id</b> - 资源的唯一标识符。可用于从下载队列获取目标资源。</li>
	     * <li><b>src</b> - 资源的地址url。</li>
	     * <li><b>type</b> - 指定资源的类型。默认会根据资源文件的后缀来自动判断类型，不同的资源类型会使用不同的加载器来加载资源。</li>
	     * <li><b>loader</b> - 指定资源的加载器。默认会根据资源类型来自动选择加载器，若指定loader，则会使用指定的loader来加载资源。</li>
	     * <li><b>noCache</b> - 指示加载资源时是否增加时间标签以防止缓存。</li>
	     * <li><b>size</b> - 资源对象的预计大小。可用于预估下载进度。</li>
	     * </ul>
	     * @returns {LoadQueue} 下载队列实例本身。
	     */
	    add: function(source){
	        var me = this;
	        if(source){
	            source = source instanceof Array ? source : [source];
	            me._source = me._source.concat(source);
	        }
	        return me;
	    },

	    /**
	     * 根据id或src地址获取资源对象。
	     * @param {String} id 指定资源的id或src。
	     * @returns {Object} 资源对象。
	     */
	    get: function(id){
	        if(id){
	            var source = this._source;
	            for(var i = 0; i < source.length; i++){
	                var item = source[i];
	                if(item.id === id || item.src === id){
	                    return item;
	                }
	            }
	        }
	        return null;
	    },

	    /**
	     * 根据id或src地址获取资源内容。
	     * @param {String} id 指定资源的id或src。
	     * @returns {Object} 资源内容。
	     */
	    getContent: function(id){
	        var item = this.get(id);
	        return item && item.content;
	    },

	    /**
	     * 开始下载队列。
	     * @returns {LoadQueue} 下载队列实例本身。
	     */
	    start: function(){
	        var me = this;
	        me._loadNext();
	        return me;
	    },

	    /**
	     * @private
	     */
	    _loadNext: function(){
	        var me = this, source = me._source, len = source.length;

	        //all items loaded
	        if(me._loaded >= len){
	            me.fire('complete');
	            return;
	        }

	        if(me._currentIndex < len - 1 && me._connections < me.maxConnections){
	            var index = ++me._currentIndex;
	            var item = source[index];
	            var loader = me._getLoader(item);

	            if(loader){
	                var onLoad = loader.onLoad, onError = loader.onError;

	                loader.onLoad = function(e){
	                    loader.onLoad = onLoad;
	                    loader.onError = onError;
	                    var content = onLoad && onLoad.call(loader, e) || e.target;
	                    me._onItemLoad(index, content);
	                };
	                loader.onError = function(e){
	                    loader.onLoad = onLoad;
	                    loader.onError = onError;
	                    onError && onError.call(loader, e);
	                    me._onItemError(index, e);
	                };
	                me._connections++;
	            }

	            me._loadNext();
	            loader && loader.load(item);
	        }
	    },

	    /**
	     * @private
	     */
	    _getLoader: function(item){
	        var me = this, loader = item.loader;
	        if(loader) return loader;

	        var type = item.type || getExtension(item.src);

	        switch(type){
	            case 'png':
	            case 'jpg':
	            case 'jpeg':
	            case 'gif':
	                loader = new ImageLoader();
	                break;
	            case 'js':
	            case 'jsonp':
	                loader = new ScriptLoader();
	                break;
	        }

	        return loader;
	    },

	    /**
	     * @private
	     */
	    _onItemLoad: function(index, content){
	        var me = this, item = me._source[index];
	        item.loaded = true;
	        item.content = content;
	        me._connections--;
	        me._loaded++;
	        me.fire('load', item);
	        me._loadNext();
	    },

	    /**
	     * @private
	     */
	    _onItemError: function(index, e){
	        var me = this, item = me._source[index];
	        item.error = e;
	        me._connections--;
	        me._loaded++;
	        me.fire('error', item);
	        me._loadNext();
	    },

	    /**
	     * 获取全部或已下载的资源的字节大小。
	     * @param {Boolean} loaded 指示是已下载的资源还是全部资源。默认为全部。
	     * @returns {Number} 指定资源的字节大小。
	     */
	    getSize: function(loaded){
	        var size = 0, source = this._source;
	        for(var i = 0; i < source.length; i++){
	            var item = source[i];
	            size += (loaded ? item.loaded && item.size : item.size) || 0;
	        }
	        return size;
	    },

	    /**
	     * 获取已下载的资源数量。
	     * @returns {Uint} 已下载的资源数量。
	     */
	    getLoaded: function(){
	        return this._loaded;
	    },

	    /**
	     * 获取所有资源的数量。
	     * @returns {Uint} 所有资源的数量。
	     */
	    getTotal: function(){
	        return this._source.length;
	    }

	});

	/**
	 * @private
	 */
	function getExtension(src){
	    var extRegExp = /\/?[^/]+\.(\w+)(\?\S+)?$/i, match, extension;
	    if(match = src.match(extRegExp)){
	        extension = match[1].toLowerCase();
	    }
	    return extension || null;
	}

	module.exports = LoadQueue;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @private
	 * @class 图片资源加载器。
	 * @module hilo/loader/ImageLoader
	 * @requires hilo/core/Class
	 */
	var ImageLoader = Class.create({
	    load: function(data){
	        var me = this;

	        var image = new Image();
	        if(data.crossOrigin){
	            image.crossOrigin = data.crossOrigin;
	        }

	        image.onload = //me.onLoad.bind(image);
	        function(){
	            me.onLoad(image)
	        };
	        image.onerror = image.onabort = me.onError.bind(image);
	        image.src = data.src + (data.noCache ? (data.src.indexOf('?') == -1 ? '?' : '&') + 't=' + (+new Date) : '');
	    },

	    onLoad: function(e){
	        e = e||window.event;
	        var image = e//e.target;
	        image.onload = image.onerror = image.onabort = null;
	        return image;
	    },

	    onError: function(e){
	        var image = e.target;
	        image.onload = image.onerror = image.onabort = null;
	        return e;
	    }

	});

	module.exports = ImageLoader;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @private
	 * @class javascript或JSONP加载器。
	 * @module hilo/loader/ScriptLoader
	 * @requires hilo/core/Class
	 */
	var ScriptLoader = Class.create({
	    load: function(data){
	        var me = this, src = data.src, isJSONP = data.type == 'jsonp';

	        if(isJSONP){
	            var callbackName = data.callbackName || 'callback';
	            var callback = data.callback || 'jsonp' + (++ScriptLoader._count);
	            var win = window;

	            if(!win[callback]){
	                win[callback] = function(result){
	                    delete win[callback];
	                }
	            }
	        }

	        if(isJSONP) src += (src.indexOf('?') == -1 ? '?' : '&') + callbackName + '=' + callback;
	        if(data.noCache) src += (src.indexOf('?') == -1 ? '?' : '&') + 't=' + (+new Date());

	        var script = document.createElement('script');
	        script.type = 'text/javascript';
	        script.async = true;
	        script.onload = me.onLoad.bind(me);
	        script.onerror = me.onError.bind(me);
	        script.src = src;
	        if(data.id) script.id = data.id;
	        document.getElementsByTagName('head')[0].appendChild(script);
	    },

	    onLoad: function(e){
	        var script = e.target;
	        script.onload = script.onerror = null;
	        return script;
	    },

	    onError: function(e){
	        var script = e.target;
	        script.onload = script.onerror = null;
	        return e;
	    },

	    Statics: {
	        _count: 0
	    }

	});

	module.exports = ScriptLoader;

/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * @module weteach-trial-lesson/loading
	*/
	var loading = {
	    elem:document.getElementById('loading'),
	    start: function() {
	        this.elem.style.display = "block";
	        this.loaded(0);
	    },
	    loaded:function(num) {
	        this.elem.innerHTML = 'loading... ' + (num * 100).toFixed(2) + '%';
	    },
	    end:function(){
	        this.elem.parentNode.removeChild(this.elem);
	    }
	};


	module.exports = loading;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);
	var Hilo = __webpack_require__(3);
	var View = __webpack_require__(6);
	var CacheMixin = __webpack_require__(23);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class Text类提供简单的文字显示功能。复杂的文本功能可以使用DOMElement。
	 * @augments View
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/view/Text
	 * @requires hilo/core/Class
	 * @requires hilo/core/Hilo
	 * @requires hilo/view/View
	 * @requires hilo/view/CacheMixin
	 * @property {String} text 指定要显示的文本内容。
	 * @property {String} color 指定使用的字体颜色。
	 * @property {String} textAlign 指定文本的对齐方式。可以是以下任意一个值：'start', 'end', 'left', 'right', and 'center'。
	 * @property {String} textVAlign 指定文本的垂直对齐方式。可以是以下任意一个值：'top', 'middle', 'bottom'。
	 * @property {Boolean} outline 指定文本是绘制边框还是填充。
	 * @property {Number} lineSpacing 指定文本的行距。单位为像素。默认值为0。
	 * @property {Number} maxWidth 指定文本的最大宽度。默认值为200。
	 * @property {String} font 文本的字体CSS样式。只读属性。设置字体样式请用setFont方法。
	 * @property {Number} textWidth 指示文本内容的宽度，只读属性。仅在canvas模式下有效。
	 * @property {Number} textHeight 指示文本内容的高度，只读属性。仅在canvas模式下有效。
	 */
	var Text = Class.create(/** @lends Text.prototype */{
	    Extends: View,
	    Mixes:CacheMixin,
	    constructor: function(properties){
	        properties = properties || {};
	        this.id = this.id || properties.id || Hilo.getUid('Text');
	        Text.superclass.constructor.call(this, properties);

	        // if(!properties.width) this.width = 200; //default width
	        if(!properties.font) this.font = '12px arial'; //default font style
	        this._fontHeight = Text.measureFontHeight(this.font);
	    },

	    text: null,
	    color: '#000',
	    textAlign: null,
	    textVAlign: null,
	    outline: false,
	    lineSpacing: 0,
	    maxWidth: 200,
	    font: null, //ready-only
	    textWidth: 0, //read-only
	    textHeight: 0, //read-only

	    /**
	     * 设置文本的字体CSS样式。
	     * @param {String} font 要设置的字体CSS样式。
	     * @returns {Text} Text对象本身。链式调用支持。
	     */
	    setFont: function(font){
	        var me = this;
	        if(me.font !== font){
	            me.font = font;
	            me._fontHeight = Text.measureFontHeight(font);
	        }

	        return me;
	    },

	    /**
	     * 覆盖渲染方法。
	     * @private
	     */
	    render: function(renderer, delta){
	        var me = this, canvas = renderer.canvas;

	        if(renderer.renderType === 'canvas'){
	            me._draw(renderer.context);
	        }
	        else if(renderer.renderType === 'dom'){
	            var drawable = me.drawable;
	            var domElement = drawable.domElement;
	            var style = domElement.style;

	            style.font = me.font;
	            style.textAlign = me.textAlign;
	            style.color = me.color;
	            style.width = me.width + 'px';
	            style.height = me.height + 'px';
	            style.lineHeight = (me._fontHeight + me.lineSpacing) + 'px';

	            domElement.innerHTML = me.text;
	            renderer.draw(this);
	        }
	        else{
	            //TODO:自动更新cache
	            me.cache();
	            renderer.draw(me);
	        }
	    },

	    /**
	     * 在指定的渲染上下文上绘制文本。
	     * @private
	     */
	    _draw: function(context){
	        var me = this, text = me.text.toString();
	        if(!text) return;

	        //set drawing style
	        context.font = me.font;
	        context.textAlign = me.textAlign;
	        context.textBaseline = 'top';

	        //find and draw all explicit lines
	        var lines = text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
	        var width = 0, height = 0;
	        var lineHeight = me._fontHeight + me.lineSpacing;
	        var i, line, w;
	        var drawLines = [];

	        for(i = 0, len = lines.length; i < len; i++){
	            line = lines[i];
	            w = context.measureText(line).width;

	            //check if the line need to split
	            if(w <= me.maxWidth){
	                drawLines.push({text:line, y:height});
	                // me._drawTextLine(context, line, height);
	                if(width < w) width = w;
	                height += lineHeight;
	                continue;
	            }

	            var str = '', oldWidth = 0, newWidth, j, word;

	            for(j = 0, wlen = line.length; j < wlen; j++){
	                word = line[j];
	                newWidth = context.measureText(str + word).width;

	                if(newWidth > me.maxWidth){
	                    drawLines.push({text:str, y:height});
	                    // me._drawTextLine(context, str, height);
	                    if(width < oldWidth) width = oldWidth;
	                    height += lineHeight;
	                    str = word;
	                }else{
	                    oldWidth = newWidth;
	                    str += word;
	                }

	                if(j == wlen - 1){
	                    drawLines.push({text:str, y:height});
	                    // me._drawTextLine(context, str, height);
	                    if(str !== word && width < newWidth) width = newWidth;
	                    height += lineHeight;
	                }
	            }
	        }

	        me.textWidth = width;
	        me.textHeight = height;
	        if(!me.width) me.width = width;
	        if(!me.height) me.height = height;

	        //vertical alignment
	        var startY = 0;
	        switch(me.textVAlign){
	            case 'middle':
	                startY = me.height - me.textHeight >> 1;
	                break;
	            case 'bottom':
	                startY = me.height - me.textHeight;
	                break;
	        }

	        //draw background
	        var bg = me.background;
	        if(bg){
	            context.fillStyle = bg;
	            context.fillRect(0, 0, me.width, me.height);
	        }

	        if(me.outline) context.strokeStyle = me.color;
	        else context.fillStyle = me.color;

	        //draw text lines
	        for(var i = 0; i < drawLines.length; i++){
	            var line = drawLines[i];
	            me._drawTextLine(context, line.text, startY + line.y);
	        }
	    },

	    /**
	     * 在指定的渲染上下文上绘制一行文本。
	     * @private
	     */
	    _drawTextLine: function(context, text, y){
	        var me = this, x = 0, width = me.width;

	        switch(me.textAlign){
	            case 'center':
	                x = width >> 1;
	                break;
	            case 'right':
	            case 'end':
	                x = width;
	                break;
	        };

	        if(me.outline) context.strokeText(text, x, y);
	        else context.fillText(text, x, y);
	    },

	    Statics: /** @lends Text */{
	        /**
	         * 测算指定字体样式的行高。
	         * @param {String} font 指定要测算的字体样式。
	         * @return {Number} 返回指定字体的行高。
	         */
	        measureFontHeight: function(font){
	            var docElement = document.documentElement, fontHeight;
	            var elem = Hilo.createElement('div', {style:{font:font, position:'absolute'}, innerHTML:'M'});

	            docElement.appendChild(elem);
	            fontHeight = elem.offsetHeight;
	            docElement.removeChild(elem);
	            return fontHeight;
	        }
	    }

	});

	module.exports = Text;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Hilo = __webpack_require__(3);
	var Class = __webpack_require__(4);
	var Drawable = __webpack_require__(12);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	var _cacheCanvas = Hilo.createElement('canvas');
	var _cacheContext = _cacheCanvas.getContext('2d');
	/**
	 * @class CacheMixin是一个包含cache功能的mixin。可以通过 Class.mix(target, CacheMixin) 来为target增加cache功能。
	 * @mixin
	 * @static
	 * @module hilo/view/CacheMixin
	 * @requires hilo/core/Hilo
	 * @requires hilo/core/Class
	 * @requires hilo/view/Drawable
	 */
	var CacheMixin = {
	    _cacheDirty:true,
	    /**
	     * 缓存到图片里。可用来提高渲染效率。
	     * @param {Boolean} forceUpdate 是否强制更新缓存
	     */
	    cache: function(forceUpdate){
	        if(forceUpdate || this._cacheDirty || !this._cacheImage){
	            this.updateCache();
	        }
	    },
	    /**
	     * 更新缓存
	     */
	    updateCache:function(){
	        //TODO:width, height自动判断
	        _cacheCanvas.width = this.width;
	        _cacheCanvas.height = this.height;
	        this._draw(_cacheContext);
	        this._cacheImage = new Image();
	        this._cacheImage.src = _cacheCanvas.toDataURL();
	        this.drawable = this.drawable||new Drawable();
	        this.drawable.init(this._cacheImage);
	        this._cacheDirty = false;
	    },
	    /**
	     * 设置缓存是否dirty
	     */
	    setCacheDirty:function(dirty){
	        this._cacheDirty = dirty;
	    }
	};

	module.exports = CacheMixin;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Class = __webpack_require__(4);
	var Hilo = __webpack_require__(3);
	var Container = __webpack_require__(5);
	var Bitmap = __webpack_require__(15);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @class BitmapText类提供使用位图文本的功能。当前仅支持单行文本。
	 * @augments Container
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
	 * @module hilo/view/BitmapText
	 * @requires hilo/core/Class
	 * @requires hilo/core/Hilo
	 * @requires hilo/view/Container
	 * @requires hilo/view/Bitmap
	 * @property {Object} glyphs 位图字体的字形集合。格式为：{letter:{image:img, rect:[0,0,100,100]}}。
	 * @property {Number} letterSpacing 字距，即字符间的间隔。默认值为0。
	 * @property {String} text 位图文本的文本内容。只读属性。设置文本请使用setFont方法。
	 * @property {String} textAlign 文本对齐方式，值为left、center、right, 默认left。只读属性。设置文本请使用setTextAlign方法。
	 */
	var BitmapText = Class.create(/** @lends BitmapText.prototype */{
	    Extends: Container,
	    constructor: function(properties){
	        properties = properties || {};
	        this.id = this.id || properties.id || Hilo.getUid('BitmapText');
	        BitmapText.superclass.constructor.call(this, properties);

	        var text = properties.text + '';
	        if(text){
	            this.text = '';
	            this.setText(text);
	        }

	        this.pointerChildren = false; //disable user events for single letters
	    },

	    glyphs: null,
	    letterSpacing: 0,
	    text: '',
	    textAlign:'left',

	    /**
	     * 设置位图文本的文本内容。
	     * @param {String} text 要设置的文本内容。
	     * @returns {BitmapText} BitmapText对象本身。链式调用支持。
	     */
	    setText: function(text){
	        var me = this, str = text.toString(), len = str.length;
	        if(me.text == str) return;
	        me.text = str;

	        var i, charStr, charGlyph, charObj, width = 0, height = 0, left = 0;
	        for(i = 0; i < len; i++){
	            charStr = str.charAt(i);
	            charGlyph = me.glyphs[charStr];
	            if(charGlyph){
	                left = width + (width > 0 ? me.letterSpacing : 0);
	                if(me.children[i]){
	                    charObj = me.children[i];
	                    charObj.setImage(charGlyph.image, charGlyph.rect);
	                }
	                else{
	                    charObj = me._createBitmap(charGlyph);
	                    me.addChild(charObj);
	                }
	                charObj.x = left;
	                width = left + charGlyph.rect[2];
	                height = Math.max(height, charGlyph.rect[3]);
	            }
	        }

	        for(i = me.children.length - 1;i >= len;i --){
	            me._releaseBitmap(me.children[i]);
	            me.children[i].removeFromParent();
	        }

	        me.width = width;
	        me.height = height;
	        this.setTextAlign();
	        return me;
	    },
	    _createBitmap:function(cfg){
	        var bmp;
	        if(BitmapText._pool.length){
	            bmp = BitmapText._pool.pop();
	            bmp.setImage(cfg.image, cfg.rect);
	        }
	        else{
	            bmp = new Bitmap({
	                image:cfg.image,
	                rect:cfg.rect
	            });
	        }
	        return bmp;
	    },
	    _releaseBitmap:function(bmp){
	        BitmapText._pool.push(bmp);
	    },

	     /**
	     * 设置位图文本的对齐方式。
	     * @param textAlign 文本对齐方式，值为left、center、right
	     * @returns {BitmapText} BitmapText对象本身。链式调用支持。
	     */
	    setTextAlign:function(textAlign){
	        this.textAlign = textAlign||this.textAlign;
	        switch(this.textAlign){
	            case "center":
	                this.pivotX = this.width * .5;
	                break;
	            case "right":
	                this.pivotX = this.width;
	                break;
	            case "left":
	            default:
	                this.pivotX = 0;
	                break;
	        }
	        return this;
	    },

	    /**
	     * 返回能否使用当前指定的字体显示提供的字符串。
	     * @param {String} str 要检测的字符串。
	     * @returns {Boolean} 是否能使用指定字体。
	     */
	    hasGlyphs: function(str){
	        var glyphs = this.glyphs;
	        if(!glyphs) return false;

	        var str = str.toString(), len = str.length, i;
	        for(i = 0; i < len; i++){
	            if(!glyphs[str.charAt(i)]) return false;
	        }
	        return true;
	    },

	    Statics:/** @lends BitmapText */{
	        _pool:[],
	        /**
	         * 简易方式生成字形集合。
	         * @static
	         * @param {String} text 字符文本。
	         * @param {Image} image 字符图片。
	         * @param {Number} col 列数  默认和文本字数一样
	         * @param {Number} row 行数 默认1行
	         * @returns {BitmapText} BitmapText对象本身。链式调用支持。
	         */
	        createGlyphs:function(text, image, col, row){
	            var str = text.toString();
	            col = col||str.length;
	            row = row||1;
	            var w = image.width/col;
	            var h = image.height/row;
	            var glyphs = {};
	            for(var i = 0, l = text.length;i < l;i ++){
	                charStr = str.charAt(i);
	                glyphs[charStr] = {
	                    image:image,
	                    rect:[w * (i % col), h * Math.floor(i / col), w, h]
	                }
	            }
	            return glyphs;
	        }
	    }

	});

	module.exports = BitmapText;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hilo 1.0.0 for commonjs
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */
	var Hilo = __webpack_require__(3);
	var Class = __webpack_require__(4);
	var View = __webpack_require__(6);
	var Drawable = __webpack_require__(12);

	/**
	 * Hilo
	 * Copyright 2015 alibaba.com
	 * Licensed under the MIT License
	 */

	/**
	 * @name DOMElement
	 * @class DOMElement是dom元素的包装。
	 * @augments View
	 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。特殊属性有：
	 * <ul>
	 * <li><b>element</b> - 要包装的dom元素。必需。</li>
	 * </ul>
	 * @module hilo/view/DOMElement
	 * @requires hilo/core/Hilo
	 * @requires hilo/core/Class
	 * @requires hilo/view/View
	 * @requires hilo/view/Drawable
	 */
	var DOMElement = Class.create(/** @lends DOMElement.prototype */{
	    Extends: View,
	    constructor: function(properties){
	        properties = properties || {};
	        this.id = this.id || properties.id || Hilo.getUid("DOMElement");
	        DOMElement.superclass.constructor.call(this, properties);

	        this.drawable = new Drawable();
	        var elem = this.drawable.domElement = properties.element || Hilo.createElement('div');
	        elem.id = this.id;
	    },

	    /**
	     * 覆盖渲染方法。
	     * @private
	     */
	    _render: function(renderer, delta){
	        if(!this.onUpdate || this.onUpdate(delta) !== false){
	            renderer.transform(this);
	            if(this.visible && this.alpha > 0){
	                this.render(renderer, delta);
	            }
	        }
	    },

	    /**
	     * 覆盖渲染方法。
	     * @private
	     */
	    render: function(renderer, delta){
	        var canvas = renderer.canvas;
	        if(canvas.getContext){
	            var elem = this.drawable.domElement, depth = this.depth,
	                nextElement = canvas.nextSibling, nextDepth;
	            if(elem.parentNode) return;

	            //draw dom element just after stage canvas
	            while(nextElement && nextElement.nodeType != 3){
	                nextDepth = parseInt(nextElement.style.zIndex) || 0;
	                if(nextDepth <= 0 || nextDepth > depth){
	                    break;
	                }
	                nextElement = nextElement.nextSibling;
	            }
	            canvas.parentNode.insertBefore(this.drawable.domElement, nextElement);
	        }else{
	            renderer.draw(this);
	        }
	    }
	});

	module.exports = DOMElement;

/***/ }
/******/ ]);