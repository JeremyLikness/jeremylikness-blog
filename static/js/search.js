"use strict";
var searchFn = function () {
    var limit = 30;
    var minChars = 2;
    var searching = false;
    var render = function (results) {
        results.sort(function (a, b) { return b.weight - a.weight; });
        for (var i = 0; i < results.length && i < limit; i += 1) {
            var result = results[i].item;
            var resultPane = "<div class=\"container\">" +
                ("<div class=\"row\"><a href=\"" + result.permalink + "\" ") +
                ("alt=\"" + result.showTitle + "\">" + result.showTitle + "</a></div>") +
                "<div class=\"row\"><div class=\"float-left col-2\">" +
                ("<img src=\"" + result.image + "\" alt=\"" + result.showTitle + "\" class=\"circle img-thumbnail\">") +
                "</div>" +
                ("<div class=\"col-10\"><small>" + result.showDescription + "</small></div>") +
                "</div></div>";
            $("#results").append(resultPane);
        }
    };
    var checkTerms = function (terms, weight, target) {
        var weightResult = 0;
        terms.forEach(function (term) {
            if (~target.indexOf(term.term)) {
                weightResult += term.weight * weight;
            }
        });
        return weightResult;
    };
    var search = function (terms) {
        var results = [];
        searchHost.index.forEach(function (item) {
            if (item.tags) {
                var weight_1 = 0;
                terms.forEach(function (term) {
                    if (item.title.startsWith(term.term)) {
                        weight_1 += term.weight * 12;
                    }
                });
                weight_1 += checkTerms(terms, 1, item.content);
                weight_1 += checkTerms(terms, 2, item.description);
                weight_1 += checkTerms(terms, 2, item.subtitle);
                item.tags.forEach(function (tag) {
                    weight_1 += checkTerms(terms, 4, tag);
                });
                weight_1 += checkTerms(terms, 8, item.title);
                if (weight_1) {
                    results.push({
                        weight: weight_1,
                        item: item
                    });
                }
            }
        });
        if (results.length) {
            var resultsMessage = results.length + " items found.";
            if (results.length > limit) {
                resultsMessage += " Showing first " + limit + " results.";
            }
            $("#results").html("<p>" + resultsMessage + "</p>");
            render(results);
        }
        else {
            $("#results").html('<p>No items found.</p>');
        }
    };
    var runSearch = function () {
        if (searching) {
            return;
        }
        var term = $("#searchBox").val().trim().toLowerCase().replace(/[^0-9a-z ]/gi, "");
        if (term.length < minChars) {
            $("#results").html('<p>No items found.</p>');
            return;
        }
        searching = true;
        $("#results").html('<p>Processing search...</p>');
        var terms = term.split(" ");
        var termsTree = [];
        for (var i = 0; i < terms.length; i += 1) {
            for (var j = i; j < terms.length; j += 1) {
                var weight = Math.pow(2, j - i);
                var str = "";
                for (var k = i; k <= j; k += 1) {
                    str += (terms[k] + " ");
                }
                termsTree.push({
                    weight: weight,
                    term: str.trim()
                });
            }
        }
        search(termsTree);
        searching = false;
    };
    var initSearch = function () {
        $("#searchBox").keyup(function () {
            runSearch();
        });
    };
    $("#searchBox").hide();
    var searchHost = {};
    $.getJSON("/index.json", function (results) {
        searchHost.index = [];
        var dup = {};
        results.forEach(function (result) {
            if (result.tags && !dup[result.permalink]) {
                var res = {};
                res.showTitle = result.title;
                res.showDescription = result.description;
                res.title = result.title.trim().toLowerCase().replace(/[^0-9a-z ]/gi, "");
                res.subtitle = result.subtitle.trim().toLowerCase().replace(/[^0-9a-z ]/gi, "");
                res.description = result.description.trim().toLowerCase().replace(/[^0-9a-z ]/gi, "");
                res.content = result.content.trim().toLowerCase().replace(/[^0-9a-z ]/gi, "");
                var newTags_1 = [];
                result.tags.forEach(function (tag) { return newTags_1.push(tag.trim().toLowerCase().replace(/[^0-9a-z ]/gi, "")); });
                res.tags = newTags_1;
                res.permalink = result.permalink;
                res.image = result.image;
                searchHost.index.push(res);
                dup[result.permalink] = true;
            }
        });
        $("#loading").hide();
        $("#searchBox").show()
            .removeAttr("disabled")
            .focus();
        initSearch();
    });
};
window.addEventListener("DOMContentLoaded", searchFn);