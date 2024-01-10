import html from "html-literal";
import infoGraph from "../../images/infographic-cyber.png";
import piestep from "../../images/piestep.png";

export default () => html`
  <main class="index">
    <aside>
      <h2>Asset Discovery!</h2>
      <h3>Features</h3>
      <ul>
        <li>Create an Asset Inventory List</li>
        <li>Export List as a CSV</li>
      </ul>
    </aside>

    <article>
      <h2>Understanding Your Digital Footprint</h2>
      <p>
        Discover the importance of creating an asset inventory list for your
        business and learn simple steps to enhance your cybersecurity. This
        guide provides essential information and free resources to help secure
        your small business in the digital world.
      </p>
      <h3>Introduction</h3>
      <p>
        In today's digital age, protecting your business's digital assets and
        understanding the importance of cybersecurity is more crucial than ever.
        Digital assets, ranging from images and videos to important documents,
        play a vital role in your marketing and operations. Managing these
        assets effectively and securing them against cyber threats is key to
        your business's success and security.
      </p>

      <h3>Understanding Digital Assets</h3>
      <p>
        Digital assets include any content stored digitally that adds value to
        your business. This can be photos, videos, documents, presentations, and
        more. These assets are integral to your marketing campaigns,
        communication, and overall business processes.
      </p>

      <h3>The Need for Digital Asset Management (DAM)</h3>
      <p>
        Effective Digital Asset Management (DAM) systems are essential for
        organizing, storing, and sharing your business's digital assets.
        Especially in an era of digital communication and remote work, a robust
        DAM system not only streamlines workflow but also adds a layer of
        security, saving time and resources.
      </p>

      <h3>Cybersecurity: Protecting Your Digital Assets</h3>
      <p>
        Cyberattacks, which cost the U.S. economy billions annually, often
        target small businesses due to their relatively weaker security
        infrastructures. Common threats include malware, ransomware, and
        phishing attacks. To protect your business, it's crucial to train
        employees on cybersecurity best practices, secure your networks with
        encryption and firewalls, and update your systems regularly.
        Implementing Multi-Factor Authentication (MFA) and managing Cloud
        Service Provider accounts are also vital steps.
      </p>
      <p>
        <img src=${piestep} alt="Secure Your Business Infographic" />
      </p>
      <h3>Implementing Digital Asset Management</h3>
      <p>
        To implement DAM effectively, start by outlining your goals and
        identifying the right software that fits your business needs. Organize
        the life cycle of your digital assets, from creation to distribution,
        and ensure your DAM system integrates well with other systems in your
        business.
      </p>

      <h3>Creating a Cybersecurity Plan</h3>
      <p>
        Begin by assessing your business's cybersecurity risk. Utilize tools
        like the Federal Communications Commission's cybersecurity planning tool
        or the Cyber Resilience Review by DHS. Implement these measures to
        safeguard your systems and data, and ensure you have a plan for managing
        IT supply chain risks.
      </p>
      <p>
        <img src=${infoGraph} alt="Cybersecurity 5 Step Plan" />
      </p>
    </article>
    <h3 class="resources">Free Cybersecurity Resources</h3>
    <table>
      <tr>
        <th>Resource</th>
        <th>Description</th>
        <th>URL</th>
      </tr>
      <tr>
        <td>CISA Cybersecurity Services</td>
        <td>
          Provides a range of no-cost cybersecurity services and tools for U.S.
          businesses.
        </td>
        <td>
          <a
            href="https://www.cisa.gov/resources-tools/resources/free-cybersecurity-services-and-tools"
            >Visit CISA</a
          >
        </td>
      </tr>
      <tr>
        <td>FCC Cybersecurity Planning Tool</td>
        <td>Helps small businesses create a custom cybersecurity plan.</td>
        <td><a href="https://www.fcc.gov/cyberplanner">Visit FCC</a></td>
      </tr>
      <tr>
        <td>NIST Cybersecurity Framework</td>
        <td>Guidelines for reducing cybersecurity risks for organizations.</td>
        <td><a href="https://www.nist.gov/cyberframework">Visit NIST</a></td>
      </tr>
      <tr>
        <td>FTC Cybersecurity for Small Business</td>
        <td>
          Offers resources and tips on protecting businesses from cyber threats.
        </td>
        <td>
          <a
            href="https://www.ftc.gov/tips-advice/business-center/small-businesses/cybersecurity"
            >Visit FTC</a
          >
        </td>
      </tr>
      <tr>
        <td>Small Business Administration (SBA) Cybersecurity</td>
        <td>
          Provides cybersecurity information and resources for small businesses.
        </td>
        <td>
          <a
            href="https://www.sba.gov/business-guide/manage-your-business/small-business-cybersecurity"
            >Visit SBA</a
          >
        </td>
      </tr>
    </table>
  </main>
`;
