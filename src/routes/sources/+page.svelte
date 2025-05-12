<svelte:head>
  <title>Rent is a Trap!</title>
</svelte:head>

<div id="home-page">
  <div class="container">
    <div class="text-content">
      <h1>Rent is a Trap!</h1>
      <h2>By Yeonhoo Cho, Nicola Lawford, Claudia Tomateo, Zoe Voss Lee</h2>

      <p>
        This project was developed with guidance and feedback from the 
        <a href="https://www.mapc.org/" target="_blank" rel="noopener noreferrer">
          Metropolitan Area Planning Council (MAPC)
        </a>.
      </p>

      <h2>Chapter 1: Sources</h2>

      <p>
        <strong>Boston Indicators (2023).</strong>
        <a href="https://www.bostonindicators.org/indicators/housing#:~:text=Housing%20cost%20burdens%20have%20increased,the%20same%20in%202009%2D2013" target="_blank" rel="noopener noreferrer">
          Housing Indicators
        </a><br>
        • Source for Boston’s 1990 rent burden rate.
      </p>

      <p>
        <strong>City Life/Vida Urbana (2020).</strong> 
        <a href="https://d3n8a8pro7vhmx.cloudfront.net/themes/5eee7e564445ea4f9a6f3080/attachments/original/1592786979/EvictionReport_Final_Spreads.pdf?1592786979" target="_blank" rel="noopener noreferrer">
          Evicted for Being Poor
        </a><br>
        • Core inspiration for the structure and framing of the eviction process chart.<br>
        • Provided key data points on the unequal distribution of eviction filings across Boston neighborhoods.
      </p>

      <p>
        <strong>Desmond, Matthew.</strong> <em>Evicted: Poverty and Profit in the American City</em>.<br>
        • Informed the broader framing around evictions, particularly the role that auxiliary policing plays in eviction proceedings.<br>
      </p>
      <p>
        <strong>Eviction Lab (2022).</strong>
        <a href="https://evictionlab.org/rising-rents-and-evictions-linked-to-premature-death/" target="_blank" rel="noopener noreferrer">
          Rising Rents and Evictions Linked to Premature Death
        </a><br>
        • Cited to demonstrate the connection between rent burden, eviction risk, and public health outcomes.
      </p>
      <p>
        <strong>NPR (2016).</strong> 
        <a href="https://www.npr.org/2016/06/29/482615176/for-low-income-victims-nuisance-laws-force-ultimatum-silence-or-eviction" target="_blank" rel="noopener noreferrer">
          For Low-Income Victims, Nuisance Laws Force Ultimatum: Silence Or Eviction
        </a><br>
        • Used to illustrate how 311 complaints and nuisance laws are weaponized against tenants.
      </p>

      <p>
        <strong>SmartMove (n.d.).</strong> 
        <a href="https://www.mysmartmove.com/tenant-screening-services/resident-score" target="_blank" rel="noopener noreferrer">
          What is a Resident Score?
        </a><br>
        • An example of predictive tenant screening algorithms.
      </p>

      <p>
        <strong>USC Homelessness Policy Research Institute.</strong> 
        <a href="https://hpri.usc.edu/homeless_research/opening-the-black-box-of-tenant-screening/" target="_blank" rel="noopener noreferrer">
          Opening the Black Box of Tenant Screening
        </a><br>
        • Provided context on bias and opacity in tenant screening technologies.
      </p>

      <p>
        <strong>HUD v. Rucker.</strong> 
        <a href="https://www.oyez.org/cases/2001/00-1770" target="_blank" rel="noopener noreferrer">
          Case summary on Oyez
        </a><br>
        • Cited to show how public housing tenants can be evicted based on alleged criminal behavior.
      </p>

      <p>
        <strong>The Appeal (2020).</strong> 
        <a href="https://theappeal.org/the-role-of-police-igentrification-breonna-taylor/" target="_blank" rel="noopener noreferrer">
          The Role of Police in Gentrification: Breonna Taylor
        </a><br>
        • Contextualized how policing and displacement intersect, especially in gentrifying neighborhoods.
      </p>

      <p>
        <strong>Tennessee Lookout (2020).</strong> 
        <a href="https://tennesseelookout.com/2020/12/02/immigrants-face-unique-challenges-in-staving-off-evictions/" target="_blank" rel="noopener noreferrer">
          Immigrants Face Unique Challenges in Staving Off Evictions
        </a><br>
        • Informed the immigration policing section; showed how fear of ICE affects court attendance, contributing to displacement.
      </p>

      <p>
        <strong>MALDEF (2025).</strong> 
        <a href="https://www.maldef.org/2025/03/court-orders-landlord-to-pay-80000-for-threatening-to-call-ice-on-tenant/" target="_blank" rel="noopener noreferrer">
          Court Orders Landlord to Pay $80,000 for Threatening to Call ICE
        </a><br>
        • Example of landlord harassment using immigration enforcement as a threat.
      </p>

      <p>
        <strong>State Court Report (2024).</strong> 
        <a href="https://statecourtreport.org/our-work/analysis-opinion/ices-new-courthouse-arrest-policy-set-them-collision-course-state-courts" target="_blank" rel="noopener noreferrer">
          ICE’s New Courthouse Arrest Policy on Collision Course with State Courts
        </a><br>
        • Demonstrated the risks undocumented tenants face when entering housing court.
      </p>
    </div>
  <div>

    <h2>Chapter 2: Data Sources</h2>
