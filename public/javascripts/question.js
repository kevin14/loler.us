define(['jquery'],function($){

	$('.reply-box .submit').on('click',function(){
		var commentData = {
			content:$('.reply-box .reply-content').val(),
			qid:2,
			pid:0
		}
		$.ajax({
			type:'POST',
			url:'/question/postComment',
			data:commentData,
			success:function(data){
				console.log(data)
			}
		})
	})

})