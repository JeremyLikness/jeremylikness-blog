(function () {
    var elem = document.querySelector('meta[property="og:url"]');
    if (elem) {
        content = elem.getAttribute('content');
        if (content) {
            if (location.href != content) {
                location.href = content;
            }
        }
    }
})();