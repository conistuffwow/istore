function getQueryParam(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results ? decodeURIComponent(results[1]) : null;
  }
  
  function loadApps() {
    var selectedCategory = getQueryParam("category") || "All";
  
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "content.xml", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var parser, xml;
        if (!xhr.responseXML || !xhr.responseXML.documentElement) {
          if (window.DOMParser) {
            parser = new DOMParser();
            xml = parser.parseFromString(xhr.responseText, "application/xml");
          } else {
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.loadXML(xhr.responseText);
          }
        } else {
          xml = xhr.responseXML;
        }
  
        var apps = xml.getElementsByTagName("app");
        var container = document.getElementById("app-list");
        var categoryBar = document.getElementById("category-bar");
  
        var categories = { "All": true };
  
        
        for (var i = 0; i < apps.length; i++) {
          var cat = apps[i].getElementsByTagName("category")[0].textContent;
          categories[cat] = true;
        }
  
        
        for (var c in categories) {
          if (categories.hasOwnProperty(c)) {
            var button = document.createElement("a");
            button.className = "category-button";
            var currentPage = window.location.pathname.split("/").pop();
            button.href = currentPage + "?category=" + encodeURIComponent(c);
            button.innerHTML = c;
            categoryBar.appendChild(button);
          }
        }
  
        
        for (var j = 0; j < apps.length; j++) {
          var app = apps[j];
          var title = app.getElementsByTagName("title")[0].textContent;
          var version = app.getElementsByTagName("version")[0].textContent;
          var icon = app.getElementsByTagName("icon")[0].textContent;
          var plist = app.getElementsByTagName("plist")[0].textContent;
          var category = app.getElementsByTagName("category")[0].textContent;
          var minVersion = app.getElementsByTagName("min-version")[0].textContent;
  
          if (selectedCategory !== "All" && category !== selectedCategory) continue;
  
          var div = document.createElement("div");
          div.className = "app";
  
          var html = '' +
            '<img src="' + icon + '" alt="' + title + ' Icon" class="icon">' +
            '<div class="details">' +
              '<h2>' + title + '</h2>' +
              '<p>Version ' + version + '</p>' +
              '<p>Requires iOS ' + minVersion + '+</p>' +
              '<a class="install-button" href="itms-services://?action=download-manifest&url=' + plist + '">Install</a>' +
            '</div>';
  
          div.innerHTML = html;
          container.appendChild(div);
        }
      }
    };
    xhr.send();
  }
  
  window.onload = loadApps;
  