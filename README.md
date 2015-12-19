模拟下拉
=========
简介
-----------
模拟select下拉框，新增autosearch功能

Example
-----------
定义放置下拉框的div容器，加入公共模板
```html
<div class="test1">
	<div class="dropdown-group" autosearch="true">
		<a href="javascript:;" class="dropdown-toggle" title="">
			<div class="dropdown-mask"></div>
			<input type="text" class="dropdown-input" name="" value="" />
			<input type="text" class="dropdown-attr" />
			<i class="dropdown-icon"></i>
		</a>
		<ul class="dropdown-list">
			<li class="it">
				<a href="javascript:;" class="dropdown-option" attr="111">测试1</a>
			</li>
			<li class="it">
				<a href="javascript:;" class="dropdown-option" attr="222">测试2</a>
			</li>
		</ul>
	</div>
</div>
```
引入样式文件，js文件
```
<link rel="stylesheet" type="text/css" href="../src/css/index.css">
<script type="text/javascript" src="../src/js/jquery.min.js"></script>
<script type="text/javascript" src="../src/js/index.js"></script>
```
实现下拉
```
<script type="text/javascript">
(function(){
	var test = dropDown({
		$el : 'div.test1'
	});
	test.on('change',function(a){
		console.log(a);
	});
})();
</script>
```

参数说明
----------
<pre><code>
html代码段autosearch: 是否开启autosearch功能
$el: 装载下拉的容器名（此处为.test1）
绑定change事件，function返回2个参数: 当前操作的下拉dom以及选项dom
</code></pre>

