import html from "html-literal";

export default state => html`
  <form id="urlForm">
    <label for="urlInput">Enter URL:</label>
    <input type="text" id="urlInput" />
    <button type="submit">Search</button>
  </form>
  <div id="results">
    ${state.domainDetails
      ? `<p>Results: ${JSON.stringify(state.domainDetails)}</p>`
      : "<p>No results found.</p>"}
  </div>
`;
