/**
 *自动缩放和定位页面中的元素
 * @since  1.0.1
 * @version 0.3
 * @param {Object}
 *          target:".csBox",  需要缩放的元素。 支持 # 和 . 号
 *          dw:900,  设计稿宽度
 *          dh:1624, 设计稿高度
 *          sw:750,  缩放规则宽度
 *          sh:1200, 缩放规则高度
 *          safeW:750, 安全区的宽度
 *          safeH:1200,安全区的高度
 *          offx:null,  页面宽度偏移值 默认为 null 自动计算 (sw-dw) /2 不建议设置
 *          offy:null, 页面高度偏移值 默认为 null 自动计算 (sh-dh) /2  不建议设置
 *          scaleAutoWidth:true, 当页面宽度超出安全范围时，是否自动缩放页面，以保证页面内容完整显示
 *          scaleAutoHeight:true,当页面高度超出安全范围时，是否自动缩放页面，以保证页面内容完整显示（当宽度已经缩放时，高度不进行缩放）
 *          change:function () {}, 改变回调每完成一个元素的适配回调一次
 *          complete:function () {},完成回调 当target 所有的元素全部适配完成时 回调
 *          scale:null,整体的缩放系数。默认为 null 自动计算。不建议设置
 *          width:window.innerWidth, 页面的宽度。 自动取值，不建议设置
 *          height:window.innerHeight, 页面高度。自动取值，不建议设置
 *
 *
 * 新增：iforce-type  iforce-x  iforce-y 三个标签
 * 当 设置iforce-type 标签时，忽略 left 和 top 的位置信息，根据  iforce-x，iforce-x 重新计算元素位置。
 * 且 元素位置 依据 窗口大小 进行定位。
 *
 *
 * @example
 * 页面元素设置  宽 高 x y cs-name 等内容；
 * <div class="csBox" iforce-type="left top" iforce-x="10" iforce-y="10" width="100" height="100" left="75" top="210"></div>
 * reset({
 *      dw:900,
 *      dh:1624,
 *      sw:750,
 *      sh:1200,
 *      change:function (data) {
 *                data.target  -当前缩放元素
 *                data.Eheight  -原始高度
 *                data.Ewidth 原始宽度
 *                data.scale 缩放系数
 *                data.Eleft原始 left
 *                data.Etop 原始 top
 *                data.newWidth 新的宽度度
 *                data.newHeight 新的高度
 *                data.marginLeft 新的margin-left
 *                data.marginTop 新的margin-top
 *      },
 *      complete:function (data) {
 *        //
 *
 *        data.targets 缩放元素列表（包含缩放信息）
 *        data.default 所有的缩放设置
 *        data.param 用户设置
 *        data.autoScaleW 宽度自动缩放的信息
 *        data.autoScaleH 高度自动缩放的信息
 *      }
 *  });
 *
 */

