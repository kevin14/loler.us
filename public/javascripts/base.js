define(['jquery', 'jquery-cookie'], function($, cookie) {

    var manageBoxLoginBox = $('.manage-box-login'),
    	username = $('.username'),
        manageBoxUnLoginBox = $('.manage-box-unlogin');

    if ($.cookie('accessToken')) {
    	changeToLogin();
    };


    function changeToLogin() {
    	username.text($.cookie('username'));
        manageBoxUnLoginBox.hide();
        manageBoxLoginBox.show();
    }

    function changeToUnLogin() {

    }
})
