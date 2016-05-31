(function ($) {
  /***************************
  l_wang 提升点击响应速度
  *****************************/

  //需要用到的变量定义
  var trackingClick = false,
    trackingStart = 0, lastClickTime = 0, cancelNextClick = false, el = null, startX = 0, startY = 0, endX = 0, endY = 0, boundary = 4, isAndriond = navigator.userAgent.indexOf('Android') > 0, isIOS = /iP(ad|hone|od)/.test(navigator.userAgent), lastTouchIdentifier = 0, IOSWithBadTarget = isIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);

  function onTouchStart(e) {
    if (e.targetTouches.length > 1) {
      return true;
    }

    //改变获取焦点位置，解决获取焦点难问题
    el = e.target;

    var no_el = $(el).closest('.nofastclick');
    if (no_el.length > 0 || needFocus(el)) return true;

    if (isIOS) {
      var selection = window.getSelection();
      if (selection.rangeCount && !selection.isCollapsed) {
        return true;
      }

      if (e.targetTouches[0].identifier !== 0 && e.targetTouches[0].identifier === lastTouchIdentifier) {
        event.preventDefault();
        return false;
      }
      lastTouchIdentifier = e.targetTouches[0].identifier;
    }

    trackingClick = true;
    trackingStart = e.timeStamp;
    startX = e.targetTouches[0].pageX;
    startY = e.targetTouches[0].pageY;

    //解决用户修改服务器时间问题
    if (e.timeStamp - lastClickTime < 0) lastClickTime = e.timeStamp;

//    if (e.timeStamp - lastClickTime < 10) e.preventDefault();

    return true;
  }
  function onTouchMove(e) {
    if (!trackingClick) return true;
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;

    if (Math.abs(endX - startX) > boundary || Math.abs(endY - startY) > boundary) {
      el = null;
      trackingClick = false;
    }
    return true; ;
  }

  function onTouchEnd(e) {
    if (!trackingClick) return true;

//    if ((e.timeStamp - lastClickTime) < 10) { cancelNextClick = true; return true; }

    lastClickTime = e.timeStamp;
    trackingClick = false;
    var tagName = el.tagName.toLowerCase();
    if (tagName == 'label') {
      var forEl = findControl(el);
      if (forEl) {
        var _el = $(forEl);
        if (_el.attr('type') == 'checkbox' || _el.attr('type') == 'radio') {
          if (_el.attr('checked')) _el.removeAttr('checked');
          else _el.attr('checked', 'checked')
        } else {
          $(forEl).focus();
        }
        if (isAndriond) return false;
        el = forEl;
      }
    }

    else if (needFocus(el)) {
      if ((e.timeStamp - trackingStart) > 100) {
        el = null;
        return false;
      }
      //      if (IOSWithBadTarget) {
      //        //解决ios7点击问题，看着这个代码我真想打自己......
      //        el.blur();
      //      }

      var length;
      if (isIOS && el.setSelectionRange && el.type.indexOf('date') !== 0 && el.type !== 'time') {
        length = el.value.length;
        el.setSelectionRange(length, length);
      } else {
        el.focus();
      }

      if (tagName !== 'select') {
        el = null;
        e.preventDefault();
      }
      return false;
    }

    trackingStart = 0;

    if (!needClick(el)) {
      e.preventDefault();
      sendClick(el, e);
    }
    return false;
  }

  function onTouchCancel(e) {
    trackingClick = false;
    el = null;
  }
  function onMouse(e) {
    var el1 = e.target;
    var no_el = $(el1).closest('.nofastclick');
    if (no_el.length > 0 || needFocus(el1)) return true;

    if (!el) return true;
    if (e.touchEvent) return true; //表示为自己触发便跳出了
    if (!e.cancelable) return true;
    if (!needClick(el) || cancelNextClick) {
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      else e.propagationStopped = true;
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    return true;
  }
  function onClick(e) {
    //只有touchend才能让他为true，所以这里直接跳出了
    if (trackingClick) {
      trackingClick = false;
      el = null;
      return true;
    }
    if (e.target.type === 'submit' && e.detail === 0) return true;
    var permitted = onMouse(e);
    if (!permitted) el = null;
    return permitted;
  }
  function needClick(el) {
    switch (el.nodeName.toLowerCase()) {
      case 'button':
      case 'select':
      case 'textarea':
        if (el.disabled) return true;
        break;
      case 'input':
        if ((isIOS && el.type === 'file') || el.disabled) return true;
        break;
      //	    case 'label':              
      case 'video':
        return true;
    }
    return (/\bneedclick\b/).test(el.className);
  }
  function needFocus(el) {
    switch (el.nodeName.toLowerCase()) {
      case 'textarea':
      case 'select':
        return true;
      case 'input':
        switch (el.type) {
          case 'button':
          case 'checkbox':
          case 'file':
          case 'image':
          case 'radio':
          case 'submit':
            return false;
        }
        return !el.disabled && !el.readOnly;
      default:
        return (/\bneedfocus\b/).test(el.className);
    }
  }
  function findControl(el) {
    if (el.control !== undefined) return el.control;
    if (el.htmlFor) return document.getElementById(el.htmlFor);
    return el.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
  }
  function sendClick(el, e) {
    var clickEvent, touch;
    if (document.activeElement && document.activeElement !== el) {
      document.activeElement.blur();
    }
    touch = e.changedTouches[0];
    clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    clickEvent.touchEvent = true;
    el.dispatchEvent(clickEvent);
  }
  function needFast() {

    //    if (navigator.userAgent.indexOf('MQQBrowser') > 0) return false;
    if (typeof window.ontouchstart === 'undefined') return false;
    return true;
  }

  //该接口公开
  $.needFocus = needFocus;

  $.bindFastClick = function () {
    if (!needFast()) {
      return true;
    }

    $(document).ready(function () {
      if (isAndriond) {
        document.addEventListener('mouseover', onMouse, true);
        document.addEventListener('mousedown', onMouse, true);
        document.addEventListener('mouseup', onMouse, true);
      }
      document.addEventListener('click', onClick, true);
      $(document).on('touchstart', onTouchStart)
            .on('touchmove', onTouchMove)
            .on('touchend', onTouchEnd)
            .on('touchcancel', onTouchCancel);
    });
  }
  $.unbindFastClick = function () {
    if (!needFast()) {
      return true;
    }
    if (isAndriond) {
      document.removeEventListener('mouseover', onMouse, true);
      document.removeEventListener('mousedown', onMouse, true);
      document.removeEventListener('mouseup', onMouse, true);
    }
    document.removeEventListener('click', onClick, true);
    $(document).off('touchstart', onTouchStart)
        .off('touchmove', onTouchMove)
        .off('touchend', onTouchEnd)
        .off('touchcancel', onTouchCancel);
  }
})(Zepto)

