define(['jquery'], function($) {
    //个人信息提交 获取角色信息
    var formSubmit = $('.playerRole .submit');
    formSubmit.on('click', function() {

        var serverName = $('.playerRole .serverName').find("option:selected").text(),
            playerName = $('.playerRole .playerName').val();

        if (playerName == "") {
            //日后换成友好的方式
            alert("请填写角色名！");
            return;
        } else {
            $('.playerRole .title').text("正在查询玩家信息...");
            $('.playerinfo_form').css({
                "display": "none"
            });
            $.ajax({
                type: 'POST',
                url: '/users/getPlayerInfo',
                data: {
                    serverName: serverName,
                    playerName: playerName
                },
                success: function(data) {
                    console.log(data);
                }
            })
        }
    })
})
