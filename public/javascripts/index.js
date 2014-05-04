define(['jquery'],function($){
	//个人信息提交 获取角色信息
	var formSubmit = $('.playerRole .submit');
	formSubmit.on('click',function(){
		var serverName = $('.playerRole .serverName').find("option:selected").text(),
			playerName = $('.playerRole .playerName').val();
		$.ajax({
			type:'POST',
			url:'/users/getPlayerInfo',
			data:{
				serverName:serverName,
				playerName:playerName
			},
			success:function(data){
				console.log(data);
			}
		})
	})
})