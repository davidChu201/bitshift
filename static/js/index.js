/*
 * @file Manages all library initialization, jQuery callbacks, query entry
 *      callbacks, server querying, and results diplay for `index.html`.
 */

var advancedSearchDiv = $("div#advanced-search");
var advancedSearchButton = $("button#advanced-search");
advancedSearchButton.click(function(){
    var searchField = $("div#search-field");
    if(!advancedSearchDiv.hasClass("visible")){
        searchField.addClass("partly-visible");
        advancedSearchDiv.fadeIn(500).addClass("visible");
        advancedSearchButton.addClass("clicked");
    }
    else {
        advancedSearchDiv.fadeOut(300).removeClass("visible");
        advancedSearchButton.removeClass("clicked");
        if($("div#results .result").length == 0)
            searchField.removeClass("partly-visible");
    }
});

FINISH_TYPING_INTERVAL = 650;
searchBar = $("form#search-bar input[type='text']")[0];
resultsDiv = $("div#results")[0];

var typingTimer, lastValue;
//Obtained by parsing python file with pygments
var codeExample = '<table class="highlighttable"><tr><td class="linenos"><div class="linenodiv"><pre> 1\n 2\n 3\n 4\n 5\n 6\n 7\n 8\n 9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30\n31\n32\n33\n34\n35\n36\n37\n38\n39\n40</pre></div></td><td class="code"><div class="hll"><pre><span class="sd">&quot;&quot;&quot;</span>\n<span class="sd">Module to contain all the project&#39;s Flask server plumbing.</span>\n<span class="sd">&quot;&quot;&quot;</span>\n\n<span class="kn">from</span> <span class="nn">flask</span> <span class="kn">import</span> <span class="n">Flask</span>\n<span class="kn">from</span> <span class="nn">flask</span> <span class="kn">import</span> <span class="n">render_template</span><span class="p">,</span> <span class="n">session</span>\n\n<span class="kn">from</span> <span class="nn">bitshift</span> <span class="kn">import</span> <span class="n">assets</span>\n<span class="c"># from bitshift.database import Database</span>\n<span class="c"># from bitshift.query import parse_query</span>\n\n<span class="n">app</span> <span class="o">=</span> <span class="n">Flask</span><span class="p">(</span><span class="n">__name__</span><span class="p">)</span>\n<span class="n">app</span><span class="o">.</span><span class="n">config</span><span class="o">.</span><span class="n">from_object</span><span class="p">(</span><span class="s">&quot;bitshift.config&quot;</span><span class="p">)</span>\n\n<span class="n">app_env</span> <span class="o">=</span> <span class="n">app</span><span class="o">.</span><span class="n">jinja_env</span>\n<span class="n">app_env</span><span class="o">.</span><span class="n">line_statement_prefix</span> <span class="o">=</span> <span class="s">&quot;=&quot;</span>\n<span class="n">app_env</span><span class="o">.</span><span class="n">globals</span><span class="o">.</span><span class="n">update</span><span class="p">(</span><span class="n">assets</span><span class="o">=</span><span class="n">assets</span><span class="p">)</span>\n\n<span class="c"># database = Database()</span>\n\n<span class="nd">@app.route</span><span class="p">(</span><span class="s">&quot;/&quot;</span><span class="p">)</span>\n<span class="k">def</span> <span class="nf">index</span><span class="p">():</span>\n    <span class="k">return</span> <span class="n">render_template</span><span class="p">(</span><span class="s">&quot;index.html&quot;</span><span class="p">)</span>\n\n<span class="nd">@app.route</span><span class="p">(</span><span class="s">&quot;/search/&lt;query&gt;&quot;</span><span class="p">)</span>\n<span class="k">def</span> <span class="nf">search</span><span class="p">(</span><span class="n">query</span><span class="p">):</span>\n    <span class="c"># tree = parse_query(query)</span>\n    <span class="c"># database.search(tree)</span>\n    <span class="k">pass</span>\n\n<span class="nd">@app.route</span><span class="p">(</span><span class="s">&quot;/about&quot;</span><span class="p">)</span>\n<span class="k">def</span> <span class="nf">about</span><span class="p">():</span>\n    <span class="k">return</span> <span class="n">render_template</span><span class="p">(</span><span class="s">&quot;about.html&quot;</span><span class="p">)</span>\n\n<span class="nd">@app.route</span><span class="p">(</span><span class="s">&quot;/developers&quot;</span><span class="p">)</span>\n<span class="k">def</span> <span class="nf">developers</span><span class="p">():</span>\n    <span class="k">return</span> <span class="n">render_template</span><span class="p">(</span><span class="s">&quot;developers.html&quot;</span><span class="p">)</span>\n\n<span class="k">if</span> <span class="n">__name__</span> <span class="o">==</span> <span class="s">&quot;__main__&quot;</span><span class="p">:</span>\n    <span class="n">app</span><span class="o">.</span><span class="n">run</span><span class="p">(</span><span class="n">debug</span><span class="o">=</span><span class="bp">True</span><span class="p">)</span>\n</pre></div>\n</td></tr></table>'
searchBar.onkeyup = typingTimer;

