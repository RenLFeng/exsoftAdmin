export const filterKey = v => {
  return Object.keys(v)

}
export const nowDate = (v) => {
  let date = new Date();
  if (v) {
    date = new Date(v);
  }
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var day = date.getDay();
  return m + '月' + d + '日' + timeWeekHummanread(day);
}
export const timeWeekHummanread = v => {
  let wobj = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    0: '星期日'
  };
  if (wobj[v]) {
    return wobj[v];
  }
  return '';
}
export const getDate = (date) => {
  var base = new Date(date).getTime()
  var oneDay = 24 * 3600 * 1000;
  var date = [];
  var data = [Math.random() * 300];
  var time = new Date(base);
  date.push([time.getFullYear(), time.getMonth() + 1, time.getDate()].join('/'));
  for (var i = 1; i < 7; i++) {
    var now = new Date(base -= oneDay);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
  }
  var newdate = date.reverse()
  // console.log(newdate)
  return newdate;

}

//! cjy: 得到图表数据的日期; 需要占位符，不足0补0， 如 2019/12/01
export const getChartDate = (ndays, date)=>{
   let enddate = date? new Date(date): new Date(); //!  new Date为本地时区 China Standard Time
   //console.log(enddate);
   let dates = [];
   let basetime = new Date(enddate).getTime();
   let oneday = 24 * 3600 * 1000;
   for(let i=0; i<=ndays; i++){
     let cur = new Date(basetime);
     //console.log(cur);
     basetime -= oneday;
     let m = cur.getMonth() + 1;
     let d = cur.getDate();
     let dayarray = [cur.getFullYear()+'', m<10? '0'+m:''+m,
         d<10?'0'+d:''+d];
     dates.push(dayarray.join('/'));
   }
   return dates.reverse();
}

//! cjy: 分许得分情况
export const parseChartScoreData = (ed, wa, days, enddate)=>{
    //! 清空原数据
    ed.xAxis.data = [];
    for (let v of ed.series){
        v.data = [];
    }

    let datearray = getChartDate(days, enddate);
    ed.xAxis.data = datearray;
    //! 首先对原数据进行按日期归类整理
    let scoredatas = {};
    for(let i=0; i<wa.length; i++){
      let cdate = wa[i].countdate;
      if (typeof scoredatas[cdate] == 'undefined'){
        scoredatas[cdate] = [];
      }
      scoredatas[cdate].push(wa[i]);
    }
    //console.log(scoredatas);
    for(let i = 0; i<datearray.length; i++){
      let scoredata = null;
      {
        if (scoredatas[datearray[i]]){
          scoredata = scoredatas[datearray[i]];
        }
      }

      if (!scoredata){
        scoredata = [];
      }
      for (let v of ed.series){
        let curdata = 0;
        let usescore = null;
        //console.log(v.matchuserid);
        if (v.matchuserid){
          //for(let us of scoredata)
            for(let j=0; j<scoredata.length; j++)
          {
            let us = scoredata[j];
          //  console.log(us);
            if (us.userid == v.matchuserid){
              usescore = us;
              break;
            }
          }
        }
        else{
          if (scoredata.length){
            usescore = scoredata[0];
          }
        }
        //console.log(usescore);
        if (usescore){
            if(v.matchcol){
                if (typeof usescore[v.matchcol] != 'undefined'){
                    curdata = Number(usescore[v.matchcol]);
                }
            }
        }
        v.data.push(curdata);
      }
    }
}

//! cjy: 分析周报数据
export const parseChartWeekData = (ed, wa, days, enddate)=>{

   //! 清空原数据
    ed.xAxis.data = [];
    for (let v of ed.series){
      v.data = [];
    }

    let datearray = getChartDate(days, enddate);
    //console.log(datearray);
    ed.xAxis.data = datearray;
    let adddata = {};
    for(let i=0; i<datearray.length; i++){
        let scoredata = null;
        for(let j=0; j<wa.length; j++){
            if (wa[j].countdate == datearray[i]){
                scoredata = wa[j];
                //! 删除，减少下次遍历的循环次数
                wa.splice(j, 1);
                break;
            }
        }
        if (!scoredata){
            scoredata = {};
        }
        for (let v of ed.series){
            let curdata = 0;

            if (v.matchcol){
                let usedata = 0;
                if (typeof scoredata[v.matchcol] != 'undefined'){
                    usedata = Number(scoredata[v.matchcol]);
                }
                if (v.isadd){
                    if (typeof adddata[v.matchcol] == 'undefined'){
                        adddata[v.matchcol] = 0;
                    }
                    adddata[v.matchcol] += (usedata);
                    curdata = adddata[v.matchcol];
                }
                else{
                    curdata = usedata;
                }
            }
            v.data.push(curdata);
        }

    }
}


export const getFileType = (v) => {
  const arr = [{
      id: 0,
      name: '其它'
    },
    {
      id: 1,
      name: '图片类'
    },

    {
      id: 2,
      name: '视频类'
    },
    {
      id: 3,
      name: '音频类'
    },
    {
      id: 4,
      name: '文档类'
    },
    {
      id: 100,
      name: '网页链接'
    },
  ];
  for (let item of arr) {
    if (item.id == v) {
      return item.name;
    }
  }

}
export const compare = (name, type) => {
  return function (obj1, obj2) {
    let value1 = obj1[name];
    let value2 = obj2[name];
    if (type) {
      if (value2 > value1) {
        return -1;
      } else if (value2 < value1) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (value2 > value1) {
        return 1;
      } else if (value2 < value1) {
        return -1;
      } else {
        return 0;
      }
    }

  }
}

export const parseURL = (url) =>{
  var query = url && url.split('?')[1]
  var queryArr = query && query.split('&')
  var params = {}
  queryArr &&
    queryArr.forEach(function (item) {
      var key = item.split('=')[0]
      var value = item.split('=')[1]
      params[key] = value
    })
  return params
}

export const echartColor = ()=>{
  return ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
}