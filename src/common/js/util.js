var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';

function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

Array.prototype.indexOf = function(val) { //查找数组元素
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) { return i; }
    }
    return -1;
}
Array.prototype.remove = function(val) { //从数组删除指定元素
    var index = this.indexOf(val);
    if (index > -1) { this.splice(index, 1); }
}

Array.prototype.max = function() { 
    var max = this[0]
    for (var i = 1; i < this.length; i++){ 
        if (this[i] > max) { 
            max = this[i]
        } 
    } 
    return max
}

Date.prototype.Format = function(format) {
    var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
Date.prototype.Time = function(format) {
    var o = {
        "d+": this.getUTCDate() - 1,
        "h+": this.getUTCHours(),
        "m+": this.getUTCMinutes(),
        "s+": this.getUTCSeconds(),
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
const tCanvas = document.createElement("canvas");
const tctx = tCanvas.getContext("2d");
const maxsize = 100 * 1024;
const util = {
    randomWord() { //随机生成密码
        let sT = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        let str = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
        return sT[Math.round(Math.random() * 25) + 0] + str[Math.round(Math.random() * 25) + 0] + (Math.floor(Math.random() * (9999 - 1000)) + 1000);
    },
    chooseAllFile: function(file, token, callbackFunc, key) {
        if (!file) {
            return;
        }
        let reader = new FileReader();
        let size = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
        reader.onload = function() {
            let result = this.result;
            let img = new Image();
            img.src = result;
            // 如果图片大小小于100kb，则直接上传
            // 如果图片大小小于100kb，则直接上传

            if (result.length <= maxsize) {
                img = null;
                Qiniu_upload(file, token, callbackFunc, key);
                return;
            }
            if (img.complete) {
                callback();
            } else {
                img.onload = callback;
            }

            function callback() {
                let data = compress(img);
                Qiniu_upload_large(data, file.type, token, callbackFunc, key);
                img = null;
            }
        };
        reader.readAsDataURL(file);

    },
    utf16toEntities: function(str) {
        let patt = /[\ud800-\udbff][\udc00-\udfff]/g;
        // 检测utf16字符正则
        str = str.replace(patt, function(char) {
            let H, L, code;
            if (char.length === 2) {
                H = char.charCodeAt(0);
                // 取出高位
                L = char.charCodeAt(1);
                // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                // 转换算法
                return "&#" + code + ";";
            } else {
                return char;
            }
        });
        return str;
    },
    getQueryStringByName: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    Cookie: {
        get: function(name) {
            var array = document.cookie.split('; ');
            var len = array.length;
            for (var i = 0; i < len; i++) {
                var name_value_pairs = array[i].split('=');
                if (name_value_pairs[0] === name) {
                    return name_value_pairs[1];
                }
            }

            return '';

        },
        set: function(name, value, days) {
            var now = new Date();
            now.setDate(now.getDate() + days);
            document.cookie = name + '=' + escape(value) + ((days == null) ? "" : ";expires=" + now.toGMTString()) + ";path=/";
        },
        remove: function(name) {
            this.set(name, '', -1);
        }
    },
    formatDate: {
        format: function(date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function($0) {
                switch ($0.charAt(0)) {
                    case 'y':
                        return padding(date.getFullYear(), $0.length);
                    case 'M':
                        return padding(date.getMonth() + 1, $0.length);
                    case 'd':
                        return padding(date.getDate(), $0.length);
                    case 'w':
                        return date.getDay() + 1;
                    case 'h':
                        return padding(date.getHours(), $0.length);
                    case 'm':
                        return padding(date.getMinutes(), $0.length);
                    case 's':
                        return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function(dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y':
                            _date.setFullYear(_int);
                            break;
                        case 'M':
                            _date.setMonth(_int - 1);
                            break;
                        case 'd':
                            _date.setDate(_int);
                            break;
                        case 'h':
                            _date.setHours(_int);
                            break;
                        case 'm':
                            _date.setMinutes(_int);
                            break;
                        case 's':
                            _date.setSeconds(_int);
                            break;
                    }
                }
                return _date;
            }
            return null;
        }

    },
    clone: function(obj) {
        let buf;
        if (obj instanceof Array) {
            buf = [];
            var i = obj.length;
            while (i--) {
                buf[i] = this.clone(obj[i])
            }
            return buf;
        } else if (obj instanceof Object) {
            buf = {};
            for (var k in obj) {
                buf[k] = this.clone(obj[k])
            }
            return buf
        } else {
            return obj
        }
    },
    browser: {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1 //是否微信 （2015-01-22新增）
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    },
    URI: {
        query: function(search) {
            var s = search || location.href.split('?')[1],
                reg = /([?&])?([^=]+?)(?=(=|&|$))(([^&$]*))?/g,
                r = {},
                match = null,
                total = 0;
            var _remove = function(key) {
                // r[key] = undefined;
                delete r[key];
                total--;
            };
            while (match = reg.exec(s)) {
                var val = decodeURIComponent(match[4]).replace(/^=/, "");
                if (match[2].indexOf('[]') !== -1) {
                    var k = match[2].replace('[]', '');
                    if (typeof r[k] === 'undefined') {
                        r[k] = [val];
                        total++;
                    } else {
                        r[k].push(val);
                    }
                } else {
                    r[match[2]] = val;
                    total++;
                }
            }
            return {
                get: function(key) {
                    console.log(r[key])
                    return r[key];

                },
                keys: function() {
                    var keys = [];
                    if ('keys' in Object) {
                        keys = Object.keys(r);
                    } else {
                        for (var key in r) {
                            keys.push(key);
                        }
                    }
                    return keys;
                },
                remove: _remove,
                count: function() {
                    return total;
                }
            };
        }
    }

};
export default util

// 使用canvas对大图片进行压缩
function compress(img) {
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    // 如果图片大于四百万像素，计算压缩比并将大小压至100万以下
    var ratio;
    if ((ratio = width * height / 1000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    // 铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio,
                    nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }
    // 进行最小压缩
    var ndata = canvas.toDataURL('image/jpeg', 0.8);
    console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
};

/**
 * 获取blob对象的兼容性写法
 *
 * @param buffer
 * @param format
 * @returns {*}
 */
function newBlob(data, datatype) {
    var out;
    try {
        out = new Blob([data], {
            type: datatype
        });
    } catch (e) {
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
            window.MozBlobBuilder || window.MSBlobBuilder;

        if (e.name == 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data.buffer);
            out = bb.getBlob(datatype);
        } else if (e.name == "InvalidStateError") {
            out = new Blob([data], {
                type: datatype
            });
        } else {}
    }
    return out;
}
// 判断是否需要blobbuilder
var needsFormDataShim = (function() {
        var bCheck = ~navigator.userAgent.indexOf('Android') &&
            ~navigator.vendor.indexOf('Google') &&
            !~navigator.userAgent.indexOf('Chrome');

        return bCheck &&
            navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
    })(),
    blobConstruct = !!(function() {
        try {
            return new Blob();
        } catch (e) {}
    })(),
    XBlob = blobConstruct ? window.Blob :
    function(parts, opts) {
        var bb = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
        parts.forEach(function(p) {
            bb.append(p);
        });

        return bb.getBlob(opts ? opts.type : undefined);
    };

function FormDataShim() {
    // Store a reference to this
    var o = this,
        parts = [], // Data to be sent
        boundary = Array(5).join('-') +
        (+new Date() * (1e16 * Math.random())).toString(32),
        oldSend = XMLHttpRequest.prototype.send;

    this.append = function(name, value, filename) {
        parts.push('--' + boundary +
            '\r\nContent-Disposition: form-data; name="' + name + '"');

        if (value instanceof Blob) {
            parts.push('; filename="' + (filename || 'blob') +
                '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
            parts.push(value);
        } else {
            parts.push('\r\n\r\n' + value);
        }
        parts.push('\r\n');
    };

    // Override XHR send()
    XMLHttpRequest.prototype.send = function(val) {
        var fr, data, oXHR = this;

        if (val === o) {
            // 注意不能漏最后的\r\n ,否则有可能服务器解析不到参数.
            parts.push('--' + boundary + '--\r\n');
            data = new XBlob(parts);
            fr = new FileReader();
            fr.onload = function() {
                oldSend.call(oXHR, fr.result);
            };
            fr.onerror = function(err) {
                throw err;
            };
            fr.readAsArrayBuffer(data);

            this.setRequestHeader('Content-Type',
                'multipart/form-data; boundary=' + boundary);
            XMLHttpRequest.prototype.send = oldSend;
        } else {
            oldSend.call(this, val);
        }
    };
}

function Qiniu_upload_large(file, type, token, callbackFunc, key) {
    var text = window.atob(file.split(",")[1]);
    var buffer = new Uint8Array(text.length);
    var pecent = 0,
        loop = null;
    for (var i = 0; i < text.length; i++) {
        buffer[i] = text.charCodeAt(i);
    }
    var blob = newBlob(buffer, type);
    console.log(blob);
    var xhr = new XMLHttpRequest();
    var qiniuUploadUrl;
    if (window.location.protocol === 'https:') {
        qiniuUploadUrl = 'https://up.qbox.me';
    } else {
        qiniuUploadUrl = 'http://up.qiniu.com';
    }
    xhr.open('POST', qiniuUploadUrl, true);
    var formData = needsFormDataShim ? new FormDataShim() : new FormData();
    if (key !== null && key !== undefined) formData.append('key', key);
    formData.append('token', token);
    formData.append('file', blob);
    xhr.onreadystatechange = function(response) {
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
            var res = JSON.parse(xhr.responseText);
            callbackFunc(res)
        } else if (xhr.status != 200 && xhr.responseText) {

        }
    };
    xhr.send(formData);
}

function Qiniu_upload(file, token, callbackFunc, key) {
    var xhr = new XMLHttpRequest();
    var qiniuUploadUrl;
    if (window.location.protocol === 'https:') {
        qiniuUploadUrl = 'https://up.qbox.me';
    } else {
        qiniuUploadUrl = 'http://up.qiniu.com';
    }
    xhr.open('POST', qiniuUploadUrl, true);
    var formData;
    formData = new FormData();
    if (key !== null && key !== undefined) formData.append('key', key);
    formData.append('token', token);
    formData.append('file', file);
    xhr.onreadystatechange = function(response) {
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
            var res = JSON.parse(xhr.responseText);
            callbackFunc(res)
        } else if (xhr.status != 200 && xhr.responseText) {

        }
    };
    xhr.send(formData);
}


 var idTmr; 
 //获取当前浏览器类型 
  function getExplorer() { 
   var explorer = window.navigator.userAgent ; 
   //ie 
   if (explorer.indexOf("MSIE") >= 0) { 
    return 'ie'; 
   } 
   //firefox 
   else if (explorer.indexOf("Firefox") >= 0) { 
    return 'Firefox'; 
   } 
   //Chrome 
   else if(explorer.indexOf("Chrome") >= 0){ 
    return 'Chrome'; 
   } 
   //Opera 
   else if(explorer.indexOf("Opera") >= 0){ 
    return 'Opera'; 
   } 
   //Safari 
   else if(explorer.indexOf("Safari") >= 0){ 
    return 'Safari'; 
   } 
  } 


  //win10自带的IE无法导出 
 export const exportExcel=(tableid)=> { 
   if(getExplorer()=='ie') 
   { 
    var curTbl = document.getElementById(tableid); 
    var oXL = new ActiveXObject("Excel.Application"); 
    var oWB = oXL.Workbooks.Add(); 
    var xlsheet = oWB.Worksheets(1); 
    var sel = document.body.createTextRange(); 
    sel.moveToElementText(curTbl); 
    sel.select(); 
    sel.execCommand("Copy"); 
    xlsheet.Paste(); 
    oXL.Visible = true; 
  
    try { 
     var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls"); 
    } catch (e) { 
     print("Nested catch caught " + e); 
    } finally { 
     oWB.SaveAs(fname); 
     oWB.Close(savechanges = false); 
     oXL.Quit(); 
     oXL = null; 
     idTmr = window.setInterval("Cleanup();", 1); 
    } 
  
   } 
   else 
   { 
    tableToExcel(tableid) 
   } 
  } 
  function Cleanup() { 
   window.clearInterval(idTmr); 
   CollectGarbage(); 
  } 
    
 //判断浏览器后调用的方法，把table的id传入即可 
  var tableToExcel = (function() { 
   var uri = 'data:application/vnd.ms-excel;base64,', 
     template = '<html><head><meta charset="UTF-8"></head><body><table border="1">{table}</table></body></html>', 
     base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }, 
     format = function(s, c) { 
      return s.replace(/{(\w+)}/g, 
        function(m, p) { return c[p]; }) } 
   return function(table, name) { 
    if (!table.nodeType) table = document.getElementById(table) 
    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML} 
    window.location.href = uri + base64(format(template, ctx))
   } 
  })() 
  
  
export const  doPrint=() => {   
//  let bdhtml=window.document.body.innerHTML;  
//  console.log(bdhtml)
//  let sprnstr="<!--startprintdp-->";   
//  let eprnstr="<!--endprint-->";   
//  let prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+19); 
//  console.log(prnhtml)  
//  prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));   


//	let prnhtml = document.getElementById('tables').innerHTML
//  window.document.body.innerHTML=prnhtml;  
//  window.print();   

	let newWindow = window.open("_blank");   //打开新窗口
    let codestr = document.getElementById("tables").innerHTML;   //获取需要生成pdf页面的div代码
    newWindow.document.write(codestr);   //向文档写入HTML表达式或者JavaScript代码
    newWindow.document.close();     //关闭document的输出流, 显示选定的数据
    newWindow.print();   //打印当前窗口
    return true;
}   
  
 
      
