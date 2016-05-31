define([], function () {
  var validators = {
    /**
     * 是否为Email
     * @method Util.cUtilValidate.isEmail
     * @param {String} agr1
     * @return {boolean} flag
     */
    isEmail: function (text) {
      var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return reg.test(text);
    },

    /**
     * 是否为合法密码，6-20位字母数字
     * @method Util.cUtilValidate.isPassword
     * @param {String} agr1
     * @return {boolean} flag
     */
    isPassword: function (text) {
      var reg = /^[a-zA-Z0-9]{6,20}$/;
      return reg.test(text);
    },

    /**
     * 是否为合法手机号
     * @method Util.cUtilValidate.isMobile
     * @param {string}  text
     * @returns {boolean}
     */
    isMobile: function (text) {
      var reg = /^(1[3-8][0-9])\d{8}$/;
      return reg.test(text);
    },
    /*
     * 判断是否是11位手机号 根据转诊业务扩展
     */
    _isMobile:function(text){
    	 var reg = /^\d{11}$/;
       return reg.test(text);
    },
    /**
     * 是否为中文字符
     * @method Util.cUtilValidate.isChinese
     * @param {string}  text
     * @returns {boolean}
     */
    isChinese: function (text) {
      var reg = /^[\u4e00-\u9fff]{0,}$/;
      return reg.test(text);
    },

    /**
     * 是否为英文字符
     * @method Util.cUtilValidate.isEnglish
     * @param {string}  text
     * @returns {boolean}
     */
    isEnglish: function (text) {
      var reg = /^[A-Za-z]+$/;
      return reg.test(text);
    },

    /**
     * 是否为6位数字邮编
     * @method Util.cUtilValidate.isZip
     * @param {string} text
     * @returns {boolean}
     */
    isZip: function (text) {
      var reg = /^\d{6}$/;
      return reg.test(text);
    },

    /**
     * 是否为日期格式字符串
     * @method Util.cUtilValidate.isDateStr
     * @param {string} text
     * @returns {boolean}
     */
    isDateStr: function (text) {
      //yyyyMMdd格式正则加入润年2月
      var reg = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)$/;
      if (!reg.test(text)) {
        return false;
      }
      return true;
    },

    /**
     * 是否为合法身份证有效证
     * @method Util.cUtilValidate.isIdCard
     * @param {String} text
     * @returns {boolean} flag
     */
    isIdCard: function (idCard) {
      var num = idCard.toLowerCase().match(/\w/g);
      if (idCard.match(/^\d{17}[\dx]$/i)) {
        var sum = 0, times = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        for (var i = 0; i < 17; i++)
          sum += parseInt(num[i], 10) * times[i];
        if ("10x98765432".charAt(sum % 11) != num[17]) {
          return false;
        }
        return !!idCard.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/, "$1-$2-$3");
      }
      if (idCard.match(/^\d{15}$/)) {
        return !!idCard.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/, "19$1-$2-$3");
      }
      return false;
    },


    /**
     * 是否为合法QQ号码
     * @method Util.cUtilValidate.isQq
     * @param {String} target
     * @returns {boolean} flag
     */
    isQq: function (target) {
      return /^[1-9]\d{4,}$/.test(target);
    },


    /**
     * 是否为合法Url
     * @method Util.cUtilValidate.isUrl
     * @param {String} target
     * @returns {boolean} flag
     */
    isUrl: function (target) {
      return /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(target);
    },

      /**
       * 判断银行卡号是否正确
       * @param cardNumber {String} or {Number}
       * @returns {boolean} flag
       */
    isCard: function (cardNumber) {
        return /^(\d{16}|\d{18,19})$/.test(cardNumber);
    },


    /**
     * 是否为合法Ip
     * @method Util.cUtilValidate.isIP
     * @param {String} text
     * @returns {boolean} flag
     */
    isIP: function (obj) { //是否为IP
      if (!obj || result.isNull(obj)) return false;

      var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //匹配IP地址的正则表达式
      if (re.test(obj)) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) return true;
      }

      return false;
    },


    isCharsLenWithinRange: function (value, max) {
      if (!result.isString(value)) return false;

      var reg = value.match(/\W/g);
      var length = reg == null ? value.length : value.length + reg.length;
      var isValidate = length >= 0 && length <= max;

      if (!isValidate) {
        return false;
      } else {
        this.cutLen = value.length;
      }

      return true;
    }
  };


  return validators;
});