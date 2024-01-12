import html from "html-literal";
export default links => html`
  <nav>
    <div class="click-here-container">
      <i class="fa-regular fa-compass"></i> Click Here
    </div>
    <ul class="hidden--mobile nav-links">
      ${links
        .map(
          link =>
            `<li><a href="/${link.title}" title="${link.title}" data-navigo>${link.text}</a></li>`
        )
        .join("")}
    </ul>
  </nav>
`;
