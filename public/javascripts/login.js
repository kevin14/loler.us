define(['jquery'], function($) {
    $('.userLoginBox .submit').on('click', function() {
        var data = {
            username: $('.userLoginBox .username').val(),
            password: $('.userLoginBox .password').val()
        }
        $.ajax({
            type: 'POST',
            url: '/users/postLogin',
            data: data,
            success: function(data) {
                console.log(data);
            }
        })
    })
});
