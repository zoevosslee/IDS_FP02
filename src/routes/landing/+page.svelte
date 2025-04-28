<div class="landing-page">
    <div class="background-overlay"></div>
    <div class="landing-content">
  
        <div class="landing-section">
            <h6>Rent is a Trap</h6>
            <p class="subtitle">Exploring the intersections of policing, displacement, and community resistance.</p>
            <p class="authors">A data story told by Yeonhoo Cho, Nicola Lawford, Claudia Tomateo, and Zoe Voss Lee</p>
            <p class="date">April 2025</p>
          </div>
          
  
      <div class="landing-section">
        <div class="text-block">
          <p class="p2">
            Many people know Breonna Taylor’s name and the injustice of her murder by police. What’s less widely known is the role that real estate interests played in her death. According to 
            <a href="https://theappeal.org/the-role-of-police-igentrification-breonna-taylor/" target="_blank">Brenden Beck (2020)</a>, 
            the police raid that killed Breonna was not an isolated event – it was part of a broader effort to displace residents from a neighborhood targeted for redevelopment:
          </p>
  
          <p class="quote">
            “The raid that killed Taylor was part of a broader effort to evict residents who were impeding the city’s Vision Russell redevelopment initiative. When they broke down Taylor’s door, the Louisville police were seeking to apprehend an associate of Jamarcus Glover, a former boyfriend of Taylor’s who lived on Elliott Avenue at the center of the city’s neighborhood 'renewal' project.”
          </p>
  
          <p>
            Her story reminds us that policing and property development are deeply connected forces. They determine who gets to stay, and who is surveilled, displaced, evicted, and subject to state violence.
          </p>
  
          <p>
            In Boston and across the country, this connection has only deepened since the 2008 financial crisis. Corporate homeownership of homes has soared, while private equity firms like 
            <a href="https://www.invitationtenants.com/blackstone-profits-from-the-foreclosure-crisis/" target="_blank">Blackstone</a> 
            have made billions. Affording housing has become increasingly precarious for 
            <a href="https://www.jchs.harvard.edu/americas-rental-housing-2024" target="_blank">most Americans</a>.
          </p>
  
          <p>
            This project looks at publicly available data—specifically non-criminal policing data like 311 noise complaints and building & property violations—to help illuminate the ways policing and real estate development work together at the city level.
          </p>
  
          <p>
            Our audience is community members like you: renters, homeowners, and neighbors who deserve transparency about the forces reshaping the city. By better understanding these patterns, we can build stronger movements to defend our homes, neighborhoods, and shared futures.
          </p>
        </div>
      </div>
  
      <div class="next-chapter-link">
        <a href="/chapter1">
          ↓ Chapter 1: Introduction
        </a>
      </div>
    </div>
  </div>
  

  <style>
    p {
      margin-bottom: 1.5rem;
      color: var(--red);
      stroke:  white;
      font-size: 2rem;
      font-weight: 800;
    }

    .p2 {
      margin-bottom: 1.5rem;
      color: var(--red);
      stroke: black;
      font-size: 2rem;
      font-weight: 800;
    }


    
    .landing-page {
  position: relative;
  background: url('/protest.jpg') no-repeat center center fixed;
  background-size: cover;
  width: 100%;
  min-height: 300vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6); /* white fade */
  z-index: 1; /* behind content */
}

.landing-content {
  position: relative;
  z-index: 2; /* ABOVE the overlay! */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}


.landing-section {
  min-height: 100vh; /* each section fills the screen */
  width: 90%;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  color: white;
  text-align: left;
}
.text-block {
  background: rgba(255, 255, 255, 0.85); /* slightly translucent white */
  border-radius: 12px;
  max-width: 800px;
  font-family: 'Utendo', sans-serif;
  padding: 2rem; /* add some inner padding */
  color: black; /* set all default text inside to black */
  text-align: left; /* optional: left-align it if you want a more paragraph feel */
}

.text-block p {
  margin-bottom: 1.5rem;
  color: black; /* make sure paragraphs inside are black */
  font-size: 1.2rem;
  font-weight: 400;
}

.text-block .quote {
  font-style: italic;
  color: var(--black);
  font-weight: 500;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.1); /* optional: lighter background behind quote */
  padding: 1rem 2rem; /* space inside the quote */
  margin: 2rem auto; /* add vertical space */
  max-width: 600px; /* make it narrower */
  border-left: 4px solid var(--red-light); /* optional: add a bold red line on the left */
  text-align: left;
}

.text-block a {
  color: black;
  text-decoration: none;
  font-weight: 600; /* optional: make links a little bolder */
  transition: text-decoration 0.3s ease;
}

.text-block a:hover {
  text-decoration: underline;
}


.start-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--red);
  color: white;
  font-family: 'Utendo', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 30px;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.3s ease;
}

.start-button:hover {
  background: var(--red-medium);
  transform: scale(1.05);
}

.subtitle {
  color: black; /* transparent inside */
  font-family: 'Utendo', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.authors {
  color: black;
  font-family: 'Utendo', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.date {
  color: black;
  font-family: 'Utendo', sans-serif;
  font-size: 1rem;
  font-weight: 300;
  margin-top: 0.2rem;
  text-align: left;
}


  </style>