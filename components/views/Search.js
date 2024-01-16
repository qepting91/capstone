import html from "html-literal";

export default state => html`
  <form id="urlForm">
    <label for="urlInput">Enter URL:</label>
    <input type="text" id="urlInput" />
    <button type="submit" class="button-style">Search</button>
  </form>

  ${state.domainDetails
    ? html`
        <button id="exportCsvButton" class="button-style">
          Export to CSV
        </button>
        <article>
          <h1 class="article-header">Domain Analysis Report</h1>
          <p class="article-subtitle">
            Insightful information about your domain landscape
          </p>
          <div class="article-summary">
            <p>
              Here's a quick overview of your scanned domain. Detailed
              information is provided below.
            </p>
          </div>
          <section class="detail-section">
            <h4>Host URL</h4>
            <p>${state.domainDetails.domain}</p>
          </section>
          ${state.domainDetails.hosts.map(
            host => html`
              <section class="detail-section">
                <h4>Host Information</h4>
                <p><strong>Host URL:</strong> ${host.host}</p>
                <p><strong>IP Address:</strong> ${host.ip_address}</p>
                <p><strong>Cloud Provider:</strong> ${host.cloud.provider}</p>
                <p><strong>Region:</strong> ${host.cloud.region}</p>
                <p><strong>Live:</strong> ${host.is_live ? "Yes" : "No"}</p>
                <p><strong>Ports:</strong> ${host.network_ports.join(", ")}</p>
                <p><strong>Tags:</strong> ${host.tags.join(", ")}</p>
              </section>
            `
          )}
        </article>
      `
    : state.isLoading
    ? `<p>Loading domain details...</p>`
    : `<p>No domain details available. Please submit a URL to search.</p>`}
`;
