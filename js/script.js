(function(){
    function getiOSVersion() {
      var match = navigator.userAgent.match(/OS (\d+)_/);
      return match ? parseInt(match[1], 10) : null;
    }
    function checkCydiaScheme(callback) {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      var timeout = setTimeout(function() {
        document.body.removeChild(iframe);
        callback(false);
      }, 1000);
      window.onblur = function() {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        callback(true);
      };
      iframe.src = 'cydia://package/com.example.test';
    }
    function getQueryParam(name) {
      var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results ? decodeURIComponent(results[1]) : null;
    }
    function showJailbreakWarning() {
      var jbWarn = document.getElementById('jailbreak-warning');
      var stdUI = document.getElementById('standard-install-ui');
      if(jbWarn) jbWarn.style.display = 'block';
      if(stdUI) stdUI.style.display = 'none';
    }
    function showStandardInstall() {
      var jbWarn = document.getElementById('jailbreak-warning');
      var stdUI = document.getElementById('standard-install-ui');
      if(jbWarn) jbWarn.style.display = 'none';
      if(stdUI) stdUI.style.display = 'block';
    }
    function fixInstallLinks() {
      var iosVersion = getiOSVersion();
      if(iosVersion >= 7) {
        var links = document.getElementsByTagName('a');
        for(var i=0;i<links.length;i++) {
          var href = links[i].getAttribute('href');
          if(href && href.indexOf('itms-services://')===0 && href.indexOf('url=http://')!==-1) {
            var fixedHref = href.replace('url=http://','url=https://');
            links[i].setAttribute('href', fixedHref);
          }
        }
      }
    }
    function loadApps() {
      var selectedCategory = getQueryParam('category') || 'All';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'content.xml', true);
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var parser, xml;
          if(!xhr.responseXML || !xhr.responseXML.documentElement) {
            if(window.DOMParser) {
              parser = new DOMParser();
              xml = parser.parseFromString(xhr.responseText, 'application/xml');
            } else {
              xml = new ActiveXObject('Microsoft.XMLDOM');
              xml.async = false;
              xml.loadXML(xhr.responseText);
            }
          } else {
            xml = xhr.responseXML;
          }
          var apps = xml.getElementsByTagName('app');
          var container = document.getElementById('app-list');
          var categoryBar = document.getElementById('category-bar');
          if(!container || !categoryBar) return;
          container.innerHTML = '';
          categoryBar.innerHTML = '';
          var categories = {'All': true};
          for(var i=0;i<apps.length;i++) {
            var catNode = apps[i].getElementsByTagName('category')[0];
            if(catNode) {
              var cat = catNode.textContent || catNode.text;
              categories[cat] = true;
            }
          }
          var currentPage = window.location.pathname.split('/').pop();
          var select = document.createElement('select');
          select.id = 'category-select';
          for(var c in categories) {
            if(categories.hasOwnProperty(c)) {
              var option = document.createElement('option');
              option.value = c;
              option.text = c;
              select.appendChild(option);
            }
          }
          categoryBar.appendChild(select);
          for(var s=0;s<select.options.length;s++) {
            if(select.options[s].value === selectedCategory) {
              select.selectedIndex = s;
              break;
            }
          }
          select.onchange = function() {
            window.location.href = currentPage + '?category=' + encodeURIComponent(this.value);
          };
          for(var j=0;j<apps.length;j++) {
            var app = apps[j];
            var titleNode = app.getElementsByTagName('title')[0];
            var versionNode = app.getElementsByTagName('version')[0];
            var iconNode = app.getElementsByTagName('icon')[0];
            var plistNode = app.getElementsByTagName('plist')[0];
            var categoryNode = app.getElementsByTagName('category')[0];
            var minVersionNode = app.getElementsByTagName('min-version')[0];
            if(!titleNode || !versionNode || !iconNode || !plistNode || !categoryNode || !minVersionNode) continue;
            var title = titleNode.textContent || titleNode.text;
            var version = versionNode.textContent || versionNode.text;
            var icon = iconNode.textContent || iconNode.text;
            var plist = plistNode.textContent || plistNode.text;
            var category = categoryNode.textContent || categoryNode.text;
            var minVersion = minVersionNode.textContent || minVersionNode.text;
            if(selectedCategory !== 'All' && category !== selectedCategory) continue;
            var div = document.createElement('div');
            div.className = 'app';
            div.innerHTML =
              '<img src="' + icon + '" alt="' + title + ' Icon" class="icon">' +
              '<div class="details">' +
              '<h2>' + title + '</h2>' +
              '<p>Version ' + version + '</p>' +
              '<p>Requires iOS ' + minVersion + '+</p>' +
              '<a class="install-button" href="itms-services://?action=download-manifest&url=' + encodeURIComponent(plist) + '">Install</a>' +
              '</div>';
            container.appendChild(div);
          }
          fixInstallLinks();
        }
      };
      xhr.send();
    }
    var iosVersion = getiOSVersion();
    if(iosVersion >=7) {
      checkCydiaScheme(function(isJailbroken) {
        if(isJailbroken) {
          showJailbreakWarning();
        } else {
          showStandardInstall();
          loadApps();
        }
      });
    } else {
      showStandardInstall();
      loadApps();
    }
  })();
  