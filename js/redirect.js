
(function() {
  var match = navigator.userAgent.match(/OS (\d+)_/);
  if (match && parseInt(match[1], 10) >= 7) {
    window.location.href = "7.html";
  }
})();
