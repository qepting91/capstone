import html from "html-literal";

export default state => html`
  <form id="urlForm">
    <label for="urlInput">Enter URL:</label>
    <input type="text" id="urlInput" />
    <button type="submit">Search</button>
  </form>
  <div id="results">
    ${state.domainDetails
      ? `
          <h2>Results for: ${state.domainDetails.domain}</h2>
          <p>Last Scanned: ${new Date(
            state.domainDetails.metadata.last_scanned * 1000
          ).toLocaleString()}</p>
          <h3>Hosts:</h3>
          <ul>
            ${state.domainDetails.hosts
              .map(
                host => `
              <li>
                <strong>Host:</strong> ${host.host}
                <strong>IP Address:</strong> ${host.ip_address}
                <strong>Cloud Provider:</strong> ${host.cloud.provider}
                <strong>Region:</strong> ${host.cloud.region}
                <strong>Live:</strong> ${host.is_live ? "Yes" : "No"}
                <strong>Ports:</strong> ${host.network_ports.join(", ")}
                <strong>Tags:</strong> ${host.tags.join(", ")}
              </li>
            `
              )
              .join("")}
          </ul>
        `
      : "<p>No results found.</p>"}
  </div>
`;
