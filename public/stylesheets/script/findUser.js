$("#new_password").hide();
$("#checkedpw").hide();
$("#notcheckpw").hide();

$('#findpassword').click(function(){
    let userid = $('#findID_id').val();
    let username = $('#findID_name').val();
    $.ajax({
        url : "findpw",
        type : "post",
        data : {
            userID: userid,
            userNAME : username
        },
        dataType : 'json',
        success : function(result){
            if(result == 0){
                alert('일치하는 회원 정보가 없습니다.');
            }else{
                alert('새로운 비밀번호를 입력해주세요!');
                $("#new_password").show();
                $("#find_password").hide();
            }
        },
        error : function(){
            alert("서버요청실패");
        }
    });
});

$("#new_password2").keyup(function(){
    var pwd1 = $("#new_password1").val();
    var pwd2 = $("#new_password2").val();
    if(pwd1 != "" || pwd2 != ""){
        if(pwd1 == pwd2) {
            $("#checkedpw").show();
            $("#notcheckpw").hide();
            $("#new_password_submit").removeAttr("disabled");
        }else{
            $("#checkedpw").hide();
            $("#notcheckpw").show();
            $("#new_password_submit").attr("disabled", "disabled");
        }
    }
});