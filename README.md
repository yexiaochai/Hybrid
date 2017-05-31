# Hybrid
经过之前的简单Hybrid框的实现，现在正在形成一个通用的Hybrid平台，详情请看博客介绍，代码会持续更新<br/>
Native Andriod代码由明月同学提供<br/>
Native iOS代码由Nil同学提供<br/>

# 博客地址

###整体设计博客
http://www.cnblogs.com/yexiaochai/p/4921635.html<br/>
http://www.cnblogs.com/yexiaochai/p/5524783.html



###ios博客
http://www.cnblogs.com/nildog/p/5536081.html#3440931



# 前端框架
后续会将此前端框架与此平台融合
https://github.com/yexiaochai/blade


# iOS哥们博客
http://www.cnblogs.com/nildog/p/5536081.html

# forward接口

### 基本使用（待补充）
{
  tagname: 'forward',
  param: {
    //需要去的页面
    topage: 'http://www.baidu.com',
    //以h5的方式打开上面的页面
    type: 'h5',
    //动画方式,暂时支持push(左进) pop(右出) present(下进,使用这种动画默认从下面返回)
    //该参数可以没有
    animate: 'push'

  }

}


