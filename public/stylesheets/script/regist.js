const btn = document.querySelector('#checkid');
const userid = document.querySelector('#id');
    $("#userid_msg1").hide();
    $("#userid_msg2").hide();
    $("#checkedpw").hide();
    $("#notcheckpw").hide();

    $('#id').keyup(function(){
        let userID = $('#id').val();        
        $.ajax({
            url : "checkid",
            type : "post",
            data : {userID: userID},
            dataType : 'json',
            success : function(result){
                if(result == 0){
                    $('#userid_msg1').show();
                    $("#userid_msg2").hide();
                    $("#go").attr("disabled", "disabled");
                }else{
                    $('#userid_msg2').show();
                    $("#userid_msg1").hide();
                    $("#go").removeAttr("disabled");
                }
            },
            error : function(){
                alert("서버요청실패");
            }
        });
    });

    $('#semail').change(function(){
        $("#semail option:selected").each(function(){
            if($(this).val() == '99'){
                $("#emaddress").val('');
                $("#emaddress").attr("disabled", false);
            }else{
                $("#emaddress").val($(this).text());
                $("#emaddress").attr("disabled", false);
            }
        });
    });

    $("#password2").keyup(function(){
        var pwd1 = $("#password1").val();
        var pwd2 = $("#password2").val();
        if(pwd1 != "" || pwd2 != ""){
            if(pwd1 == pwd2) {
                $("#checkedpw").show();
                $("#notcheckpw").hide();
                $("#go").removeAttr("disabled");
            }else{
                $("#checkedpw").hide();
                $("#notcheckpw").show();
                $("#go").attr("disabled", "disabled");
            }
        }
    });