$('document').ready(function () {

  var area0 = ["기준 선택", "일 별", "주 별", "월 별"];
  var area1 = [];
  var area2 = [];
  var area3 = [];
  var area4 = [];

  $.ajax({
    url: "graph_search",
    type: "post",
    dataType: 'json',
    success: function (data) {
      var newDate = new Date(data);
      var newDate2 = new Date(data);
      var curDate = newDate;
      var curDate2 = new Date(data);
      var curDate3 = new Date(data);
      var curDate4 = new Date(data);
      var nowDate = new Date();
      var curDate2_mon = curDate2.getMonth();
      var nowDate_mon = nowDate.getMonth();
      var weekDate = new Date(data);
      
      while(curDate <= nowDate){
        var _mon_ = (curDate.getMonth()+1);
        var _day_ = curDate.getDate();
        area1.push(_mon_ + '-' + _day_);
        curDate.setDate(curDate.getDate() + 1);
      }


      while(curDate2_mon <= nowDate_mon){
        var _mon_ = (curDate2.getMonth()+1);
        area3.push(_mon_ + '월');
        curDate2_mon += 1;
      }

      while(curDate3 <= nowDate){
        var _mon_ = (curDate3.getMonth()+1);
        var _day_ = curDate3.getDate();
        var _mon2_ = (weekDate.getMonth()+1);
        var _day2_ = (weekDate.getDate()+7);
        area2.push(_mon_ + '-' + _day_);
        area4.push(_mon2_ + '-' + _day2_);
        curDate3.setDate(curDate3.getDate()+7);
        weekDate.setDate(weekDate.getDate()+7);
      }


    },
    error: function () {
    }
  });

  $("select[class^=select_1]").each(function () {
    $date = $(this);
    $.each(eval(area0), function () {
      $date.append("<option value='" + this + "'>" + this + "</option>");
    });
    $date.next().append("<option value=''>기준 선택</option>");
  });

  $("select[class^=select_1]").change(function () {
    var area = "area" + $("option", $(this)).index($("option:selected", $(this)));
    var $select_2 = $(this).next();
    $("option", $select_2).remove();

    if (area == "area0")
      $select_2.append("<option value=''>기준 선택</option>");
    else if(area == "area2"){
      for(var i = 0; i < area2.length; i++){
        $select_2.append("<option value='" + area2[i] + "'>" + area2[i] + " ~ " + area4[i] + "</option>");
      }
      
    }else {
      $.each(eval(area), function () {
        $select_2.append("<option value='" + this + "'>" + this + "</option>");
      });
    }
  });


});