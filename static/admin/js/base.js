$(function () {
	app.init();
});

var app = {
	init() {
		this.toggleAside();
		this.deleteConfirm();
		this.resizeIframe();
		this.changeStatus();
		this.changeNum()
	},

	deleteConfirm() {
		$('.delete').click(function () {
			var flag = confirm('您确定要删除吗?');
			return flag;
		});
	},
	resizeIframe() {
		var heights = document.documentElement.clientHeight - 100;
		var rightMainObj=document.getElementById('rightMain');
	
		if(rightMainObj){
			rightMainObj.height = heights;
		}
	
	},
	toggleAside() {
		$('.aside h4').click(function () {
			$(this).siblings('ul').slideToggle();
		})
	},
	changeStatus: function () {
		$(".chStatus").click(function(){
			var id = $(this).attr("data-id");
			var model = $(this).attr("data-model");
			var field = $(this).attr("data-field");
			var el = $(this);
			// 发起get请求 跳转url 携带参数 回到函数
			$.get(`/admin/changeStatus`,{id:id,model:model,field:field},function(response){
				if (response.success){
					// 查找scr的传入的字符串是否有yes字段 indexOf没有找到返回-1
					// 不等于-1则是找到  找到将src的更换成no图标
					if(el.attr("src").indexOf("yes")!=-1){
						el.attr("src", "/admin/images/no.gif");
					}else{
						el.attr("src", "/admin/images/yes.gif");
					}
				}
			})
		})
	},
	changeNum:function(){
		$(".chSpanNum").click(function(){			
			var id = $(this).attr('data-id')
			var model = $(this).attr('data-model')
			var field = $(this).attr('data-field')
			var spanNum = $(this).html()

			var spanEl = $(this)
			var input = $("<input value='' style='width:60px'/>")
			$(input).trigger('focus').val(spanNum)
			$(this).html(input)

			$(input).click(function(e){
				e.stopPropagation()
			})
			$(input).blur(function(){
				var inputNum = $(this).val()
				if(inputNum>0){
					spanEl.html(inputNum) 
				}else{
					spanEl.html(0) 
				}

				$.get(`/admin/changeNum`,{id,model,field,inputNum},(response)=>{
					console.log(response.success);
				})
			})
			
			
		})
	}
};

$(window).resize(function () {
	app.resizeIframe()
})