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

<h1>前言</h1>
<p>接上文：（阅读本文前，建议阅读前两篇文章先）</p>
<p><a href="http://www.cnblogs.com/yexiaochai/p/4921635.html">浅谈Hybrid技术的设计与实现</a></p>
<p><a href="http://www.cnblogs.com/yexiaochai/p/5524783.html">浅谈Hybrid技术的设计与实现第二弹</a></p>
<p>根据之前的介绍，大家对前端与Native的交互应该有一些简单的认识了，很多朋友就会觉得这个交互很简单嘛，其实并不难嘛，事实上单从Native与前端的交互来说就那点东西，真心没有太多可说的，但要真正做一个完整的Hybrid项目却不容易，要考虑的东西就比较多了，单从这个交互协议就有：</p>
<p>① URL Schema</p>
<p>② JavaScriptCore</p>
<p>两种，到底选择哪种方式，每种方式有什么优势，都是我们需要深度挖掘的，而除此之外，一个Hybrid项目还应该具有以下特性：</p>
<p>① 扩展性好&mdash;&mdash;依靠好的约定</p>
<p>② 开发效率高&mdash;&mdash;依赖公共业务</p>
<p>③ 交互体验好&mdash;&mdash;需要解决各种兼容问题</p>
<p>我们在实际工作中如何落地一个Hybrid项目，如何推动一个项目的进行，这是本次我们要讨论的，也希望对各位有用。</p>
<p>文中是我个人的一些开发经验，希望对各位有用，也希望各位<span style="color: #ff0000;"><strong>多多支持讨论</strong></span>，指出文中<strong>不足</strong>以及提出您的一些<span style="color: #ff0000;"><strong>建议</strong></span>。</p>
<p><strong>设计类博客</strong></p>
<p><a href="http://www.cnblogs.com/yexiaochai/p/4921635.html">http://www.cnblogs.com/yexiaochai/p/4921635.html</a><br /><a href="http://www.cnblogs.com/yexiaochai/p/5524783.html">http://www.cnblogs.com/yexiaochai/p/5524783.html</a></p>
<p><a id="user-content-ios博客" class="anchor" href="https://github.com/yexiaochai/Hybrid#ios博客"></a><strong>iOS博客</strong></p>
<p><a href="http://www.cnblogs.com/nildog/p/5536081.html#3440931">http://www.cnblogs.com/nildog/p/5536081.html#3440931</a></p>
<p><strong>Android博客</strong></p>
<p><a href="https://home.cnblogs.com/u/vanezkw" target="_blank">https://home.cnblogs.com/u/vanezkw</a></p>
<p><strong>代码地址：<a href="https://github.com/yexiaochai/Hybrid" target="_blank">https://github.com/yexiaochai/Hybrid</a></strong></p>
<p>因为IOS不能扫码下载了，大家自己下载下来用模拟器看吧，下面开始今天的内容。</p>
<p><strong><span style="color: #ff0000;">总体概述在第一章，有兴趣大家去看</span></strong></p>
<p><strong><span style="color: #ff0000;">细节设计在第二章，有兴趣大家去看</span></strong></p>
<p><strong><span style="color: #ff0000;">本章主要为打补丁</span></strong></p>
<h1>边界问题</h1>
<p>在我们使用Hybrid技术前要注意一个边界问题，什么项目适合Hybrid什么项目不适合，这个要搞清楚，适合Hybrid的项目为：</p>
<p><span style="color: #ff0000;"><strong>① 有60%以上的业务为H5</strong></span></p>
<p><span style="color: #ff0000;"><strong>② 对更新（开发效率）有一定要求的APP</strong></span></p>
<p>不适合使用Hybrid技术的项目有以下特点：</p>
<p>① 只有20%不到的业务使用H5做</p>
<p>② 交互效果要求较高（动画多）</p>
<p>任何技术都有适用的场景，千万不要妄想推翻已有APP的业务用H5去替代，最后会证明那是自讨苦吃，当然如果仅仅想在APP里面嵌入新的实验性业务，这个是没问题的。</p>
<h1>交互约定</h1>
<p>根据之前的学习，我们知道与Native交互有两种交互：</p>
<p>① URL Schema</p>
<p>② JavaScriptCore</p>
<p>而两种方式在使用上各有利弊，首先来说URL Schema是比较稳定而成熟的，如果使用上文中提到的&ldquo;ajax&rdquo;交互方式，会比较灵活；而从设计的角度来说JavaScriptCore似乎更加合理，但是我们在实际使用中却发现，注入的时机得不到保障。</p>
<p>iOS同事在实体JavaScriptCore注入时，我们的原意是在webview载入前就注入所有的Native能力，而实际情况是页面js已经执行完了才被注入，这里会导致Hybrid交互失效，如果你看到某个Hybrid平台，突然header显示不正确了，就可能是这个问题导致，所以JavaScriptCore就被我们弃用了。</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">JavaScriptCore可能导致的问题：
① 注入时机不唯一（也许是BUG）
② 刷新页面的时候，JavaScriptCore的注入在不同机型表现不一致，有些就根本不注入了，所以全部hybrid交互失效</span></pre>
</div>
<p>如果非要使用JavaScriptCore，为了解决这一问题，我们做了一个兼容，用URL Schema的方式，在页面逻辑载入之初执行一个命令，将native的一些方式重新载入，比如：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #000000;">_.requestHybrid({
</span><span style="color: #008080;">2</span>     tagname: 'injection'
<span style="color: #008080;">3</span> });</pre>
</div>
<p>这个能解决一些问题，但是有些初始化就马上要用到的方法可能就无力了，比如：</p>
<p>① 想要获取native给予的地理信息</p>
<p>② 想要获取native给予的用户信息（直接以变量的方式获取）</p>
<p>作为生产来讲，我们还是求稳，所以最终选择了URL Schema。</p>
<p>明白了基本的边界问题，选取了底层的交互方式，就可以开始进行初步的Hybrid设计了，但是这离一个可用于生产，可离落地的Hybrid方案还比较远。</p>
<h1>账号体系</h1>
<p>一般来说，一个公司的账号体系健壮灵活程度会很大程度反映出这个研发团队的整体实力：</p>
<p>① 统一的鉴权认证</p>
<p>② 短信服务图形验证码的处理</p>
<p>③ 子系统的权限设计、公共的用户信息导出</p>
<p>④ 第三方接入方案</p>
<p>⑤ 接入文档输出</p>
<p>⑥ ......</p>
<p>这个技术方案，有没有是一回事（说明没思维），有几套是一回事（说明比较乱，技术不统一），对外的一套做到了什么程度又是一回事，当然这个不是我们讨论的重点，而账号体系也是Hybrid设计中不可或缺的一环。</p>
<p>账号体系涉及了接口权限控制、资源访问控制，现在有一种方案是，前端代码不做接口鉴权，账号一块的工作全部放到native端。</p>
<h3>native代理请求</h3>
<p>在H5想要做某一块老的App业务，这个APP80%以上的业务都是Native做的，这类APP在接口方面就没有考虑过H5的感受，会要求很多信息如：</p>
<p>① 设备号</p>
<p>② 地理信息</p>
<p>③ 网络情况</p>
<p>④ 系统版本</p>
<p>有很多H5拿不到或者不容易拿到的公共信息，因为H5做的往往是一些比较小的业务，像什么个人主页之类的不重要的业务，Server端可能不愿意提供额外的接口适配，而使用额外的接口还有可能打破他们统一的某些规则；加之native对接口有自己的一套公共处理逻辑，所以便出了Native代理H5发请求的方案，公共参数会由Native自动带上。</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #008000;">//</span><span style="color: #008000;">暂时只关注hybrid调试,后续得关注三端匹配</span>
<span style="color: #008080;"> 2</span> <span style="color: #000000;">_.requestHybrid({
</span><span style="color: #008080;"> 3</span>     tagname: 'apppost'<span style="color: #000000;">,
</span><span style="color: #008080;"> 4</span> <span style="color: #000000;">    param: {
</span><span style="color: #008080;"> 5</span>         url: <span style="color: #0000ff;">this</span><span style="color: #000000;">.url,
</span><span style="color: #008080;"> 6</span> <span style="color: #000000;">        param: params
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;">    },
</span><span style="color: #008080;"> 8</span> 
<span style="color: #008080;"> 9</span>     callback: <span style="color: #0000ff;">function</span><span style="color: #000000;"> (data) {
</span><span style="color: #008080;">10</span> <span style="color: #000000;">        scope.baseDataValidate(data, onComplete, onError);
</span><span style="color: #008080;">11</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">12</span> });</pre>
</div>
<p>这种方案有一些好处，接口统一，前端也不需要关注接口权限验证，但是这个会带给前端噩梦！</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">前端相对于native一个很大的优点，就是调试灵活，这种代理请求的方式，会限制请求只能在APP容器中生效，对前端调试造成了很大的痛苦</span></pre>
</div>
<p>从真实的生产效果来说，也是很影响效率的，容易导致后续前端再也不愿意做那个APP的业务了，所以使用要慎重......</p>
<h3>注入cookie</h3>
<p>前端比较通用的权限标志还是用cookie做的，所以Hybrid比较成熟的方案仍旧是注入cookie，这里的一个前提就是native&amp;H5有一套统一的账号体系（统一的权限校验系统）。</p>
<p>因为H5使用的webview可以有独立的登录态，如果不加限制太过混乱难以维护，比如：</p>
<p>我们在qq浏览器中打开携程的网站，携程站内第三方登录可以唤起qq，然后登录成功；完了qq浏览器本来也有一个登录态，发现却没有登录，点击一键登录的时候再次唤起了qq登录。</p>
<p>当然，qq作为一个浏览器容器，不应该关注业务的登录，他这样做是没问题的，但是我们自己的一个H5子应用如果登录了的话，便希望将这个登录态同步到native，这里如果native去监控cookie的变化就太复杂了，通用的方案是：</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">Hybrid APP中，所有的登录走Native提供的登录框</span></pre>
</div>
<p>每次打开webview native便将当前登录信息写入cookie中，由此前端就具有登录态了，登录框的唤起在接口处统一处理：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #008000;">/*</span>
<span style="color: #008080;"> 2</span> <span style="color: #008000;">无论成功与否皆会关闭登录框
</span><span style="color: #008080;"> 3</span> <span style="color: #008000;">参数包括：
</span><span style="color: #008080;"> 4</span> <span style="color: #008000;">success 登录成功的回调
</span><span style="color: #008080;"> 5</span> <span style="color: #008000;">error 登录失败的回调
</span><span style="color: #008080;"> 6</span> <span style="color: #008000;">url 如果没有设置success，或者success执行后没有返回true，则默认跳往此url
</span><span style="color: #008080;"> 7</span> <span style="color: #008000;">*/</span>
<span style="color: #008080;"> 8</span> HybridUI.Login = <span style="color: #0000ff;">function</span><span style="color: #000000;"> (opts) {
</span><span style="color: #008080;"> 9</span> <span style="color: #000000;">};
</span><span style="color: #008080;">10</span> <span style="color: #008000;">//</span><span style="color: #008000;">=&gt;</span>
<span style="color: #008080;">11</span> <span style="color: #000000;">requestHybrid({
</span><span style="color: #008080;">12</span>     tagname: 'login'<span style="color: #000000;">,
</span><span style="color: #008080;">13</span> <span style="color: #000000;">    param: {
</span><span style="color: #008080;">14</span>         success: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () { },
</span><span style="color: #008080;">15</span>         error: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () { },
</span><span style="color: #008080;">16</span>         url: '...'
<span style="color: #008080;">17</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">18</span> <span style="color: #000000;">});
</span><span style="color: #008080;">19</span> <span style="color: #008000;">//</span><span style="color: #008000;">与登录接口一致，参数一致</span>
<span style="color: #008080;">20</span> HybridUI.logout = <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">21</span> };</pre>
</div>
<h3>账号切换&amp;注销</h3>
<p>账户注销本没有什么注意点，但是因为H5 push了一个个webview页面，这个重新登录后这些页面怎么处理是个问题。</p>
<p>我们这边设计的是一旦重新登录或者注销账户，所有的webview都会被pop掉，然后再新开一个页面，就不会存在一些页面展示怪异的问题了。</p>
<h1>公共业务的设计-体系化</h1>
<p>在Hybrid架构中（其实就算在传统的业务中也是），会存在很多公共业务，这部分公共业务很多是H5做的（比如注册、地址维护、反馈等，登录是native化了的公共业务），我们一个Hybrid架构要真正的效率高，就得把各种公共业务做好了，不然单是H5做业务，效率未必会真的比Native高多少。</p>
<p>底层框架完善并且统一后，便可以以规范的力量限制各业务开发，在统一的框架下开发出来的公共业务会大大的提升整体工作效率，这里以注册为例，一个公共页面一般来说得设计成这个样子：</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">公共业务代码，应该可以让人在URL参数上对页面进行一定定制化，这里URL参数一般要独特一些，一面被覆盖，这个设计适用于native页面</span></pre>
</div>
<p><img src="http://images2015.cnblogs.com/blog/294743/201610/294743-20161021092853310-403691261.png" alt="" width="345" height="384" /></p>
<p>URL中会包含以下参数：</p>
<p>① _hashead 是否有head，默认true</p>
<p>② _hasback 是否包含回退按钮，默认true</p>
<p>③ _backtxt 回退按钮的文案，默认没有，这个时候显示为回退图标</p>
<p>④ _title 标题</p>
<p>⑤ _btntxt 按钮的文案</p>
<p>⑥ _backurl 回退按钮点击时候的跳转，默认为空则执行history.back</p>
<p>⑦ _successurl 点击按钮回调成功时候的跳转，必须</p>
<p>只要公共页面设计为这个样子，就能满足多数业务了，在底层做一些适配，可以很轻易的一套代码同时用于native与H5，这里再举个例子：</p>
<p>如果我们要点击成功后去到一个native页面，如果按照我们之前的设计，<span style="color: #ff0000;">我们每个Native页面皆已经URL化了的话</span>，我们完全可以以这种方向跳转：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #000000;">requestHybrid({
</span><span style="color: #008080;">2</span>     tagname: 'forward'<span style="color: #000000;">,
</span><span style="color: #008080;">3</span> <span style="color: #000000;">    param: {
</span><span style="color: #008080;">4</span>         topage: 'nativeUrl'<span style="color: #000000;">,
</span><span style="color: #008080;">5</span>         type: 'native'
<span style="color: #008080;">6</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">7</span> });</pre>
</div>
<p>这个命令会生成一个这样的url的链接：</p>
<p>_successurl == hybrid://forward?param=%7B%22topage%22%3A%22nativeUrl%22%2C%22type%22%3A%22native%22%7D</p>
<p>完了，在点击回调时要执行一个H5的URL跳转：</p>
<div class="cnblogs_code">
<pre>window.location = _successurl</pre>
</div>
<p>而根据我们之前的hybrid规范约定，这种请求会被native拦截，于是就跳到了我们想要的native页面，整个这一套东西就是我们所谓的体系化：</p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201610/294743-20161021101439998-866868341.png" alt="" width="653" height="545" /></p>
<h1>离线更新</h1>
<p>根据之前的约定，Native中如果存在静态资源，也是按频道划分的：</p>
<div class="cnblogs_code">
<pre>webapp <span style="color: #008000;">//</span><span style="color: #008000;">根目录</span>
<span style="color: #000000;">├─flight
├─hotel </span><span style="color: #008000;">//</span><span style="color: #008000;">酒店频道</span>
│  │  index.html <span style="color: #008000;">//</span><span style="color: #008000;">业务入口html资源，如果不是单页应用会有多个入口</span>
│  │  main.js <span style="color: #008000;">//</span><span style="color: #008000;">业务所有js资源打包</span>
<span style="color: #000000;">│  │
│  └─static </span><span style="color: #008000;">//</span><span style="color: #008000;">静态样式资源</span>
<span style="color: #000000;">│      ├─css 
│      ├─hybrid </span><span style="color: #008000;">//</span><span style="color: #008000;">存储业务定制化类Native Header图标</span>
<span style="color: #000000;">│      └─images
├─libs
│      libs.js </span><span style="color: #008000;">//</span><span style="color: #008000;">框架所有js资源打包</span>
<span style="color: #000000;">│
└─static </span><span style="color: #008000;">//</span><span style="color: #008000;">框架静态资源样式文件</span>
<span style="color: #000000;">    ├─css
    └─images</span></pre>
</div>
<p>我们这里制定一个规则，native会过滤某一个规则的请求，检查本地是否有该文件，如果本地有那么就直接读取本地，比如说，我们会将这个类型的请求映射到本地：</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">http://domain.com/webapp/flight/static/hybrid/icon-search.png
//===&gt;&gt;
file ===&gt; flight/static/hybrid/icon-search.png</span></pre>
</div>
<p>这样在浏览器中便继续读取线上文件，在native中，如果有本地资源，便读取本地资源：</p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201610/294743-20161021113531935-1353611748.png" alt="" width="640" height="555" /></p>
<p>但是我们在真实使用场景中却遇到了一些麻烦。</p>
<h3>增量的粒度</h3>
<p>其实，我们最开始做增量设计的时候就考虑了很多问题，但是真实业务的时候往往因为时间的压迫，做出来的东西就会很简陋，这个只能慢慢迭代，而我们所有的缓存都会考虑两个问题：</p>
<p>① 如何存储&amp;读取缓存</p>
<p>② 如何更新缓存</p>
<p>浏览器的缓存读取更新是比较单纯的：</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">浏览器只需要自己能读到最新的缓存即可</span></pre>
</div>
<p>而APP的话，会存在最新发布的APP希望读到离线包，而老APP不希望读到增量包的情况（老的APP下载下来增量包压根不支持），更加复杂的情况是想对某个版本做定向修复，那么就需要定向发增量包了，这让情况变得复杂，而复杂即错误，我们往往可以以简单的约定，解决复杂的场景。</p>
<p>思考以下场景：</p>
<p>我们的APP要发一个新的版本了，我们把最初一版的静态资源给打了进去，完了审核中的时候，我们老版本APP突然有一个临时需求要上线，我知道这听起来很有一些扯淡，但这种扯淡的事情却真实的发生了，这个时候我们如果打了增量包的话，那么最新的APP在审核期间也会拉到这次代码，但也许这不是我们所期望的，于是有了以下与native的约定：</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">Native请求增量更新的时候带上版本号，并且强迫约定iOS与Android的大版本号一致，比如iOS为2.1.0Android这个版本修复BUG可以是2.1.1但不能是2.2.0</span></pre>
</div>
<p>然后在服务器端配置一个较为复杂的版本映射表：</p>
<div class="cnblogs_code">
<pre><span style="color: #000000;">## 附录一   
</span><span style="color: #008000;">//</span><span style="color: #008000;"> 每个app所需的项目配置</span>
const APP_CONFIG =<span style="color: #000000;"> [
   </span>'surgery' =&gt; [        <span style="color: #008000;">//</span><span style="color: #008000;"> 包名</span>
        'channel' =&gt; 'd2d',      <span style="color: #008000;">//</span><span style="color: #008000;"> 主项目频道名</span>
        'dependencies' =&gt; ['blade', 'static', 'user'],    <span style="color: #008000;">//</span><span style="color: #008000;"> 依赖的频道</span>
        'version' =&gt; [   <span style="color: #008000;">//</span><span style="color: #008000;"> 各个版本对应的增量包范围，取范围内版本号最大的增量包</span>
            '2.0.x' =&gt; ['gte' =&gt; '1.0.0', 'lt' =&gt; '1.1.0'<span style="color: #000000;">],    
            </span>'2.2.x' =&gt; ['gte' =&gt; '1.1.0', 'lt' =&gt; '1.2.0'<span style="color: #000000;">]
        ],
        </span>'version_i' =&gt; [    <span style="color: #008000;">//</span><span style="color: #008000;"> ios需特殊配置的某版本</span>
<span style="color: #000000;">
        ],
        </span>'version_a' =&gt; [    <span style="color: #008000;">//</span><span style="color: #008000;"> Android需特殊配置的某版本</span>
<span style="color: #000000;">
        ]
    ]
];</span></pre>
</div>
<p>这里解决了APP版本的读取限制，完了我们便需要关心增量的到达率与更新率，我们也会担心我们的APP读到错误的文件。</p>
<h3>更新率</h3>
<p>我们有时候想要的是一旦增量包发布，用户拿着手机就马上能看到最新的内容了，而这样需要app调用增量包的频率增高，所以我们是设置每30分钟检查一次更新。</p>
<h3>正确读取</h3>
<p>这里可能有点杞人忧天，因为Native程序不是自己手把手开发的，总是担心APP在正在拉取增量包时，或者正在解压时，读取了静态文件，这样会不会读取错误呢，后面想了想，便继续采用了之前的md5打包的方式，将落地的html中需要的文件打包为md5引用，如果落地页下载下来后，读不到本地文件就自己会去拉取线上资源咯。&nbsp;</p>
<h1>调试</h1>
<div class="cnblogs_code">
<pre><span style="color: #800000;">一个Hybrid项目，要最大限度的符合前端的开发习惯，并且要提供可调试方案</span></pre>
</div>
<p>我们之前说过直接将所有请求用native发出有一个最大的问题就是调试不方便，而正确的hybrid的开发应该是有70%以上的时间，纯业务开发者不需要关心native联调，当所有业务开发结束后再内嵌简单调一下即可。</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">因为调试时候需要读取测试环境资源，需要server端qa接口有个全局开关，关闭所有的增量读取</span></pre>
</div>
<p>关于代理调试的方法已经很多人介绍过了，我这里不再多说，说一些native中的调试方案吧，其实很多人都知道。</p>
<h3>iOS</h3>
<p>首先，你需要拥有一台Mac机，然后打开safari；在偏好设置中将开发模式打开：</p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201610/294743-20161021135555295-1074787038.png" alt="" width="451" height="341" /></p>
<p>然后打开模拟器，即可开始调试咯：</p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201610/294743-20161021135750732-334503085.png" alt="" width="456" height="213" /></p>
<h3>Android</h3>
<p>Android需要能翻墙的chrome，然后输入chrome://inspect/#devices即可，前提是native同事为你打开调试模式，当然Android也可以使用模拟器啦，但是Android的真机表现过于不一样，还是建议使用真机测试。</p>
<h1>一些坑点</h1>
<h3>不要命就用swift</h3>
<p>苹果官方出了swift，于是我们iOS团队好事者尝试了感觉不错，便迅速在团队内部推广了起来，而我们OC本身的体量本来就有10多万行代码量，我们都知道一个道理：</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">重构一时爽，项目火葬场</span></pre>
</div>
<p>而重构过程中肯定又会遇到一些历史问题，或者一些第三方库，代码总会有一点尿不尽一点冗余，而不知道swift是官方有问题还是怎么回事，每次稍微多一些改动就需要<span style="color: #ff0000;"><strong>编译一个多小时</strong></span>！！！！你没看错，是要编译一个多小时。</p>
<p>一次，我的小伙伴在打游戏，被我揪着说了两句，他说他在编译，我尼玛很不屑的骂了他，后面开始调iOS时，编译了2小时！！！从那以后看见他打游戏我一点脾气都没有了！！！</p>
<p>这种编译的感觉，就像吃坏了肚子，在厕所蹲了半天却什么也没拉出来一样！！！所以，不要命就全部换成swift吧。</p>
<div class="cnblogs_code">
<pre><span style="color: #800000;">如果有一定历史包袱的业务，或者新业务，最好不要全面使用新技术，不成熟的技术，如果有什么不可逆的坑，那么会连一点退路都没有了。</span></pre>
</div>
<h3>iOS静态资源缓存</h3>
<p>Android有一个全局开关，控制静态资源部读取缓存，但是iOS中研究了好久，都没有找到这个开关，而他读取缓存又特别厉害，所以所有的请求资源在有增量包的情况下，最好加上时间戳或者md5</p>
<h3>Android webview兼容</h3>
<p>Android webview的表现不佳，闪屏等问题比较多，遇到的几个问题有：</p>
<p>① 使用hybrid命令（比如跳转），如果点击快了的话，Android因为响应慢要开两个新页面，需要对连续点击做冻结</p>
<p>② 4.4以下低版本不能捕获js回调，意思是Android拿不到js的返回值，一些特殊的功能就做不了，比如back容错</p>
<p>③ ......</p>
<h1>一些小特性</h1>
<p>为了让H5的表现更加像native我们会约定一些小的特性，这种特性不适合通用架构，但是有了会更有亮点。</p>
<h3>回退更新</h3>
<p>我们在hybrid中的跳转，事实上每次都是新开一个webview，当A-&gt;B的时候，事实上A只是被隐藏了，当B点击返回的时候，便直接将A展示了出来，而A不会做任何更新，对前端来说是无感知的。</p>
<p>事实上，这个是一种优化，为了解决这种问题我们做了一个下拉刷新的特性：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">_.requestHybrid({
</span><span style="color: #008080;"> 2</span>     tagname: 'headerrefresh'<span style="color: #000000;">,
</span><span style="color: #008080;"> 3</span> <span style="color: #000000;">    param: {
</span><span style="color: #008080;"> 4</span>         <span style="color: #008000;">//</span><span style="color: #008000;">下拉时候展示的文案</span>
<span style="color: #008080;"> 5</span>         title: '123'
<span style="color: #008080;"> 6</span> <span style="color: #000000;">    },
</span><span style="color: #008080;"> 7</span>     <span style="color: #008000;">//</span><span style="color: #008000;">下拉后执行的回调,强暴点就全部刷新</span>
<span style="color: #008080;"> 8</span>     callback: <span style="color: #0000ff;">function</span><span style="color: #000000;">(data) {
</span><span style="color: #008080;"> 9</span> <span style="color: #000000;">        location.reload();
</span><span style="color: #008080;">10</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">11</span> });</pre>
</div>
<p>但，这个总没有自动刷新来的舒服，于是我们在页面第一次加载的时候约定了这些事件：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #008000;">//</span><span style="color: #008000;"> 注册页面加载事件</span>
<span style="color: #008080;"> 2</span> <span style="color: #000000;"> _.requestHybrid({
</span><span style="color: #008080;"> 3</span>      tagname: 'onwebviewshow'<span style="color: #000000;">,
</span><span style="color: #008080;"> 4</span>      callback: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;"> 5</span>         
<span style="color: #008080;"> 6</span> <span style="color: #000000;">     }
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;"> });
</span><span style="color: #008080;"> 8</span> <span style="color: #008000;">//</span><span style="color: #008000;"> 注册页面影藏事件</span>
<span style="color: #008080;"> 9</span> <span style="color: #000000;">_.requestHybrid({
</span><span style="color: #008080;">10</span>     tagname: 'onwebviewhide'<span style="color: #000000;">,
</span><span style="color: #008080;">11</span>     callback: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">12</span>         scope.loopFlag = <span style="color: #0000ff;">false</span><span style="color: #000000;">;
</span><span style="color: #008080;">13</span> <span style="color: #000000;">        clearTimeout(scope.t);
</span><span style="color: #008080;">14</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">15</span> });</pre>
</div>
<p>在webview展示的时候触发，和在webview隐藏的时候触发，这样用户便可以做自动数据刷新了，但是局部刷新要做到什么程度就要看开发的时间安排了，技术好时间多自然体验好。</p>
<h3>header-搜索</h3>
<p>根据我们之前的约定，header是比较中规中矩的，但是由于产品和视觉强迫，我们实现了一个不一样的header，最开始虽然不太乐意，做完了后感觉还行......</p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201610/294743-20161021144301951-1124689622.png" alt="" width="393" height="357" /></p>
<p>这块工作量主要是native的，我们只需要约定即可：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #0000ff;">this</span><span style="color: #000000;">.header.set({
</span><span style="color: #008080;"> 2</span>     view: <span style="color: #0000ff;">this</span><span style="color: #000000;">,
</span><span style="color: #008080;"> 3</span>     <span style="color: #008000;">//</span><span style="color: #008000;">左边按钮</span>
<span style="color: #008080;"> 4</span> <span style="color: #000000;">    left: [],
</span><span style="color: #008080;"> 5</span>     <span style="color: #008000;">//</span><span style="color: #008000;">右边按钮</span>
<span style="color: #008080;"> 6</span> <span style="color: #000000;">    right: [{
</span><span style="color: #008080;"> 7</span>         tagname: 'cancel'<span style="color: #000000;">,
</span><span style="color: #008080;"> 8</span>         value: '取消'<span style="color: #000000;">,
</span><span style="color: #008080;"> 9</span>         callback: <span style="color: #0000ff;">function</span><span style="color: #000000;"> () {
</span><span style="color: #008080;">10</span>             <span style="color: #0000ff;">this</span><span style="color: #000000;">.back();
</span><span style="color: #008080;">11</span> <span style="color: #000000;">        }
</span><span style="color: #008080;">12</span> <span style="color: #000000;">    }],
</span><span style="color: #008080;">13</span>     <span style="color: #008000;">//</span><span style="color: #008000;">searchbox定制</span>
<span style="color: #008080;">14</span> <span style="color: #000000;">    title: {
</span><span style="color: #008080;">15</span>         <span style="color: #008000;">//</span><span style="color: #008000;">特殊tagname</span>
<span style="color: #008080;">16</span>         tagname: 'searchbox'<span style="color: #000000;">,
</span><span style="color: #008080;">17</span>         <span style="color: #008000;">//</span><span style="color: #008000;">标题,该数据为默认文本框文字</span>
<span style="color: #008080;">18</span>         title: '取消'<span style="color: #000000;">,
</span><span style="color: #008080;">19</span>         <span style="color: #008000;">//</span><span style="color: #008000;">没有文字时候的占位提示</span>
<span style="color: #008080;">20</span>         placeholder: '搜索医院、科室、医生和病症'<span style="color: #000000;">,
</span><span style="color: #008080;">21</span>         <span style="color: #008000;">//</span><span style="color: #008000;">是否默认进入页面获取焦点</span>
<span style="color: #008080;">22</span>         focus: <span style="color: #0000ff;">true</span><span style="color: #000000;">,
</span><span style="color: #008080;">23</span> 
<span style="color: #008080;">24</span>         <span style="color: #008000;">//</span><span style="color: #008000;">文本框相关具有的回调事件</span>
<span style="color: #008080;">25</span>         <span style="color: #008000;">//</span><span style="color: #008000;">data为一个json串</span>
<span style="color: #008080;">26</span>         <span style="color: #008000;">//</span><span style="color: #008000;">editingdidbegin 为点击或者文本框获取焦点时候触发的事件</span>
<span style="color: #008080;">27</span>         <span style="color: #008000;">//</span><span style="color: #008000;">editingdidend 为文本框失去焦点触发的事件</span>
<span style="color: #008080;">28</span>         <span style="color: #008000;">//</span><span style="color: #008000;">editingchanged 为文本框数据改变时候触发的事件</span>
<span style="color: #008080;">29</span>         type: ''<span style="color: #000000;">,
</span><span style="color: #008080;">30</span>         data: '' <span style="color: #008000;">//</span><span style="color: #008000;">真实数据</span>
<span style="color: #008080;">31</span> <span style="color: #000000;">    },
</span><span style="color: #008080;">32</span>     callback: <span style="color: #0000ff;">function</span><span style="color: #000000;">(data) {
</span><span style="color: #008080;">33</span>         <span style="color: #0000ff;">var</span> _data =<span style="color: #000000;"> JSON.parse(data);
</span><span style="color: #008080;">34</span>         <span style="color: #0000ff;">if</span> (_data.type == 'editingdidend' &amp;&amp; <span style="color: #0000ff;">this</span>.keyword !=<span style="color: #000000;"> $.trim(_data.data)) {
</span><span style="color: #008080;">35</span>             <span style="color: #0000ff;">this</span>.keyword =<span style="color: #000000;"> $.trim(_data.data);
</span><span style="color: #008080;">36</span>             <span style="color: #0000ff;">this</span><span style="color: #000000;">.reloadList();
</span><span style="color: #008080;">37</span> <span style="color: #000000;">        }
</span><span style="color: #008080;">38</span> 
<span style="color: #008080;">39</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">40</span> });</pre>
</div>
<h1>结语</h1>
<p>希望此文能对准备接触Hybrid技术的朋友提供一些帮助，关于Hybrid的系列这里是最后一篇实战类文章介绍，这里是demo期间的一些效果图，后续git库的代码会再做整理：</p>
<p>&nbsp;<img src="http://images2015.cnblogs.com/blog/294743/201606/294743-20160601004113649-207778484.png" alt="" width="315" height="587" /></p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201606/294743-20160601004124164-626003581.png" alt="" width="319" height="586" /></p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201606/294743-20160601004107149-785084090.png" alt="" width="319" height="314" /></p>
<h3>落地项目</h3>
<p>真实落地的业务为医联通，有兴趣的朋友试试：</p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201610/294743-20161021145241310-898764340.png" alt="" /></p>
<p><img src="http://images2015.cnblogs.com/blog/294743/201610/294743-20161021145316810-1438515093.png" alt="" width="488" height="896" /></p>
<h3>推动感悟</h3>
<p>从项目调研到项目落地再到最近一些的优化，已经花了三个月时间了，要做好一件事是不容易的，而且我们这个还涉及到持续优化，和配套业务比如：</p>
<p>① passport</p>
<p>② 钱包业务</p>
<p>③ 反馈业务</p>
<p>.....</p>
<p>等同步制作，很多工作的意义，或者作用，是非技术同事看不到的，但是如果我们不坚持做下去，迫于业务压力或者自我松懈放纵，那么就什么也没有了，我们要推动一件事情，不可能一站出来就说，嘿，小样，我们这个不错，你拿去用吧，这样人家会猜疑你的，我们一定是要先做一定demo让人有一定初步印象，再强制或者偷偷再某一个生产业务试用，一方面将技术依赖弄进去，一方面要告诉其他同事，看看嘛，也没有引起多大问题嘛，呵呵。</p>
<p>做事难，推动难，难在坚持，难在携手共进，这里面是需要信念的，在此尤其感谢团队3个伙伴的无私付出（杨杨、文文、文文）。</p>
<p>后续，我们在持续推动hybrid建设的同时，会尝试React Native，找寻更好的更适合自己的解决方案。</p>
<p><strong>微博求粉</strong></p>
<p>最后，我的微博粉丝极其少，如果您觉得这篇博客对您哪怕有一丝丝的帮助，微博求粉博客求赞！！！</p>
<p><a href="http://weibo.com/u/2013900244?s=6uyXnP" target="_blank"><img id="view_img" src="http://service.t.sina.com.cn/widget/qmd/2013900244/b48b0477/1.png?rnd=1406031295210" alt="" border="0" /></a></p>
