(function () {

    function showConsent() {
        $("#consentModal").modal();
    }

    function showWhenLoaded(callback) {
        if (window.cssLoaded === true) {
            callback();
        }
        else {
            setTimeout(function () {
                showWhenLoaded(callback);
            }, 10);
        }
    }

    function closeModal() {
        $("#consentModal").modal('hide');
        location.reload();
    }

    function optIn() {
        window.devConsent.acknowledged = true;
        window.devConsent.consent = true;
        localStorage.setItem("consent", JSON.stringify(window.devConsent));
        closeModal();
        return false;
    }

    function optOut() {
        window.devConsent.acknowledged = true;
        window.devConsent.consent = false;
        localStorage.setItem("consent", JSON.stringify(window.devConsent));
        closeModal();
        return false;
    }

    function consent() {

        window.devConsent = {
            acknowledged: false,
            consent: false,
            in: optIn,
            out: optOut
        };

        showWhenLoaded(function () {
            var optIn = document.getElementById("consentOptIn");
            optIn.onclick = window.devConsent.in;
            var optOut = document.getElementById("consentOptOut");
            optOut.onclick = window.devConsent.out;

            var status = document.getElementById("consentStatus");
            if (status) {
                var ack = window.devConsent.acknowledged ?
                    "Acknowledged" : "Not Acknowledged";
                var opt = window.devConsent.acknowledged ?
                    (window.devConsent.consent ? "Consented" : "Opted Out") :
                    "Not Consented";
                status.classList.add(window.devConsent.acknowledged ? "alert-success"
                    : "alert-warning");
                status.innerText = `${ack}, ${opt}`;
            }
        });

        var consentCheck = localStorage.getItem("consent");

        if (consentCheck === null) {
            showWhenLoaded(function () {
                if (window.noConsent !== true) {
                    showConsent();
                }
            });
        }
        else {
            var consent = JSON.parse(consentCheck);
            window.devConsent.acknowledged = consent.acknowledged;
            window.devConsent.consent = consent.consent;
            if (window.devConsent.acknowledged === false) {
                showWhenLoaded(showContent);
            }
        }
    }

    var elem = document.querySelector('meta[property="og:url"]');
    if (elem) {
        content = elem.getAttribute('content');
        if (content) {
            var contentUrl = new URL(content);
            var there = `${contentUrl.origin}${location.pathname}`;
            console.info(there);
            var here = `${location.origin}${location.pathname}${location.search}`;
            if (here != there) {
                location.href = location.hash ? `${there}${location.hash}`
                    : there;
            }
        }
    }
    consent();
})();