export const reset = (param: any) => {
  const _this: any = {};
  _this.default = {
    target: '.csBox',
    dw: 900,
    dh: 1624,
    sw: 750,
    sh: 1200,
    safeW: 750,
    safeH: 1200,
    offx: null,
    offy: null,
    transformOrigin: '50%',
    rotate: 0,
    scaleAutoWidth: true,
    scaleAutoHeight: true,
    change: () => {},
    complete: () => {},
    scale: null,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  _this.targets = [];
  _this.param = param || {};

  for (const key in _this.param) {
    _this.default[key] = _this.param[key];
    // for (const s in _this.param[key]) {
    //   _this.default[key][s] = _this.param[key][s];
    // }
  }

  if (_this.default.scale == null) {
    _this.default.scale = _this.default.height / _this.default.sh;
    _this.default.scale = getFloat(_this.default.scale, 4);
  }

  if (_this.default.offx == null) {
    _this.default.offx = (_this.default.sw - _this.default.dw) / 2;
  }

  if (_this.default.offy == null) {
    _this.default.offy = (_this.default.sh - _this.default.dh) / 2;
  }

  const strOne = _this.default.target.slice(0, 1);

  let targets: HTMLElement | HTMLCollectionOf<Element> | null;

  if (strOne == '#') {
    console.log('使用 ID 选择器');
    targets = document.getElementById(_this.default.target.slice(1));
  } else if (strOne == '.') {
    console.log('使用 类 选择器');
    targets = document.getElementsByClassName(_this.default.target.slice(1));
  } else {
    console.log('默认：使用类 选择器');
    targets = document.getElementsByClassName(_this.default.target);
  }

  const autoScaleW: any = {};

  if (_this.default.scaleAutoWidth == true) {
    //整体的偏移值 X
    autoScaleW.offsetX = (_this.default.width - _this.default.dw * _this.default.scale) / 2;
    autoScaleW.offsetX = getFloat(autoScaleW.offsetX, 4);

    //新的安全区域左侧坐标起点
    autoScaleW.safaX = ((_this.default.safeW - _this.default.dw) / 2) * _this.default.scale;
    autoScaleW.safaX = getFloat(autoScaleW.safaX, 4);

    //安全区是否被裁剪
    autoScaleW.isX = autoScaleW.offsetX < autoScaleW.safaX;

    //修正缩放系数，保证安全区显示
    autoScaleW.reScaleW = (autoScaleW.offsetX - autoScaleW.safaX) / _this.default.width;
    autoScaleW.reScaleW = getFloat(autoScaleW.reScaleW, 4);
    if (autoScaleW.isX) {
      _this.default.scale += autoScaleW.reScaleW;
      _this.default.scale = getFloat(_this.default.scale, 4);
      console.warn('根据宽度-缩放系数重新修订：', _this.default.scale);
    }
  }

  const autoScaleH: any = {};

  // 如果 允许自动缩放且宽度没有进行缩放，再进行高度的检测。节省资源。
  if (autoScaleW.isX == false && _this.default.scaleAutoHeight == true) {
    autoScaleH.newHeight = parseFloat((_this.default.dh * _this.default.scale).toFixed(3));
    //整体的偏移值 Y
    autoScaleH.offsetY = (_this.default.height - _this.default.dh * _this.default.scale) / 2;
    autoScaleH.offsetY = getFloat(autoScaleH.offsetY, 4);
    autoScaleH.safaY = ((_this.default.dh - _this.default.safeH) / 2) * _this.default.scale;
    autoScaleH.safaY = getFloat(autoScaleH.safaY, 4);
    autoScaleH.isY = autoScaleH.offsetY < autoScaleH.offsetY;
    //修正缩放系数，保证安全区显示
    autoScaleH.reScaleH = (autoScaleH.offsetY - autoScaleH.safaY) / _this.default.height;
    autoScaleH.reScaleH = getFloat(autoScaleH.reScaleH, 4);

    if (autoScaleH.isY) {
      _this.default.scale += autoScaleH.reScaleH;
      console.warn('根据高度-缩放系数重新修订：', _this.default.scale);
    }
  }

  _this.autoScaleW = autoScaleW;
  _this.autoScaleH = autoScaleH;
  //@ts-ignore
  for (let i = 0; i < targets?.length; i++) {
    //@ts-ignore
    const ele = targets[i];
    const cb = elemScale(ele);
    _this.targets.push(cb);
    ele.style.width = cb.newWidth + 'px';
    ele.style.height = cb.newHeight + 'px';
    ele.style.position = 'absolute';
    ele.style.marginLeft = cb.marginLeft + 'px';
    ele.style.marginTop = cb.marginTop + 'px';
    ele.style.transformOrigin = _this.default.transformOrigin;
    ele.style.transform = 'rotate(' + _this.default.rotate + 'deg)';

    _this.default.change(cb);
  }
  _this.default.complete(_this);

  //自定义 工具对象。
  function elemScale(ele: { getAttribute: (arg0: string) => string }) {
    const obj: any = {};
    obj.target = ele;

    obj.Eheight = parseFloat(ele.getAttribute('height'));
    obj.Ewidth = parseFloat(ele.getAttribute('width'));

    obj.Eleft = parseFloat(ele.getAttribute('left'));
    obj.Etop = parseFloat(ele.getAttribute('top'));

    obj.scale = _this.default.scale;
    obj.newWidth = obj.Ewidth * _this.default.scale;
    obj.newHeight = obj.Eheight * _this.default.scale;
    obj.marginLeft = (_this.default.width - _this.default.sw * _this.default.scale) / 2 + (obj.Eleft + _this.default.offx) * _this.default.scale;
    obj.marginTop = (_this.default.height - _this.default.sh * _this.default.scale) / 2 + (obj.Etop + _this.default.offy) * _this.default.scale;

    obj.Etype = ele.getAttribute('iforce-type');
    if (obj.Etype != null && obj.Etype != '') {
      //console.log("特殊配置")
      if (obj.Etype.indexOf(' ') != -1) {
        const type = obj.Etype.split(' ');
        obj.Tx = type[0] != null && type[0] != '' ? type[0] : null;
        obj.Ty = type[1] != null && type[1] != '' ? type[1] : null;
      } else {
        obj.Tx = obj.Etype;
        if (obj.Etype == 'center') {
          obj.Ty = 'center';
        } else {
          obj.Ty = 'top';
        }
      }

      //X 轴 Y轴 的距离值。

      obj.Xaxis = ele.getAttribute('iforce-x');
      obj.Yaxis = ele.getAttribute('iforce-y');

      obj.Xaxis = obj.Xaxis == null ? (obj.Xaxis = 0) : obj.Xaxis.indexOf('%') != -1 ? (parseInt(obj.Xaxis) / 100) * _this.default.width : parseInt(obj.Xaxis);

      obj.Yaxis = obj.Yaxis == null ? (obj.Yaxis = 0) : obj.Yaxis.indexOf('%') != -1 ? (parseInt(obj.Yaxis) / 100) * _this.default.height : parseInt(obj.Yaxis);

      console.log('-------------:' + obj.Xaxis, obj.Yaxis);

      //obj.Xaxis=parseInt(ele.getAttribute("iforce-x"));
      // obj.Yaxis=parseInt(ele.getAttribute("iforce-y"));

      // 值为空时 赋值为 0
      // obj.Xaxis=isNaN(obj.Xaxis) ? 0 : obj.Xaxis;
      // obj.Yaxis=isNaN(obj.Yaxis) ? 0 : obj.Yaxis;

      switch (obj.Tx) {
        case 'left':
          obj.marginLeft = obj.Xaxis;
          break;
        case 'center':
          obj.marginLeft = (_this.default.width - obj.newWidth) / 2 + obj.Xaxis;
          break;
        case 'right':
          obj.marginLeft = _this.default.width - obj.newWidth - obj.Xaxis;
          break;
        default:
          obj.marginLeft = obj.Xaxis;
          break;
      }
      switch (obj.Ty) {
        case 'top':
          obj.marginTop = obj.Yaxis;
          break;
        case 'center':
          obj.marginTop = (_this.default.height - obj.newHeight) / 2 + obj.Yaxis;
          break;
        case 'bottom':
          obj.marginTop = _this.default.height - obj.newHeight - obj.Yaxis;
          break;
        default:
          obj.marginTop = obj.Yaxis;
          break;
      }
    }

    return obj;
  }
};

const getFloat = function (n: string, x: number, str?: boolean) {
  let b = isNaN(Number(x)) ? (x = 2) : (x = Number(x));
  b == 0 ? (b = 2) : (b = b);

  const num = parseFloat(n);
  if (isNaN(num)) {
    console.error('需要填写正确的转换数值');
    return false;
  }

  const pow = Math.pow(10, b);
  let f_x = Math.round(num * pow) / pow;
  if (str == true) {
    let s_x = f_x.toString();
    const pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
      s_x += '.';
    }
    while (s_x.length <= b + 2) {
      s_x += '0';
    }
    f_x = Number(s_x);
  }
  return f_x;
};
