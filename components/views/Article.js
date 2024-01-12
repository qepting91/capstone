import html from "html-literal";

export default state => html`
  <table id="articles">
    <tr>
      <th>Title</th>
      <th>Published</th>
    </tr>
    ${state.articles
      .map(article => {
        if (article && article.title && article.link && article.published) {
          const date = new Date(article.published);
          const formattedDate = `${date.getMonth() +
            1}-${date.getDate()}-${date.getFullYear()}`;
          return `<tr>
                    <td><a href="${article.link}" target="_blank">${article.title}</a></td>
                    <td>${formattedDate}</td>
                  </tr>`;
        }
        return ""; // Return an empty string for null or undefined articles
      })
      .join("")}
  </table>
`;
