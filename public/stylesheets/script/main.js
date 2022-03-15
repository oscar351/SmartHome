$(document).ready(function(){
    $('.hide').hide();

    setInterval(function() {
        $.ajax({
            url : "led1_check",
            type : "post",
            dataType : 'json',
            success : function(data){
                if(data == 1){
                    $('#example_default_1').prop("checked", true);
                }else{
                    $('#example_default_1').prop("checked", false);
                }
            }
        });
    }, 4000);

    setInterval(function() {
        $.ajax({
            url : "led2_check",
            type : "post",
            dataType : 'json',
            success : function(data){
                if(data == 1){
                    $('#example_default_2').prop('checked', true);
                }else{
                    $('#example_default_2').prop("checked", false);
                }
            }
        });
    }, 4000);

    setInterval(function() {
        $.ajax({
            url : "led3_check",
            type : "post",
            dataType : 'json',
            success : function(data){
                if(data == 1){
                    $('#example_default_3').prop('checked', true);
                }else{
                    $('#example_default_3').prop("checked", false);
                }
            }
        });
    }, 4000);

    $('#example_default_1').on('click',function(){
        if ( $(this).prop('checked') ) {
            $.ajax({
                url : "room1_on",
                type : "post",
                dataType : 'json',
                success : function(data){
                    if(data == 0){
                        $('#errormsg1').html('* 센서 접속 실패');
                    }else{
                        $('#errormsg1').html('');
                    }
                }
            });
        } else {
            $.ajax({
                url : "room1_off",
                type : "post",
                dataType : 'json',
                success : function(data){
                    if(data == 0){
                        $('#errormsg1').html('* 센서 접속 실패');
                    }else{
                        $('#errormsg1').html('');
                    }
                }
            });
        }
    });

    $('#example_default_2').on('click',function(){
        if ( $(this).prop('checked') ) {
            $.ajax({
                url : "room2_on",
                type : "post",
                dataType : 'json',
                success : function(data){
                    if(data == 0){
                        $('#errormsg1').html('* 센서 접속 실패');
                    }else{
                        $('#errormsg1').html('');
                    }
                }
            });
        } else {
            $.ajax({
                url : "room2_off",
                type : "post",
                dataType : 'json',
                success : function(data){
                    if(data == 0){
                        $('#errormsg1').html('* 센서 접속 실패');
                    }else{
                        $('#errormsg1').html('');
                    }
                }
            });
        }
    });

    $('#example_default_3').on('click',function(){
        if ( $(this).prop('checked') ) {
            $.ajax({
                url : "room3_on",
                type : "post",
                dataType : 'json',
                success : function(data){
                    if(data == 0){
                        $('#errormsg1').html('* 센서 접속 실패');
                    }else{
                        $('#errormsg1').html('');
                    }
                }
            });
        } else {
            $.ajax({
                url : "room3_off",
                type : "post",
                dataType : 'json',
                success : function(data){
                    if(data == 0){
                        $('#errormsg1').html('* 센서 접속 실패');
                    }else{
                        $('#errormsg1').html('');
                    }
                }
            });
        }
    });

    if($('#example_default_4').prop('checked') == false){
        $('#fanicon').attr('src','/stylesheets/image/fan_off.png');
    }else{
        $('#fanicon').attr('src','/stylesheets/image/fan_on.png');
    }

    setInterval(function() {
        $.ajax({
            url : "humid",
            type : "post",
            dataType : 'json',
            success : function(data){
                if(data == 0){
                    $('#errormsg').html('* 센서 접속 실패');
                    $('#temp1').html('00');
                    $('#humi1').html('00');
                }else{
                    $('#errormsg').html('');
                    $('#temp1').html(data[0]);
                    $('#humi1').html(data[1]);
                }
            }
        });
    }, 5000);

    $.ajax({
        url : "weather",
        type : "post",
        dataType : 'json',
        success : function(data){
            const arr = (data.munji).split(" ");
            const Ondo = (data.ondo).split("도");
            $('.weathercity5').html(data.address1);
            $('.weathercity').html(Ondo[1]);
            $('.weathercity1').html(data.nalsi);
            $('.weathercity2').html(data.humi);
            $('.weathercity3').html(data.wind);
            $('.weather_chart_mise').html(arr[4]);
            $('.mise').html(arr[5]);
            $('.weather_chart_chomi').html(arr[10]);
            $('.chomi').html(arr[11]);
            $('.weather_chart_sun').html(arr[16]);
            $('.sun').html(arr[17]);
            $('.weather_chart_rise').html(arr[22]);
            $('.rise').html(arr[23]);


            const dust1 = ['좋음', '보통', '나쁨', '매우나쁨']
            const dust2 = ['#32a1ff', '#00c73c', '#fd9b5a', '#fd5959']

            for(var i = 0; i < 4; i++){
                if(arr[5] == dust1[i]){
                    $('.mise').css('color', dust2[i]);
                }
            }

            for(var i = 0; i < 4; i++){
                if(arr[11] == dust1[i]){
                    $('.chomi').css('color', dust2[i]);
                }
            }

            for(var i = 0; i < 4; i++){
                if(arr[17] == dust1[i]){
                    $('.sun').css('color', dust2[i]);
                }
            }

            const weather1 = ['맑음', '흐림', '구름조금', '구름많음', '약한비', '비', '강한비', '약한눈', '눈', '강한눈', '흐린 후 갬', '비 후 갬', '눈 후 갬', '흐려져 비', '흐려져 눈']
            const weather2 = ['1', '7', '3', '5', '8', '9', '10', '11', '12', '13', '25', '27', '28', '29', '30']

            for(var i = 0; i< 15; i++){
                if(data.nalsi == weather1[i]){
                    $('.weathericon').attr('src', 'https://ssl.pstatic.net/sstatic/keypage/outside/scui/weather_new_new/img/weather_svg/icon_flat_wt' + weather2[i] + '.svg')
                }
            }
        },
        error : function(){
          $('.weathercity').html("서버에서 데이터를 불러오지 못하였습니다.");
        }
    });

    var typingtext = ($('.hide').text()).split("");
    var typingidx = 0;

    setInterval(function() {
        if(typingidx<typingtext.length){
            $('.gas_data_text').append(typingtext[typingidx]);
            typingidx++;
        }else{
            $('.gas_data_text').html("");
            typingidx=0;
        }
    },200);

    setInterval(function() {
        if($('#errormsg').text() == '* 센서 접속 실패'){
            $('.gas_data_text').hide();
        }else{
            $('.gas_data_text').show();
        }
    },1000);
    
});

$('#example_default_4').change(function(){
    if($('#example_default_4').prop('checked') == false){
        $('#fanicon').attr('src','/stylesheets/image/fan_off.png');
    }else{
        $('#fanicon').attr('src','/stylesheets/image/fan_on.png');
    }
});

$('#refresh').on('click',function(){
    $('#stream').attr('src','http://112.221.103.174:8091/?action=stream')
});