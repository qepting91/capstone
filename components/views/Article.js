import html from "html-literal";

export default state => html`
  <table id="articles">
    <tr>
      <th>Title</th>
      <th>Published</th>
    </tr>
    ${state.articles
      .filter(
        article => article && article.title && article.link && article.published
      ) // Filter out any articles with null values
      .sort((a, b) => new Date(b.published) - new Date(a.published)) // Sort articles by date, most recent first
      .map(article => {
        const date = new Date(article.published);
        const formattedDate = `${date.getMonth() +
          1}-${date.getDate()}-${date.getFullYear()}`;
        return `<tr>
                  <td><a href="${article.link}" target="_blank">${article.title}</a></td>
                  <td>${formattedDate}</td>
                </tr>`;
      })
      .join("")}
  </table>
`;