<p>
  <strong>Mapping Inequality</strong>
  <a href="https://dsl.richmond.edu/panorama/redlining" target="_blank" rel="noopener noreferrer">
    Redlining in New Deal America
  </a><br>
  • Provided historical maps of redlining in Boston.
</p>

<p>
<strong>Boston Police Department (2020)</strong> 
  <a href="https://www.boston.gov/departments/police" target="_blank" rel="noopener noreferrer">
    Arrest data
  </a><br>
  • Provided data on police arrests in Boston.
</p>

<p>
<strong>American Community Survey (2019-2023)</strong> 
  <a href="https://data.census.gov/" target="_blank" rel="noopener noreferrer">
    Rent burden rate data
  </a><br>
  • Provided data on rent burden rates in Boston neighborhoods.
</p>

<p>
<strong>Warren Group</strong> 
  <br>
  • Provided data on investor purchases of residential properties in Boston.
</p>

<p>
<strong>MAPC</strong> 
  <br>
  • Eviction data.
</p>

    <p>
        Cover Image Source: <a href="https://bostonresearchcenter.org/digitizing-bostons-powerful-chinatown-neighborhood-history/" target="_blank" rel="noopener noreferrer">Northeastern University Library Boston Research Center</a>
    </p>
    <p>
        Cover Image Source: <a href="https://bostonresearchcenter.org/digitizing-bostons-powerful-chinatown-neighborhood-history/" target="_blank" rel="noopener noreferrer">Northeastern University Library Boston Research Center</a>
    </p>
    </div>
  <div>

    <h2>Chapter 2: Sources</h2>
<p>
  <strong>Mapping Inequality</strong>
  <a href="https://dsl.richmond.edu/panorama/redlining" target="_blank" rel="noopener noreferrer">
    Redlining in New Deal America
  </a><br>
  • Provided historical maps of redlining in Boston.
</p>

<p>
<strong>Boston Police Department (2020)</strong> 
  <a href="https://www.boston.gov/departments/police" target="_blank" rel="noopener noreferrer">
    Arrest data
  </a><br>
  • Provided data on police arrests in Boston.
</p>

<p>
<strong>American Community Survey (2019-2023)</strong> 
  <a href="https://data.census.gov/" target="_blank" rel="noopener noreferrer">
    Rent burden rate data
  </a><br>
  • Provided data on rent burden rates in Boston neighborhoods.
</p>

<p>
<strong>Warren Group</strong> 
  <br>
  • Provided data on investor purchases of residential properties in Boston.
</p>

<p>
<strong>MAPC</strong> 
  <br>
  • Eviction data.
