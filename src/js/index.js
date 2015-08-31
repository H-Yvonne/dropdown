/**
 * @author H.Yvonne
 * @create 2015.8.27
 */
(function(root,$,factory){
	if(typeof define === 'function' && (define.cmd || define.amd)){
		define(function(){
			return factory(root,$);
		});
	} else {
		root.dropDown = factory(root,$);
	}
})(window,$,function(root,$){
	var pubsub = {
		_handlers : '',
		on : function(etype,handler){
			if(typeof this._handlers !== 'object'){
				this._handlers = [];
			}
			if(!this._handlers[etype]){
				this._handlers[etype] = [];
			}
			if(typeof handler === 'function'){
				this._handlers[etype].push(handler);
			}
			return this;
		},
		emit : function(etype){
			var args = Array.prototype.slice.call(arguments,1);
			var handlers = this._handlers[etype] || [];
			for(var i = 0, l = handlers.length; i < l; i++){
				handlers[i].apply(null,args);
			}
			return this;
		}
	};

	var dropDown = function(config){
		var o;
		for(o in config){
			this[o] = config[o];
		}
		this.init();
	};

	$.extend(dropDown.prototype,pubsub,{
		$el : '',
		$warp : 'div.dropdown-group',
		$btn : 'a.dropdown-toggle',
		$input : 'input.dropdown-input',
		$active : 'dropdown-active',
		$option : 'a.dropdown-option'
	});

	$.extend(dropDown.prototype,pubsub,{
		init : function(){
			this.initSet();
			this.doAction();
		}
	});

	/*初始化操作*/
	$.extend(dropDown.prototype,pubsub,{
		initSet : function(){
			this.ableWrite();
			this.getList();
		},
		ableWrite : function(){
			var _self = this, warp = $(_self.$el).find(_self.$warp);
			_self.flag = warp.attr('autosearch');
			if(_self.flag === 'false'){
				warp.find(_self.$input).attr('disabled','disabled');
			} else {
				_self.autosearchFn();
			}
		},
		getList : function(){
			var _self = this,listData = [];
			var li = $(_self.$el).find('ul.dropdown-list .dropdown-option');
			li.each(function(){
				var id = $(this).attr('attr'), val = $(this).text();
				listData.push({'id' : id,'val' : val});
			});
			_self.listData = listData;
		}
	});

	/*点击显示隐藏下拉*/
	$.extend(dropDown.prototype,pubsub,{
		doAction : function(){
			this.clickFun();
			this.optionSel();
		},
		clickFun : function(){
			var _self = this;
			$(_self.$el).find(_self.$btn).unbind('click').bind('click',function(){
				_self.show($(this));
				if(_self.flag === 'true' && _self.listData.length === 0){
					_self.getList($(this));
					return;
				}
				_self.renderList(_self.listData,$(this));
			});
		},
		show : function(obj,lock){
			var _self = this,_warp = obj.parents('div.dropdown-group');
			if(_warp.hasClass(_self.$active)){
				if(lock) return;
				_warp.removeClass(_self.$active);
			} else {
				$(_self.$warp).removeClass(_self.$active);
				_warp.addClass(_self.$active);	
			}
			_self.hide();
		},
		/*click body to hide option list*/
		hide : function(){
			var _self = this;
			$('body').click(function(e){
				var target = e.target;
				if (!$(target).closest(_self.$warp).length){
					$(_self.$warp).removeClass(_self.$active);
				}
			});
		}
	});

	/*option select and change the value*/
	$.extend(dropDown.prototype,pubsub,{
		optionSel : function(){
			var _self = this;
			_self.oldVal = $(_self.$input).val();
			$(_self.$el).on('click',_self.$option,function(){
				var values = $(this).html(),attr = $(this).attr('attr'),warp = $(this).parents('div.dropdown-group');
				warp.find(_self.$input).val(values).attr('data-attr',attr);
				$(_self.$warp).removeClass(_self.$active);
				_self.changeFn(values,warp,attr);
			});
		},
		changeFn : function(values,obj,attr){
			var _self = this;
			if(_self.oldVal !== values){
				_self.emit('change',attr,obj);
				_self.oldVal = values;
				_self.doAction();
			}
		}
	}); 

	/*autosearch*/
	$.extend(dropDown.prototype,pubsub,{
		autosearchFn : function(){
			this.inputFun();
		},
		inputFun : function(){
			var _self = this;
			$(_self.$input).bind('keyup',function(){
				var val = $(this).val();
				if(!val){
					_self.renderList(_self.listData,$(this));
					return;
				}
				_self.filterFn(val,$(this));
				_self.show($(this),true);
			}).bind('blur',function(){
				var val = $(this).val();
				if(!val){
					$(this).val('').attr('data-attr','');
				} else {
					var data = _self.listData,k = 0;
					for(var i in data){
						if(data[i].val == val){
							$(this).val(data[i].val).attr('data-attr',data[i].id);
							break;
						}
						k++;
					}
					if(k == data.length){
						$(this).val('');
					}
				}
			});
		},
		renderList : function(data,obj){
			var _self = this, ul = obj.parents('div.dropdown-group').find('ul.dropdown-list');
			ul.html('');
			for(var i in data){
				var html = '<li class="it">'+
								'<a href="javascript:;" class="dropdown-option" attr="'+data[i].id+'">'+data[i].val+'</a>'+
							'</li>';
				ul.append(html);
			}
		},
		filterFn : function(val,obj){
			var _self = this, data = _self.listData, newdata = [];
			for(var i in data){
				if(data[i].val.indexOf(val) > -1){
					newdata.push(data[i]);
				}
			}
			_self.renderList(newdata,obj);
		}
	});
	
	return function(config){
		return dropdown = new dropDown(config);
	};
});