// Enable infinite scrolling down the results page.
$(window).scroll(function() {
    var searchField = $("div#search-field");
    if($(window).scrollTop() + $(window).height() == $(document).height() && searchField.hasClass('partly-visible')){
        loadMoreResults();
    }
});

// Enable capturing the `enter` key.
$("form#search-bar").submit(function(event){
    event.preventDefault();
    return false;
});

/*
 * Clear the existing timer and set a new one the the user types text into the
 * search bar.
 */
function typingTimer(event){
    clearTimeout(typingTimer);

    var enterKeyCode = 13;
    if(event.keyCode != enterKeyCode){
        if(lastValue != searchBar.value)
            typingTimer = setTimeout(finishedTyping, FINISH_TYPING_INTERVAL);
    }
    else {
        event.preventDefault();
        finishedTyping();
        return false;
    }
};

/*
 * Callback which queries the server whenver the user stops typing.
 *
 * Whenever the user doesn't type for a `FINISH_TYPING_INTERVAL` after having
 * entered new text in the search bar, send the current query request to the
 * server.
 */
function finishedTyping(){
    lastValue = searchBar.value;
    var searchField = $("div#search-field");

    clearResults();
    if(searchBar.value){
        searchField.addClass("partly-visible");
        populateResults();
    }
    else {
        searchField.removeClass("partly-visible");
        $("div#advanced-search").fadeOut(50);
        advancedSearchButton.removeClass("clicked");
    }
}

/*
 * Removes any child elements of `div#results`.
 */
function clearResults(){
    while(resultsDiv.firstChild)
        resultsDiv.removeChild(resultsDiv.firstChild);
}

/*
 * Query the server with the current search string, and populate `div#results`
 * with its response.
 */
function populateResults(){
    var results = queryServer();

    for(var result = 0; result < results.length; result++){
        var newDiv = results[result];
        resultsDiv.appendChild(newDiv);
        setTimeout(
            (function(divReference){
                return function(){
                    divReference.classList.add("cascade");
                };
            }(newDiv)), result * 20);
    }
}

/*
 * AJAX the current query string to the server, and return its response.
 *
 * @return {Array} The server's response in the form of `div.result` DOM
 *      elements, to fill `div#results`.
 */
function queryServer(){
    var resultDivs = []
    for(var result = 0; result < 20; result++){
        var newDiv = document.createElement("div"),
            table = document.createElement("table"),
            row = document.createElement("tr"),
            sidebar = document.createElement("td"),
            codeElt = document.createElement("td"),
            meta = document.createElement("td");

        newDiv.classList.add("result");
        sidebar.id = 'sidebar';
        codeElt.id = 'code';
        meta.id = 'meta';

        sidebar.innerHTML = '';
        codeElt.innerHTML = '<div id=tablecontainer>' + codeExample + '</div>';

        row.appendChild(sidebar);
        row.appendChild(codeElt);
        row.appendChild(meta);
        table.appendChild(row);
        newDiv.appendChild(table);

        resultDivs.push(newDiv);
    }

    return resultDivs;
}

/*
 * Adds more results to `div#results`.
 */
function loadMoreResults(){
    results = queryServer();
    for(var result = 0; result < results.length; result++){
        var newDiv = results[result];
        resultsDiv.appendChild(newDiv);
        setTimeout(
            (function(divReference){
                return function(){
                    divReference.classList.add("cascade");
                };
            }(newDiv)),
            result * 20);
    }
}