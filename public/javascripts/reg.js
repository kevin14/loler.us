define(['jquery'], function($) {
    $('.userRegBox .submit').on('click', function() {
        var data = {
            username: $('.userRegBox .username').val(),
            email: $('.userRegBox .email').val(),
            password: $('.userRegBox .password').val(),
            regId:$('.userRegBox .regId').val(),
            ccapCode:$('.userRegBox .ccapCode').val()
        }
        $.ajax({
            type: 'POST',
            url: '/users/postReg',
            data: data,
            success: function(data) {
                if (data.res_code == 1) {
                	console.log(data);
                }else{
                	console.log(data);
                    $('.userRegBox .regId').val(data.regId);
                    $('.userRegBox .ccapImg').attr('src','/users/ccap?regId='+data.regId);
                }
            }
        })
    })
});
