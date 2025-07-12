(function () {
  var ua = navigator.userAgent;
  var isiOS = /iPhone|iPad|iPod/i.test(ua);
  var iosVersion = isiOS ? parseFloat((ua.match(/OS (\d+_\d+)/) || [])[1]?.replace('_', '.') || 0) : 0;
  var isModern = iosVersion >= 7;
  var fileURLModifier = isModern ? (url => url.replace('http://', 'https://')) : (url => url);

  var urlParams = new URLSearchParams(window.location.search);
  var filterCategory = urlParams.get('category');

  fetch('content.xml')
    .then(res => res.text())
    .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
    .then(data => {
      var apps = Array.from(data.getElementsByTagName('app'));
      var container = document.getElementById('app-list');
      var categories = new Set();

      apps.forEach(app => {
        var title = app.getElementsByTagName('title')[0].textContent;
        var version = app.getElementsByTagName('version')[0].textContent;
        var icon = app.getElementsByTagName('icon')[0].textContent;
        var ipa = app.getElementsByTagName('ipa')[0].textContent;
        var category = app.getElementsByTagName('category')[0]?.textContent || 'Other';
        var minVersion = parseFloat(app.getElementsByTagName('min-version')[0]?.textContent || 0);

        categories.add(category);

        if (iosVersion && iosVersion < minVersion) return;
        if (filterCategory && category !== filterCategory) return;

        var el = document.createElement('div');
        el.className = 'app';
        el.innerHTML = `
          <img class="icon" src="${fileURLModifier(icon)}" />
          <h2>${title}</h2>
          <p>Version ${version}</p>
          <a class="install-button" href="${fileURLModifier(ipa)}">Download IPA</a>
        `;
        container.appendChild(el);
      });

      var catBar = document.getElementById('category-bar');
      if (catBar) {
        var select = document.createElement('select');
        select.id = 'category-select';

        var allOption = document.createElement('option');
        allOption.text = 'All Categories';
        allOption.value = '';
        select.appendChild(allOption);

        Array.from(categories).sort().forEach(cat => {
          var opt = document.createElement('option');
          opt.value = cat;
          opt.text = cat;
          select.appendChild(opt);
        });

        select.addEventListener('change', function () {
          var base = location.pathname.includes('7.html') ? '7.html' : 'index.html';
          var param = this.value ? '?category=' + encodeURIComponent(this.value) : '';
          window.location.href = base + param;
        });

        catBar.appendChild(select);
        if (filterCategory) select.value = filterCategory;
      }
    });
})();
