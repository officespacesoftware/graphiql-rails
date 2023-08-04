document.addEventListener("DOMContentLoaded", function(event) {
  var graphiqlContainer = document.getElementById("graphiql-container");
  var parameters = {};

  var queryParams = graphiqlContainer.dataset.queryParams;

  function onEditQuery(newQuery) {
    parameters.query = newQuery;
    updateURL();
  }
  function onEditVariables(newVariables) {
    parameters.variables = newVariables;
    updateURL();
  }
  function updateURL() {
    var newSearch = '?' + Object.keys(parameters).map(function (key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(parameters[key]);
    }).join('&');
    history.replaceState(null, null, newSearch);
  }

  if (queryParams === 'true') {
    // Parse the search string to get url parameters.
    var search = window.location.search;
    search.substr(1).split('&').forEach(function (entry) {
      var eq = entry.indexOf('=');
      if (eq >= 0) {
        parameters[decodeURIComponent(entry.slice(0, eq))] =
          decodeURIComponent(entry.slice(eq + 1));
      }
    });
    // if variables was provided, try to format it.
    if (parameters.variables) {
      try {
        parameters.variables =
          JSON.stringify(JSON.parse(parameters.variables), null, 2);
      } catch (e) {
        // Do nothing, we want to display the invalid JSON as a string, rather
        // than present an error.
      }
    }
    // When the query and variables string is edited, update the URL bar so
    // that it can be easily shared
  }


  // Defines a GraphQL fetcher using the fetch API.
  var graphQLEndpoint = graphiqlContainer.dataset.graphqlEndpointPath;
  var providedHeaders = JSON.parse(graphiqlContainer.dataset.headers)
  function graphQLFetcher(graphQLParams, options) {
    return fetch(graphQLEndpoint, {
      method: 'post',
      headers: {...providedHeaders, ...options.headers},
      body: JSON.stringify(graphQLParams),
      credentials: 'include',
    }).then(function(response) {
      try {
        return response.json();
      } catch(error) {
        return {
          "status": response.status,
          "message": "The server responded with invalid JSON, this is probably a server-side error",
          "response": response.text(),
        };
      }
    })
  }

  function GraphiQLInitializer() {
    console.log("graphiqlContainer", graphiqlContainer)
    const [query, setQuery] = React.useState(graphiqlContainer.dataset.initialQuery || undefined)

    const chatGPTPlugin = graphiqlPluginChatgpt.useChatGPTPlugin({
      config: { provider: "openai", apiKey: 'ADD-YOUR-KEY-HERE' },
      userId: "user1",
      query: query,
      onEdit: setQuery,
    });

    const explorerPlugin = GraphiQLPluginExplorer.useExplorerPlugin({
      query,
      onEdit: setQuery,
    });

    var elementProps = { fetcher: graphQLFetcher, 
      query, 
      onEditQuery: setQuery, 
      defaultEditorToolsVisibility: true,
      plugins: [explorerPlugin, chatGPTPlugin] 
    }

    return React.createElement(GraphiQL, elementProps);
  }

  ReactDOM.render(
    React.createElement(GraphiQLInitializer),
    document.getElementById("graphiql-container")
  );
});
