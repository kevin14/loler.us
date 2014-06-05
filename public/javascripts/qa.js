define(['jquery'],function($){
	$('.ask-box .question-type').on('click',function(){
		$('.ask-box .question-type').each(function(){
			$(this).removeClass('selected');
		})
		$(this).addClass('selected');
	})


	$('.ask-box .submit').on('click',function(){
		var askData = {
			content:$('.ask-box .ask-textarea').val(),
			uid:1,
			type:$('.ask-box .question-type.selected').attr('type')
		}
		$.ajax({
			type:'POST',
			url:'/qa/postQuestion',
			data:askData,
			success:function(data){
				console.log(data)
			}
		})
	})

})