/**
 * Hilo 1.0.0 for commonjs
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
var Hilo = require('../core/Hilo');
var Class = require('../core/Class');
var View = require('./View');
var Drawable = require('./Drawable');

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