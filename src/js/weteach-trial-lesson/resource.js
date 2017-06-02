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
    
    { id: 'balloon', src: 'src/images/balloon.png' },
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
