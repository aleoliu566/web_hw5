
// 臺北市, 新北市, 台中市, 臺南市, 高雄市, 基隆市, 桃園市, 新竹市, 新竹縣, 苗栗縣, 彰化縣
// 南投縣, 雲林縣, 嘉義市, 嘉義縣, 屏東縣, 宜蘭縣, 花蓮縣, 台東縣, 澎湖縣, 金門縣, 連江縣
var skycons = new Skycons();
// on Android, a nasty hack is needed: {"resizeClear": true}

// you can add a canvas by it's ID...
//skycons.add("today", Skycons.CLEAR_DAY);
skycons.add("today",Skycons.RAIN);
skycons.add("day1pic", Skycons.CLEAR_DAY);
skycons.add("day2pic", Skycons.CLEAR_DAY);
skycons.add("day3pic", Skycons.CLEAR_DAY);
// start animation!
skycons.play();

var barTitle = $("#barTitle");

var weatherCondition = $("#weatherCondition");
var weatherCon;
var day0date = $("#day0date");
var day1date = $("#day1date");
var day2date = $("#day2date");
var day3date = $("#day3date");

var day1forecastTemp = document.getElementById("day1forecastTemp");
var day2forecastTemp = document.getElementById("day2forecastTemp");
var day3forecastTemp = document.getElementById("day3forecastTemp");

var currentTemp;
// var cities = ["Taipei City", "New Taipei City", "Taichung City", "Tainan City", "Kaohsiung City", "Keelung City", "Taoyuan City", "Hsinchu City", "Miaoli City", "Changhua County", "Nantou County", "Yunlin County", "Chiayi City", "Chiayi County", "Pingtung County", "Yilan County", "Hualien County", "Taitung City", "Penghu County", "Kinmen County", "Matsu County"];
var citiesChinese = ["台北市","新北市","台中市","台南市","高雄市","基隆市","桃園市","新竹市","苗栗市","彰化縣","南投縣","雲林縣","嘉義市", "嘉義縣", "屏東縣", "宜蘭縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];
//暫存的天氣資料
var cityobject = [];
$("ul").empty();

$.each(citiesChinese, function(index, element) {
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D\""+citiesChinese[index]+"\")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    $.getJSON(url, function(data) {
        var front = data.query.results.channel.item;
        currentTemp = transition(front.condition.temp);
        list.children('a').text(list.text()+" "+currentTemp + "℃");
        //array中存參數 + 中文名稱object
        cityobject[index]= {data ,"object" : citiesChinese[index]};
        //第一個頁面
        if( cityobject[index].object === "台北市"){
          loadPage("台北市",front);
          icon(front);
        }
    });
    var list = $("<li class='listPart' role='presentation'><a role='menuitem' tabindex='-1' href='#'>" + citiesChinese[index] +"</a></li>");
    list.appendTo("ul");
});
/*
Get value from Bootstrap dropdown menu
*/
$('#dropdown li a').on('click', function() {
    var city=$(this).text().slice(0,$(this).text().length-4);
    for(var i=0 ; i < cityobject.length;i++){
      if(city === cityobject[i].object){
          var front = cityobject[i].data.query.results.channel.item;    
          loadPage(city,front);
          changeBarName(city,front);
          icon(front);
      }
    }
});
function changeBarName(city,front){
      //barTitle
      var cityTemp = front.condition.temp;
      var a = transition(cityTemp);
      var barTit = city + a + "℃";
      barTitle.text(barTit);
}
function loadPage(city,front){
      // 今日溫度
      var cityTemp = Math.round(((front.condition.temp) - 32) * 5 / 9 * 10) / 10;
      $(".temperature").text(cityTemp + "℃");

      //後三天日期
      weatherCon = front.condition.text;
      weatherCondition.text(" : " + weatherCon);

      var day0 = front.forecast[0].date;
      var day1 = front.forecast[1].date;
      var day2 = front.forecast[2].date;
      var day3 = front.forecast[3].date;

      day0date.text(day0);
      day1date.text(day1);
      day2date.text(day2);
      day3date.text(day3);
      // 天氣溫度預測
      var oneDayAfterTempHigh   =  transition(front.forecast[1].high);
      var oneDayAfterTempLow    =  transition(front.forecast[1].low);
      var twoDayAfterTempHigh   =  transition(front.forecast[2].high);
      var twoDayAfterTempLow    =  transition(front.forecast[2].low);
      var threeDayAfterTempHigh =  transition(front.forecast[3].high);
      var threeDayAfterTempLow  =  transition(front.forecast[3].low);

      day1forecastTemp.innerHTML = oneDayAfterTempLow   + "-" + oneDayAfterTempHigh   + '℃';
      day2forecastTemp.innerHTML = twoDayAfterTempLow   + "-" + twoDayAfterTempHigh   + '℃';
      day3forecastTemp.innerHTML = threeDayAfterTempLow + "-" + threeDayAfterTempHigh + '℃';    
}
function icon (front){
      var dayicon = ["today","day1pic","day2pic","day3pic"];
      for(var i = 0; i<dayicon.length ;i++){
        var daycode = parseInt(front.forecast[i].code);
        if(daycode === 1 || daycode === 3 || daycode === 4 || daycode === 9 || daycode === 10 || daycode === 11 || daycode === 12 || daycode === 35 || daycode === 37 ||daycode === 38 ||daycode === 39 || daycode === 40 || daycode === 45 ||daycode === 47 || daycode === 48 ){
           skycons.set(dayicon[i], Skycons.RAIN);                 //下雨
        }else if ( daycode === 26 || daycode === 26 || daycode === 28){
           skycons.set(dayicon[i], Skycons.CLOUDY);               //多雲
        }else if ( daycode === 32 ||daycode === 34 || daycode === 36){
           skycons.set(dayicon[i], Skycons.CLEAR_DAY);            //晴朗無雲的太陽
        }else if ( daycode === 31 ||daycode === 33){
           skycons.set(dayicon[i], Skycons.CLEAR_NIGHT);          //晴朗無雲的月亮
        }else if ( daycode === 30 || daycode === 44 ){
           skycons.set(dayicon[i], Skycons.PARTLY_CLOUDY_DAY);    //多雲但看得到太陽
        }else if ( daycode === 29){
           skycons.set(dayicon[i], Skycons.PARTLY_CLOUDY_NIGHT);  //多雲但看得到月亮
        }else if ( daycode === 5 || daycode === 6 || daycode === 7 || daycode === 8 || daycode === 17 || daycode === 18){
           skycons.set(dayicon[i], Skycons.SLEET);                //下雨雪
        }else if ( daycode === 13 || daycode === 14 || daycode === 15 || daycode === 16 || daycode === 41 || daycode === 42 || daycode === 43 ||daycode === 46){
           skycons.set(dayicon[i], Skycons.SNOW);                 //下雪
        }else if ( daycode === 0 ||daycode === 2 || daycode === 23 || daycode === 24 ||daycode === 25 ){
           skycons.set(dayicon[i], Skycons.WIND);                 //強風
        }else if ( daycode === 19|| daycode === 20 || daycode === 21 || daycode === 22){
           skycons.set(dayicon[i], Skycons.FOG);                  //濃霧
        }else{
          console.log("no");
        }
      }
}
function transition(temperature){
  temperature = Math.round((temperature - 32) * 5 / 9 );
  return temperature;
}
// Status API Training Shop Blog About