</p>

    <p>
        Portions of code formatting and debugging were supported by OpenAI’s ChatGPT, GPT-4o version.
    </p>

  <h2>Chapter 3: Sources</h2>

  <p>
    <strong>Gentrification Indicators</strong> 
    <a href="https://data.census.gov" target="_blank" rel="noopener noreferrer">
      Census Data
    </a><br>
    • To inform the chloropleth maps for education, income, race, and rent burden<br>
  </p>

  <p>
    <strong>311 Requests</strong> 
    <a href="https://data.boston.gov/dataset/311-service-requests" target="_blank" rel="noopener noreferrer">
      Analyze Boston
    </a><br>
    • For the first topographic surface<br>
  </p>

  <p>
    <strong>Building & Property Violations</strong> 
    <a href="https://data.boston.gov/dataset/building-and-property-violations1" target="_blank" rel="noopener noreferrer">
      Analyze Boston
    </a><br>
    • For the second topographic surface<br>
  </p>

  <p>
    <strong>Arrests Density per 1000 people</strong> 
    <a href="https://boston-pd-crime-hub-boston.hub.arcgis.com/datasets/8cec12c8d60140aca2827eb45484f10b/explore" target="_blank" rel="noopener noreferrer">
      Boston Police Department
    </a><br>
    • For the second topographic surface<br>
  </p>

  <p>
    <strong>Neighborhood Boundaries Approximated to Census Tracts</strong> 
    <a href="https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::boston-neighborhood-boundaries-approximated-by-2020-census-block-groups/about" target="_blank" rel="noopener noreferrer">
      Analyze Boston
    </a><br>
    • For basemap<br>
  </p>

  <h2>Chapter 4: Sources</h2>

  <p>
    <strong>Housing Redevelopment Protest on Hefferan Street Picture</strong> 
    <a href="https://apps.bostonglobe.com/2023/10/special-projects/spotlight-boston-housing/milton-restrictive-zoning/" target="_blank" rel="noopener noreferrer">
      Boston Globe
    </a><br>
    • Image<br>
  </p>

  <p>
    <strong>Anti-urban renewal protestors picketing the Smith Transfer Corp</strong> 
    <a href="https://apps.bostonglobe.com/2023/10/special-projects/spotlight-boston-housing/milton-restrictive-zoning/" target="_blank" rel="noopener noreferrer">
      Boston Globe
    </a><br>
    • Image<br>
  </p>

  <p>
    <strong>Members of Homes for All massachusetts stand out in front of the State House</strong> 
    <a href="https://www.bostonherald.com/2022/10/26/a-failing-grade-boston-housing-report-card-illustrates-depth-of-crisis/" target="_blank" rel="noopener noreferrer">
      Boston Globe
    </a><br>
    • Image<br>
  </p>

  <p>
    <strong>Boston Tent City</strong> 
    <a href="https://archive.is/20230107231626/https://www.bostonglobe.com/2023/01/07/metro/tent-city-once-triumph-community-activism-is-now-home-strife-over-maintenance-security/#selection-2023.138-2027.23" target="_blank" rel="noopener noreferrer">
      Boston Globe
    </a><br>
    • Image<br>
  </p>

  <p>
    <strong>March to promote the 'Campaign of Conscience'</strong> 
    <a href="https://static1.squarespace.com/static/56340b91e4b017e2546998c0/t/5c7811640852290f392207ca/1551372655581/CPA+report+final+2019.pdf" target="_blank" rel="noopener noreferrer">
      Forced From Home: A Human Rights Assessment of Displacement and Evictions on Boston's Chinatown
    </a><br>
    • Image<br>
  </p>

  <p>
    <strong>Anti-displacement protest in Chinatown</strong> 
    <a href="http://jamaicaplaingazette.com/2013/05/10/city-life-marks-40-years-of-helping-residents/" target="_blank" rel="noopener noreferrer">
      Jamaica Plain Gazette
    </a><br>
    • Image<br>
  </p>

  <p>
    <strong>Saundra Graham speaks into a megaphone suring the occupation</strong> 
    <a href="https://historycambridge.org/self-guided-tours/self-guided-tour-women-activists-of-riverside-50-years-after-suffrage/" target="_blank" rel="noopener noreferrer">
      History Cambridge
    </a><br>
    • Image<br>
  </p>

  <p>
    <strong>Joanne Palham and Saundra Graham speaking at Policy brutality Hearings</strong> 
    <a href="https://historycambridge.org/self-guided-tours/self-guided-tour-women-activists-of-riverside-50-years-after-suffrage/" target="_blank" rel="noopener noreferrer">
      History Cambridge
    </a><br>
    • Image<br>
  </p>

  <p>
    <strong>Quotes from community members</strong> 
    <a href="https://www.clvu.org/lucia_victory" target="_blank" rel="noopener noreferrer">
      City life Vida Urbana
    </a><br>
    • Quotes<br>
  </p>

  <p>
    <strong>Quotes from community members</strong> 
    <a href="https://tennesseelookout.com/2020/12/02/immigrants-face-unique-challenges-in-staving-off-evictions/" target="_blank" rel="noopener noreferrer">
      Tennessee Lookout
    </a><br>
    • Quotes<br>
  </p>
      
    </div>
  </div>
</div>


<style>
  .text-content p {
    margin-bottom: 1.6rem;
    line-height: 1.7;
    font-size: 1rem;
  }

  .text-content a {
    color: var(--red-medium);
    text-decoration: none;
  }

  .text-content a:hover {
    text-decoration: underline;
  }

  h2 {
    margin-bottom: 1rem;
  }

  .container {
    padding-bottom: 10rem;
  }
</style>
