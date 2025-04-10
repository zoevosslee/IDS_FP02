<svelte:head>
  <title>Rent is a Trap!</title>
</svelte:head>

<div id="plan-page">
  <div class="container">
    <div class="text-content">
      <h4>Rent is a Trap!</h4>
      <h2>By Yeonhoo Cho, Nicola Lawford, Claudia Tomateo, Zoe Voss Lee</h2>
    </div>
    <div class = "writeup">
        <h3>Write Up</h3>

        <p>Rent is a trap! Is a project focused on understanding the role of policing in consolidating the interest of speculative investors which in turn facilitates gentrification and contributes to displacement. As we can see in the police killing of Breonna Taylor in 2020, there was a real-estate motif to raid her home. Her neighborhood was being targeted with nuisance violations and low-level arrests. Following her death, the home was foreclosed and sold to the city of Louisville for $1. We argue that this is not a coincidence, and that policing activity leads to direct property transfers ultimately benefiting investors.
        </p>
        <p>For this, we take an abolitionist approach, one that allows us to imagine different futures outside the boundaries of policing reform. In doing so, we aim to show the instances where policing and gentrification happens concurrently in the Boston area while centering community members and organizations visions for living and creating collective wealth.
        </p>
        <p><strong>Rationale for Variables & How to Show Them
        </strong></p>
        <p>First, we defined 4 gentrification variables: education level (Bachelor’s Degrees or Higher), household median income, percentage of non-Hispanic white population, and percentage of rent burdened population (those who pay more than 30% of income for rent). Given the diverse scholarship on defining gentrification, we decided that we will leave up to the readers to explore different possible variables and create their own analysis on gentrification. For instance, abolitionists such as Ruth Wilson Gilmore and Mariame Kaba would conceptualize gentrification as a carceral logic of spatial control where policing and real estate act to displaced racialized and marginalized communities for wealth accumulation; Black activists and scholars would define gentrification as racially driven displacement following the patterns of redlining and state violence; and Indigenous thinkers would frame gentrification as an extension of settler claims to land through aesthetics, dispossession and ownership. With an interactive map, we invite the users to construct their own definition of gentrification from their own positionalities.
        </p>
        <p>To respond to activists' needs of mapping policing in relationship to gentrification, we defined 2 variables that would describe the neighborhood-level policing: 311 calls assigned to Boston Police Department and code, building and property violations. We would have liked to include arrest data, specifically low-level arrest data which many academics have studied and proven to show high correlation with gentrification. However, our Freedom of Information Law public data request was rejected by the Boston Police Department. This lack of data compelled us to reconsider our argument. Our previous work with undocumented workers teaches us that oftentimes the state may deploy non-criminal policing actors in addition to police arrests as a means of exclusionary development of a neighborhood. Leaning on to these observations, we decided to focus on looking at non-criminal policing. Like gentrification data, we also let the readers explore the data freely and create their own analysis.
        </p>

        <p><strong>Rationale for Visualization
        </strong></p>
        <p>Initially, we considered using sliders, pop-up maps, and non-geographical approaches to make the project interactive. In the end, we developed a platform that compiles key indicators into a clear, user-friendly menu with the ability to overlay data.
        </p>
        <p>We designed the platform to allow users to interact with different indicators and explore the relationship between policing and gentrification in their neighborhoods. Also, users can search for locations by address, this allows people unfamiliar with maps to navigate the platform in a more friendly way. In the final design, users will be introduced to each variable before arriving at the interactive map.
        </p>
        <p>To help users easily identify patterns, we implemented choropleth maps, which are zoomable and rotatable. A menu allows users to toggle indicators on and off, and switch between data from 2015 and 2023.
        </p>
        <p>We also had early conversations about new ways to visualize overlapping variables, and we hope to incorporate those methods in future updates. Some ideas here:
        </p>
        <ul>
          <li><p>Using choropleth for categorical variables and 3D surfaces for quantitative variables.
          </p></li>
          <li><p>Using 3d extrusions for some variables and icon/size for other variables.</p></li>
          </ul>
        <p>Finally, as part of our narrative we have planned to introduce other non-geographical visualizations such as a timeline to show police budget and displacement events and moving tiles to address the issue of missing data on these matters. We find these important to situate the community challenges and it is something we will work for future iterations.
        </p>
        <p><strong>Overview of Our Development Process and Opportunities to Improve</strong></p>
        <p>We have met around 4 times as a team to discuss ideas, data, and developments. In our first meetings we talked about ways of representing data, different elements of the map and workflow. We collectively decided that the best way to address the development of our project was to work first on the interactive map and that we will use different branches on github for version control. Collectively, we have spent 56 hours working on the project.
        </p>
        <p>The components that took the most time were writing the JavaScript components to effectively connect the data to the Svelte components, and Mapbox. While some of our team members have MapBox programming development experience, working with d3 and the Svelte environment are new to our team.
        </p>
        <p>Each person contributed as follows:</p>
        <p>Zoe</p>
        <ul>
          <li><p>Set up the project architecture and file structure from scratch
          </p></li>
          <li><p>Built prototypes of the interactive components that teammates built upon: layer selection panel, floating info panel, and year toggle
          </p></li>
          <li><p>Integrated D3 to load and process GeoJSON data dynamically
          </p></li>
          <li><p>Developed map interactions using Mapbox GL JS, including layer toggling, and feature-based popups
          </p></li>
          <li><p>Contributed to project planning and collaborative discussions on data selection, communication, and visualization. 
          </p></li>
          <li><p>Contributed to overall UX decisions 
          </p></li>
        </ul>
        <p>Nicola</p>
        <ul>
          <li><p>3D extrusion feature to show policing indicators, radio buttons control, and debugging outlier values
          </p></li>
          <li><p>formatting of popup to include sentences, handle missing data, show policing indicators, and float below the search bar
          </p></li>
        </ul>
        <p>Yeonhoo</p>
        <ul>
          <li><p>Provide academic literature and activist conversations regarding speculative policing
          </p></li>
          <li><p>Filed a public data request to the Boston Police Department
          </p></li>
          <li><p>Acquire, clean, and merge datasets as readable in Mapbox.
          </p></li>
          <li><p>Create 8 choropleth maps that react to dropdown menus of gentrification indicators.
          </p></li>
          <li><p>Contributed to project planning and collaborative discussions on data selection, communication, and visualization.
          </p></li>
        </ul>
        <p>Claudia</p>
        <ul>
          <li><p>Updated color scheme
          </p></li>
          <li><p>Added the address search for mapbox
          </p></li>
          <li><p>Tried to create a surface with three.js to then bring it to mapbox but it didn’t work
          </p></li>
          <li><p>Converted 311 calls polygon layer into Geotif in QGIS
          </p></li>
          <li><p>Upload the  Geotif to tiles in Mapbox</p></li>
          <li><p>Brought the ‘topographical’ surface into the project
          </p></li>
          <li><p>Lead the write-up component of the submission
          </p></li>
          <li><p>Contributed to overall UX decisions
          </p></li>
          <li><p>Contributed to project planning and collaborative discussions on data selection, communication, and visualization.
          </p></li>
        </ul>
        
    </div>
    </div>  
    </div>