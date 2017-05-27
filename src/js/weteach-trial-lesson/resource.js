var LoadQueue = require('../hilo/loader/LoadQueue');
var mediator = require('./mediator');

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
    { id: 'kitchen', src: 'src/images/kitchen.jpg' },
    { id: 'frog', src: 'src/images/frog.jpg' },
    { id: 'crocodile', src: 'src/images/crocodile.jpg' },
    { id: 'elephant', src: 'src/images/elephant.jpg' },
    { id: 'horse', src: 'src/images/horse.jpg' },
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
