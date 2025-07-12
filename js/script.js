function loadApps() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "content.xml", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var xml = xhr.responseXML;
          var apps = xml.getElementsByTagName("app");
          var container = document.getElementById("app-list");
  
          for (var i = 0; i < apps.length; i++) {
            var app = apps[i];
            var title = app.getElementsByTagName("title")[0].textContent;
            var version = app.getElementsByTagName("version")[0].textContent;
            var icon = app.getElementsByTagName("icon")[0].textContent;
            var plist = app.getElementsByTagName("plist")[0].textContent;
            var category = app.getElementsByTagName("category")[0].textContent;
  
            var div = document.createElement("div");
            div.className = "app";
            div.setAttribute("data-category", category);
  
            var html = '' +
              '<img src="' + icon + '" alt="' + title + ' Icon" class="icon">' +
              '<div class="details">' +
                '<h2>' + title + '</h2>' +
                '<p>Version ' + version + '</p>' +
                '<a class="install-button" href="itms-services://?action=download-manifest&url=' + plist + '">Install</a>' +
              '</div>';
  
            div.innerHTML = html;
            container.appendChild(div);
          }
        } else {
          alert("Failed to load content.xml: status " + xhr.status);
        }
      }
    };
    xhr.send();
  }
  
  window.onload = loadApps;
  