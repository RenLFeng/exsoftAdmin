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