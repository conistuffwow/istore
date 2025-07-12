function loadApps() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "content.xml", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var parser, xml;
        if (xhr.responseXML === null || !xhr.responseXML.documentElement) {
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
          var app = apps[i];
          var category = app.getElementsByTagName("category")[0].textContent;
          categories[category] = true;
        }
  
        
        for (var cat in categories) {
          if (categories.hasOwnProperty(cat)) {
            var button = document.createElement("button");
            button.className = "category-button";
            button.setAttribute("data-category", cat);
            button.innerHTML = cat;
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
  
          var div = document.createElement("div");
          div.className = "app";
          div.setAttribute("data-category", category);
  
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
  
       
        var buttons = categoryBar.getElementsByTagName("button");
        for (var b = 0; b < buttons.length; b++) {
          buttons[b].onclick = function () {
            var selected = this.getAttribute("data-category");
            var apps = container.getElementsByTagName("div");
            for (var a = 0; a < apps.length; a++) {
              var appCat = apps[a].getAttribute("data-category");
              if (selected === "All" || appCat === selected) {
                apps[a].style.display = "";
              } else {
                apps[a].style.display = "none";
              }
            }
          };
        }
      }
    };
    xhr.send();
  }
  
  window.onload = loadApps;
  