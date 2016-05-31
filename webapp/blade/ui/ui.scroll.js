/*
待修复
1 设置step时候，在达到max值时候会有问题
2 设置step时候会导致滚动条不消失

*/
define([], function () {

    var utils = (function () {
        var me = {};
        var _elementStyle = document.createElement('div').style;

        //获得需要兼容CSS3前缀
        var _vendor = (function () {
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'];
            var transform;
            var i = 0;
            var l = vendors.length;

            for (; i < l; i++) {
                transform = vendors[i] + 'ransform';
                if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
            }
            return false;
        })();

        //获取样式（CSS3兼容）
        function _prefixStyle(style) {
            if (_vendor === false) return false;
            if (_vendor === '') return style;
            return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }

        me.getTime = Date.now || function getTime() { return new Date().getTime(); };

        me.addEvent = function (el, type, fn, capture) {
            if (el[0] && el != window.top) el = el[0];
            el.addEventListener(type, fn, !!capture);
        };

        me.removeEvent = function (el, type, fn, capture) {
            if (el[0] && el != window.top) el = el[0];
            el.removeEventListener(type, fn, !!capture);
        };

        /*
        current：当前鼠标位置
        start：touchStart时候记录的Y（可能是X）的开始位置，但是在touchmove时候可能被重写
        time： touchstart到手指离开时候经历的时间，同样可能被touchmove重写
        lowerMargin：y可移动的最大距离，这个一般为计算得出 this.wrapperHeight - this.scrollerHeight
        wrapperSize：如果有边界距离的话就是可拖动，不然碰到0的时候便停止
        */
        me.momentum = function (current, start, time, lowerMargin, wrapperSize, scrollOffset) {
            var distance = current - start,
		speed = Math.abs(distance) / time,
		destination,
		duration,
		deceleration = 0.0006;

            scrollOffset = scrollOffset || 0;

            destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;

            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            } else if (destination > 0 + scrollOffset) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) + scrollOffset : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }

            return {
                destination: Math.round(destination),
                duration: duration
            };

        };

        $.extend(me, {
            hasTouch: 'ontouchstart' in window
        });


        //我们暂时只判断touch 和 mouse即可
        $.extend(me.style = {}, {
            transform: _prefixStyle('transform'),
            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
            transitionDuration: _prefixStyle('transitionDuration'),
            transitionDelay: _prefixStyle('transitionDelay'),
            transformOrigin: _prefixStyle('transformOrigin')
        });

        $.extend(me.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,

            mousedown: 2,
            mousemove: 2,
            mouseup: 2
        });

        $.extend(me.ease = {}, {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function (k) {
                    return k * (2 - k);
                }
            },
            circular: {
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                fn: function (k) {
                    return Math.sqrt(1 - (--k * k));
                }
            },
            back: {
                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fn: function (k) {
                    var b = 4;
                    return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                }
            },
            bounce: {
                style: '',
                fn: function (k) {
                    if ((k /= 1) < (1 / 2.75)) {
                        return 7.5625 * k * k;
                    } else if (k < (2 / 2.75)) {
                        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                    } else if (k < (2.5 / 2.75)) {
                        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                    } else {
                        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                    }
                }
            },
            elastic: {
                style: '',
                fn: function (k) {
                    var f = 0.22,
		e = 0.4;

                    if (k === 0) { return 0; }
                    if (k == 1) { return 1; }

                    return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
                }
            }
        });
        return me;
    })();

    function IScroll(opts) {
        this.wrapper = typeof opts.wrapper == 'string' ? $(opts.wrapper) : opts.wrapper;
        this.scroller = typeof opts.scroller == 'string' ? $(opts.scroller) : opts.scroller;
        if (!opts.wrapper[0] || !opts.scroller[0]) throw 'param error';

        this.swrapper = this.wrapper;
        this.wrapper = this.wrapper[0];
        this.scroller = this.scroller[0];

        //这个属性会被动态改变的，如果这里
        this.scrollerStyle = this.scroller.style;

        this.options = {
            //每次要求移动的步长
            step: false,
            //是否具有滚动条
            scrollbars: true,
            // 其实时期Y的位置
            startY: 0,
            preventDefault: true,

            scrollOffset: 0,

            //默认竖向滚动
            scrollType: 'y',

            //超出边界还原时间点
            bounceTime: 400,
            //超出边界返回的动画
            bounceEasing: utils.ease.circular,

            //超出边界时候是否还能拖动
            bounce: true,

            momentum: true,

            bindToWrapper: true,

            //当window触发resize事件60ms后还原
            resizePolling: 60,
            startX: 0,
            startY: 0
        };

        for (var i in opts) {
            this.options[i] = opts[i];
        }

        //    if (this.options.scrollType == 'y') {
        //      if (this.scroller.clientHeight < this.wrapper.clientHeight) return;
        //    } else {
        //      if (this.scroller.clientWidth < this.wrapper.clientWidth) return;
        //    }


        this.translateZ = ' translateZ(0)';

        this.x = 0;
        this.y = 0;
        this._events = {};

        //默认方向是向前
        this.dir = 'forward';

        this._init();

        //更新滚动条位置
        this.refresh();

        //更新本身位置
        this.scrollTo(this.options.startX, this.options.startY);

        this.enable();

    };

    IScroll.prototype = {
        _init: function () {
            this._initEvents();

            //初始化滚动条，滚动条此处需要做重要处理
            if (this.options.scrollbars) {
                this._initIndicator();
            }
        },
        refresh: function () {
            var rf = this.wrapper.offsetHeight; 	// Force reflow

            this.wrapperWidth = this.wrapper.clientWidth;
            this.scrollerWidth = this.scroller.offsetWidth;
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;

            this.wrapperHeight = this.wrapper.clientHeight;
            this.scrollerHeight = this.scroller.offsetHeight;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

            //增加偏移量概念
            this.maxScrollX = this.maxScrollX - this.options.scrollOffset
            this.maxScrollY = this.maxScrollY - this.options.scrollOffset;


            //处理步长问题
            //      if (this.options.step) {
            //        if (this.maxScrollX % this.options.step != 0) {
            //          this.maxScrollX = Math.round(this.maxScrollX / this.options.step) * this.options.step;
            //          var s = '';
            //        }
            //        if (this.maxScrollY % this.options.step != 0) {
            //          this.maxScrollY = Math.round(this.maxScrollY / this.options.step) * this.options.step;
            //        }
            //      }

            if (this.options.scrollType == 'y') {
                this.maxScrollX = 0;
            } else {
                this.maxScrollY = 0;
            }

            this.endTime = 0;

            this._execEvent('refresh');

            this.resetPosition();

        },
        _initEvents: function (remove) {
            var eventType = remove ? utils.removeEvent : utils.addEvent;
            var target = this.options.bindToWrapper ? this.wrapper : window;

            eventType(window, 'orientationchange', this);
            eventType(window, 'resize', this);

            if (utils.hasTouch) {
                eventType(this.wrapper, 'touchstart', this);
                eventType(target, 'touchmove', this);
                eventType(target, 'touchcancel', this);
                eventType(target, 'touchend', this);
            } else {
                eventType(this.wrapper, 'mousedown', this);
                eventType(target, 'mousemove', this);
                eventType(target, 'mousecancel', this);
                eventType(target, 'mouseup', this);
            }

            eventType(this.scroller, 'transitionend', this);
            eventType(this.scroller, 'webkitTransitionEnd', this);
            eventType(this.scroller, 'oTransitionEnd', this);
            eventType(this.scroller, 'MSTransitionEnd', this);
        },
        _start: function (e) {
            if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                return;
            }

            var point = e.touches ? e.touches[0] : e, pos;
            this.initiated = utils.eventType[e.type];

            this.moved = false;

            this.distY = 0;

            //开启动画时间，如果之前有动画的话，便要停止动画，这里因为没有传时间，所以动画便直接停止了
            this._transitionTime();

            this.startTime = utils.getTime();

            //如果正在进行动画，需要停止，并且触发滑动结束事件
            if (this.isInTransition) {
                this.isInTransition = false;
                pos = this.getComputedPosition();
                var _x = Math.round(pos.x);
                var _y = Math.round(pos.y);

                //移动过去
                this._translate(_x, _y);
                this._execEvent('scrollEnd');

            }

            this.startX = this.x;
            this.startY = this.y;
            this.absStartX = this.x;
            this.absStartY = this.y;
            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this._execEvent('beforeScrollStart');

            //解决三星问题
            if (this.options.preventDefault) {
                e.preventDefault();
            }

        },

        _move: function (e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            var point = e.touches ? e.touches[0] : e,
      deltaX = point.pageX - this.pointX,
      deltaY = point.pageY - this.pointY,
      timestamp = utils.getTime(),
      newX, newY,
      absDistX, absDistY;

            var x1 = this.x;
            var y1 = this.y;
            var x2 = this.x + deltaX
            var y2 = this.y + deltaY;

            var dir = Math.abs(deltaX) >= Math.abs(deltaY) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down');

            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this.distX += deltaX;
            this.distY += deltaY;
            absDistX = Math.abs(this.distX);
            absDistY = Math.abs(this.distY);

            // 如果一直按着没反应的话这里就直接返回了
            if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                return;
            }

            if (this.options.scrollType == 'y') {
                if (this.options.preventDefault && (dir == 'up' || dir == 'down')) {
                    e.preventDefault();
                }
                deltaX = 0;
            } else {
                if (this.options.preventDefault && (dir == 'left' || dir == 'right')) {
                    e.preventDefault();
                }
                deltaY = 0;
            }

            this.flipDir = dir;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            if (newX > this.options.scrollOffset || newX < this.maxScrollX) {
                newX = this.options.bounce ? this.x + deltaX / 3 : newX > this.options.scrollOffset ? this.options.scrollOffset : this.maxScrollX;
            }

            if (newY > this.options.scrollOffset || newY < this.maxScrollY) {
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > this.options.scrollOffset ? this.options.scrollOffset : this.maxScrollY;
            }

            if (!this.moved) {
                this._execEvent('scrollStart');
            }

            this.moved = true;

            //暂时只考虑input问题，有效再扩展
            var el = document.activeElement;
            if (el.nodeName.toLowerCase() == 'input') {
                el.blur();
                this.disable();
                setTimeout($.proxy(function () {
                    this.enable();
                }, this), 250);
                return;
            }

            if (newX > this.x || newY > this.y) {
                this.dir = 'forward';
            } else {
                this.dir = 'back';
            }

            this._translate(newX, newY, true);

            //防止过于灵敏
            //      if (timestamp - this.startTime > 300) {
            //        this.startTime = timestamp;
            //        this.startX = this.x;
            //        this.startY = this.y;
            //      }


        },
        _end: function (e) {

            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            var point = e.changedTouches ? e.changedTouches[0] : e, momentumX,
      momentumY,
      duration = utils.getTime() - this.startTime,
      newX = Math.round(this.x),
      newY = Math.round(this.y),
      distanceX = Math.abs(newX - this.startX),
      distanceY = Math.abs(newY - this.startY),

      tdistanceX = Math.abs(newX - this.startX),
      tdistanceY = Math.abs(newY - this.startY),

      time = 0,
      easing = '';

            this.isInTransition = 0;
            this.initiated = 0;
            this.endTime = utils.getTime();

            if (this.resetPosition(this.options.bounceTime)) {
                return;
            }

            this.scrollTo(newX, newY);
            if (!this.moved) {

                //这里需要监听使用步长问题
                this._execEvent('scrollCancel');
                return;
            }

            if (this.options.momentum && duration < 300) {
                momentumX = utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.scrollOffset);
                momentumY = utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.scrollOffset);
                newX = momentumX.destination;
                newY = momentumY.destination;

                if (this.options.scrollType == 'y') {
                    time = Math.max(0, momentumY.duration);
                } else {
                    time = Math.max(momentumX.duration, 0);
                }
                this.isInTransition = 1;
            }

            tdistanceX = Math.abs(newX - this.startX);
            tdistanceY = Math.abs(newY - this.startY);

            //处理步长
            //这块处理有问题，需要重新写*******************************
            if (this.options.step) {
                var x = newX, y = newY;
                var left = Math.abs(x);
                var top = Math.abs(y);

                var flag1 = x > 0 ? 1 : -1;
                var flag2 = y > 0 ? 1 : -1;

                var difStepX = this.options.step - (tdistanceX % this.options.step);
                var difStepY = this.options.step - (tdistanceY % this.options.step);

                //        console.log('left: ' + left + ', newX: ' + +newX + ', distanceX: ' + tdistanceX + ', step: ' + this.options.step + ', difStepX: ' + difStepX + ', scrollOffset: ' + this.options.scrollOffset + ', maxX: ' + this.maxScrollX + ', minX: ' + this.options.scrollOffset);

                if (this.dir == 'forward') {
                    if (x > 0) {
                        x = left + difStepX;
                    } else {
                        x = left - difStepX;
                    }
                    if (y > 0) {
                        y = top + difStepY;
                    } else {
                        y = top - difStepY;
                    }
                } else {

                    if (x > 0) {
                        x = left - difStepX;
                    } else {
                        x = left + difStepX;
                    }
                    if (y > 0) {
                        y = top - difStepY;
                    } else {
                        y = top + difStepY;
                    }
                }

                if (x % this.options.step != 0) {
                    x = Math.round((x / this.options.step)) * this.options.step;
                }

                if (y % this.options.step != 0) {
                    y = Math.round((y / this.options.step)) * this.options.step;
                }

                x = x * flag1;
                y = y * flag2;

                time = this.options.stepTime || 200;
                if ((this.options.scrollType == 'x' && tdistanceX < 50) || (this.options.scrollType == 'y' && tdistanceY < 50)) time = 100;

                newX = x;
                newY = y;

                //        console.log('newX: ' + newX + '===' + newX / this.options.step);

                easing = this.options.bounceEasing;
            }

            if (newX != this.x || newY != this.y) {
                if (newX > this.options.scrollOffset || newX < this.maxScrollX || newY > this.options.scrollOffset || newY < this.maxScrollY) {
                    easing = utils.ease.quadratic;
                }
                if (time == 0) time = 1;

                this.scrollTo(newX, newY, time, easing);
                return;
            }

            this._execEvent('scrollEnd');
        },

        _resize: function () {
            var that = this;

            clearTimeout(this.resizeTimeout);

            this.resizeTimeout = setTimeout(function () {
                that.refresh();
            }, this.options.resizePolling);
        },

        _transitionTimingFunction: function (easing) {
            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;

            this.indicator && this.indicator.transitionTimingFunction(easing);
        },

        //开始或者停止动画
        _transitionTime: function (time) {
            time = time || 0;
            this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

            //滚动条，我们这里只会出现一个滚动条就不搞那么复杂了
            this.indicator && this.indicator.transitionTime(time);

        },

        getComputedPosition: function () {
            var matrix = window.getComputedStyle(this.scroller, null), x, y;

            matrix = matrix[utils.style.transform].split(')')[0].split(', ');
            x = +(matrix[12] || matrix[4]);
            y = +(matrix[13] || matrix[5]);

            return { x: x, y: y };
        },

        _initIndicator: function () {
            //滚动条
            var el = createDefaultScrollbar((this.options.scrollType == 'y' ? 'x' : 'y'));

            this.wrapper.appendChild(el);
            this.indicator = new Indicator(this, { el: el, scrollType: this.options.scrollType });

            this.on('scrollEnd', function () {
                this.indicator.fade();
            });

            var scope = this;
            this.on('scrollCancel', function () {
                scope.indicator.fade();
            });

            this.on('scrollStart', function () {
                scope.indicator.fade(1);
            });

            this.on('beforeScrollStart', function () {
                scope.indicator.fade(1, true);
            });

            this.on('refresh', function () {
                scope.indicator.refresh();
            });

            scope.indicator.fade(1);

        },

        //移动x，y这里比较简单就不分离y了
        _translate: function (x, y, isStep) {

            if (this.options.scrollType == 'y') {
                x = 0;
            } else {
                y = 0;
            }

            this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

            this.x = x;
            this.y = y;

            if (this.options.scrollbars) {
                this.indicator.updatePosition();
            }

        },

        resetPosition: function (time) {
            var x = this.x,
		y = this.y;

            time = time || 0;

            if (this.options.scrollType == 'x') {
                if (this.x >= this.options.scrollOffset) {
                    x = this.options.scrollOffset;
                } else if (this.x < this.maxScrollX) {
                    x = this.maxScrollX;
                }
            } else {
                if (this.y >= this.options.scrollOffset) {
                    y = this.options.scrollOffset;
                } else if (this.y < this.maxScrollY) {
                    y = this.maxScrollY;
                }
            }

            if ((this.options.scrollType == 'x' && x == this.x) || (this.options.scrollType == 'y' && y == this.y)) {
                return false;
            }

            this.scrollTo(x, y, time, this.options.bounceEasing);
            return true;
        },

        //移动
        scrollTo: function (x, y, time, easing) {
            easing = easing || utils.ease.circular;


            this.isInTransition = time > 0;

            if (!time || easing.style) {
                this._transitionTimingFunction(easing.style);
                this._transitionTime(time);
                this._translate(x, y);
            }
        },

        //统一的关闭接口
        disable: function () {
            this.enabled = false;
        },
        //统一的open接口
        enable: function () {
            this.enabled = true;
        },

        on: function (type, fn) {
            if (!this._events[type]) {
                this._events[type] = [];
            }

            this._events[type].push(fn);
        },

        _execEvent: function (type) {
            if (!this._events[type]) {
                return;
            }

            var i = 0,
			l = this._events[type].length;

            if (!l) {
                return;
            }

            for (; i < l; i++) {
                this._events[type][i].call(this);
            }
        },
        destroy: function () {
            this.TIMERRES && clearInterval(this.TIMERRES);
            this._initEvents(true);
            this._execEvent('destroy');
            this.indicator && this.indicator.destroy();

        },

        _transitionEnd: function (e) {
            if (e.target != this.scroller || !this.isInTransition) {
                return;
            }

            this._transitionTime();

            this._execEvent('animatEnd');

            if (!this.resetPosition(this.options.bounceTime)) {
                this.isInTransition = false;
                this._execEvent('scrollEnd');
            }
        },

        //事件具体触发点
        handleEvent: function (e) {
            switch (e.type) {
                case 'touchstart':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'mouseup':
                case 'touchcancel':
                case 'mousecancel':
                    this._end(e);
                    break;
                case 'orientationchange':
                case 'resize':
                    this._resize();
                    break;
                case 'transitionend':
                case 'webkitTransitionEnd':
                case 'oTransitionEnd':
                case 'MSTransitionEnd':
                    this._transitionEnd(e);
                    break;
            }
        }

    };

    function createDefaultScrollbar(direction) {
        var scrollbar = document.createElement('div'),
		indicator = document.createElement('div');

        scrollbar.style.cssText = 'position:absolute;z-index:9999';
        indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:.15rem';

        if (direction == 'y') {
            scrollbar.style.cssText += ';height:.35rem;left:.1rem;right:.1rem;bottom:0';
            indicator.style.height = '100%';
        } else {
            scrollbar.style.cssText += ';width:.35rem;bottom:.1rem;top:.1rem;right:1px';
            indicator.style.width = '100%';
        }

        scrollbar.style.cssText += ';overflow:hidden';

        scrollbar.appendChild(indicator);

        return scrollbar;
    }

    function Indicator(scroller, opts) {
        this.wrapper = typeof opts.el == 'string' ? document.querySelector(opts.el) : opts.el;
        this.indicator = this.wrapper.children[0];
        this.scrollType = opts.scrollType;

        this.wrapperStyle = this.wrapper.style;
        this.indicatorStyle = this.indicator.style;
        this.scroller = scroller;

        this.sizeRatioX = 1;
        this.sizeRatioY = 1;
        this.maxPosX = 0;
        this.maxPosY = 0;

        this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
        this.wrapperStyle[utils.style.transitionDuration] = '0ms';
        this.wrapperStyle.opacity = '0';
    }

    Indicator.prototype = {
        transitionTime: function (time) {
            time = time || 0;
            this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';
        },
        transitionTimingFunction: function (easing) {
            this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
        },
        refresh: function () {

            this.transitionTime();

            var r = this.wrapper.offsetHeight; // force refresh

            if (this.scrollType == 'y') {
                this.wrapperHeight = this.wrapper.clientHeight;

                this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                this.indicatorStyle.height = this.indicatorHeight + 'px';

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                this.sizeRatioY = (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
            } else {

                this.wrapperWidth = this.wrapper.clientWidth;

                this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                this.indicatorStyle.width = this.indicatorWidth + 'px';

                this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                this.sizeRatioX = (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
            }

            this.updatePosition();
        },
        destroy: function () {
            //remove bug
            $(this.wrapper).remove();
        },
        updatePosition: function () {
            var x = (this.scrollType == 'x') && Math.round(this.sizeRatioX * this.scroller.x) || 0,
			y = (this.scrollType == 'y') && Math.round(this.sizeRatioY * this.scroller.y) || 0;

            this.x = x;
            this.y = y;

            //不需要兼容方式了
            this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;

        },
        fade: function (val, hold) {
            if (hold && !this.visible) {
                return;
            }
            var scope = this;

            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;

            var time = val ? 250 : 500,
			delay = val ? 0 : 300;

            val = val ? '1' : '0';

            this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

            this.fadeTimeout = setTimeout((function (val) {
                scope.wrapperStyle.opacity = val;
                scope.visible = +val;
            })(val), delay);
        }
    };

    IScroll.utils = utils;

    return IScroll;

});
