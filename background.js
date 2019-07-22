const rollres = JSON.parse(localStorage.getItem("rollres")) || [];

var typeMap = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  json: "text/json",
  xml: "text/xml",
  jpg: "image/jpeg",
  gif: "image/gif",
  png: "image/png",
  webp: "image/webp"
};

function getLocalFileUrl(url) {
  var arr = url.split(".");
  var type = arr[arr.length - 1];
  var xhr = new XMLHttpRequest();
  xhr.open("get", url, false);
  xhr.send(null);
  var content = xhr.responseText || xhr.responseXML;
  if (!content) {
    return false;
  }
  content = encodeURIComponent(
    type === "js"
      ? content.replace(/[\u0080-\uffff]/g, function($0) {
          var str = $0.charCodeAt(0).toString(16);
          return "\\u" + "00000".substr(0, 4 - str.length) + str;
        })
      : content
  );
  return "data:" + (typeMap[type] || typeMap.txt) + ";charset=utf-8," + content;
}

function regsTest(requestUrl, url) {
  const requestUrlArr = requestUrl.split("\n");
  const passReg = requestUrlArr.find(rua => {
    var reg = new RegExp(rua, "gi");
    return reg.test(url) ? reg : false;
  });

  return passReg;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var url = details.url;
    for (var i = 0, len = rollres.length; i < len; i++) {
      const { requestUrl, enable, responseUrl } = rollres[i];
      const reg = regsTest(requestUrl, url);
      if (enable && typeof responseUrl === "string" && reg) {
        if (!/^file:\/\//.test(responseUrl)) {
          url = url.replace(reg, responseUrl);
        } else {
          url = getLocalFileUrl(url.replace(reg, responseUrl));
        }
      }
    }
    return url === details.url ? {} : { redirectUrl: url };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
