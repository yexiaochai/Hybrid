define(['UISlider'], function (UISlider) {
  return _.inherit(UISlider, {
    propertys: function ($super) {
      $super();

      this.momentum = false;
      this.autoPlay = false;
      this.timerSrc = null;
      this.delaySec = 3000;
      this.playTime = 500;
      this.sliderNav = null;
      this.displayNum = 1;
      this.needLoop = true;

    },

    //循环播放
    play: function () {
      if (!this.autoPlay) return
      this.stop();
      this.timerSrc = setInterval($.proxy(function () {
        var index = this.index;
        index++;
        if (index == this.itemNum) index = 0
        this.setIndex(index, null, null, this.playTime);
      }, this), this.delaySec);
    },

    stop: function () {
      if (this.timerSrc) {
        clearInterval(this.timerSrc);
        this.timerSrc = null;
      }
    },

    //导航条
    //******这个接口没有封装好！！！
    createNav: function () {
      if (this.sliderNav) return;
      var nav = '<div class="cm-slide-bullet js_nav" style="position: absolute;">';
      for (var i = 0; i < this.itemNum; i++) {
        nav += '<span class="cm-bullet-item js_nav_item" data-index="' + i + '"></span>';
      }
      nav += '</div>';
      this.sliderNav = $(nav);

      //这块有点玄幻了，没有继承关系的话$swrapper是不存在的******
      this.swrapper.append(this.sliderNav);
      this._setNavPos();

      //这块地方z-index设置过高，会遮住header
//      this.setzIndexTop(this.sliderNav);
      this._setNavIndex(this.index);
    },

    //父级元素resize事件重写
    resizeRefresh: function ($super) {
      $super();
      this._setNavPos();
    },

    //******这块计算有问题暂时不予理睬，后续更改
    _setNavPos: function () {
      var left = (parseInt(this.wrapper.width()) - 2 * (this.itemNum * 8)) / 2; //居中计算LEFT值
//      this.sliderNav.css({'right': 'auto', 'top': 'auto', 'left': left, 'bottom': '10px', 'z-index': '500' });
        this.sliderNav.css({'right': 'auto', 'top': 'auto', 'left': left, 'bottom': '.5rem', 'z-index': '500' });
    },

    _addTouchEvent: function () {
      var scope = this;
      this._removeTouchEvent();

      var _handlerStop = function (e) {
        scope.stop();
      };

      var _handlerPlay = function (e) {
        scope.play();
      };

      this.$el.on('touchstart.imageslidertouchmove' + this.id, _handlerStop);
      this.$el.on('touchmove.imageslidertouchmove' + this.id, _handlerStop);
      this.$el.on('touchend.imageslidertouchmove' + this.id, _handlerPlay);

      this.$el.on('mousedown.imageslidertouchmove' + this.id, _handlerStop);
      this.$el.on('mousemove.imageslidertouchmove' + this.id, _handlerStop);
      this.$el.on('mouseup.imageslidertouchmove' + this.id, _handlerPlay);

    },

    _removeTouchEvent: function () {
      this.$el.off('.imageslidertouchmove' + this.id);
    },

    _setNavIndex: function (index) {
      this.sliderNav.find('.js_nav_item').removeClass('active');
      this.sliderNav.find('.js_nav_item[data-index="' + index + '"]').addClass('active');
    },

    changedAction: function (item) {
      this._setNavIndex(this.index);
    },

    addEvent: function ($super) {
      $super();
      this.on('onRefresh', function () {
        this.sliderNav = null;
      });

      this.on('onCreate', function () {
        this.$el.addClass('cm-slide--full-img');
      });
      
      this.on('onShow', function () {
        this.createNav();
        this.play();
        this._addTouchEvent();
      });

      this.on('onHide', function () {
        this.stop();
        this._removeTouchEvent();
      });
    }

  });
});
