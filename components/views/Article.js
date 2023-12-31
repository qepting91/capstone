import html from "html-literal";

export default state => html`
  <table id="articles">
    <tr>
      <th>Title</th>
      <th>Link</th>
      <th>Published</th>
      <th>Description</th>
      <th>Creator</th>
    </tr>
    ${state.articles
      .map(article => {
        return `<tr><td>${article.title}</td><td>${article.link}</td><td>${article.published}</td><td>${article.description}</td><td>${article.creator}</td></tr>`;
      })
      .join("")}
  </table>
`;
