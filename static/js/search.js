const searchFn = () => {

    const limit = 50; 
    const minChars = 2;

    let searching = false;

    const render = (results) => {    
        results.sort((a, b) => b.weight - a.weight);
        for (let i = 0; i < results.length && i < 20; i += 1) {
            const result = results[i].item;
            const resultPane = `<div class="container">` +
                `<div><a href="${result.permalink}" ` +
                `alt="${result.title}">${result.title}</a></div>` +
                `<div class="float-left col-2">` +
                `<img src="${result.image}" alt="${result.title}" class="circle img-thumbnail">` +
                `</div>` +
                `<p><small>${result.description}</small></p>` +
                `</div><div class="clearfix"></div>`;
           $("#results").append(resultPane);     
        }
    };

    const checkTerms = (terms, weight, target) => {
        let weightResult = 0;
        terms.forEach(term => {
            if (~target.trim().toLowerCase().indexOf(term.term)) {
                weightResult += term.weight * weight;
            }
        });
        return weightResult;
    };

    const search = (terms) => {
        const results = [];
        searchHost.index.forEach(item => {
            if (item.tags) {
                let weight = 0;
                weight += checkTerms(terms, 1, item.content);
                weight += checkTerms(terms, 2, item.description);
                weight += checkTerms(terms, 2, item.subtitle);
                item.tags.forEach(tag => {
                    weight += checkTerms(terms, 4, tag);
                });
                weight += checkTerms(terms, 8, item.title);
                if (weight) {
                    results.push({
                        weight: weight,
                        item: item
                    });
                }                
            }
        });
        if (results.length) {
            let resultsMessage = `${results.length} items found.`;
            if (results.length > limit) {
                resultsMessage += ` Showing first ${limit} results.`;
            }
            $("#results").html(`<p>${resultsMessage}</p>`);
            render(results);
        }
        else {
            $("#results").html('<p>No items found.</p>');
        }
    };

    const runSearch = () => {
        if (searching) {
            return;
        }
        const term = $("#searchBox").val();
        if (term.length < minChars) {
            $("#results").html('<p>No items found.</p>');
            return;
        }
        searching = true;
        const terms = term.trim().toLowerCase().split(" ");
        const termsTree = [];
        for (let i = 0; i < terms.length; i += 1) {
            for (let j = i; j < terms.length; j += 1) {
                const weight = Math.pow(2, j - i);
                str = "";
                for (let k = i; k <= j; k += 1) {
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
    }

    const initSearch = () => {
        $("#searchBox").keyup(() => {
            runSearch();
        });
    }

    $("#searchBox").hide();

    searchHost = {};

    $.getJSON("/index.json", results => {
        searchHost.index = results;
        $("#loading").hide();
        $("#searchBox").show()
            .removeAttr("disabled")
            .focus();
        initSearch();
    });

};

window.addEventListener("DOMContentLoaded", searchFn);
