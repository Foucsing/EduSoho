define(function(require, exports, module) {
    var Validator = require('bootstrap.validator');
    require('common/validator-rules').inject(Validator);
    var Notify = require('common/bootstrap-notify');

    exports.run = function() {
        $('#bind-new-btn').on('click', function() {
            var $btn = $(this);

            if ($('#user_terms').length != 0) {
                if(!$('#user_terms').find('input[type=checkbox]').attr('checked')) {
                    Notify.danger('勾选同意此服务协议，才能继续注册！');
                    return;
                };
            };

            $('#bind-new-form-error').hide();
            $btn.button('loading');

            $.post($btn.data('url'), function(response) {
                if (!response.success) {
                    $('#bind-new-form-error').html(response.message).show();
                    return ;
                }
                Notify.success('登录成功，正在跳转至首页！');
                window.location.href = response._target_path;

            }, 'json').fail(function() {
                Notify.danger('登录失败，请重新登录后再试！');
            }).always(function() {
                $btn.button('reset');
            });

        });

        $('#user_terms').on('click', 'input[type=checkbox]', function() {
            if($(this).attr('checked')) {
                $(this).attr('checked',false);
            } else {
                $(this).attr('checked',true);
            };
        });

        var $form = $('#bind-exist-form');

        var validator = new Validator({
            element: $form,
            autoSubmit: false,
            onFormValidated: function(error, results, $form) {
                if (error) {
                    return false;
                }

                $form.find('[type=submit]').button('loading');
                $("#bind-exist-form-error").hide();

                $.post($form.attr('action'), $form.serialize(), function(response) {
                    if (!response.success) {
                        $("#bind-exist-form-error").html(response.message).show();
                        return ;
                    }

                    Notify.success('绑定帐号成功，正在跳转至首页！');
                    window.location.href = response._target_path;;

                }, 'json').fail(function() {
                    Notify.danger('绑定失败，请重新登录后再试。');
                }).always(function(){
                    $form.find('[type=submit]').button('reset');
                });

            }
        });


        validator.addItem({
            element: '#bind-email-field',
            required: true,
            rule: 'email'
        });

        validator.addItem({
            element: '#bind-password-field',
            required: true
        });

    };

});