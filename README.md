# Congressional-Data
What are your Representatives in Congress up to? Using this simple tool, you can get useful information about every currently sitting member of Congress. Currently, the page displays contact information, bill sponsorship/cosponsorship, how often they vote with their party, and how often they miss votes.

Deployed Version: https://congressional-data.herokuapp.com/

## Dependencies
There are a number of dependencies required to run this app locally. All can be installed with ```npm install```. To install manually, you need to add the following packages:
* ```body-parser```
* ```express```
* ```express-handlebars```
* ```path```
* ```request```

Additional external sources linked in the html are [D3 v4](https://d3js.org/), [Materialize](http://materializecss.com/), and [jQuery](https://code.jquery.com/).

## Data
All data for the application was sourced from ProPublica's [Congress API](https://projects.propublica.org/api-docs/congress-api/). Analytics and display of the data was done with D3's data analytics tools and charting functions. Some excellent tutorials for D3 can be found on their [wiki](https://github.com/d3/d3/wiki/tutorials).
