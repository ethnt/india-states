# india-states
The Wadhwani Chair in U.S. India Policy Studies has commissioned a new website that will provide comprehensive insight into India’s 29 States’ policies as related to key sectors. The website will be a tool for users: an organized knowledge base that will facilitate greater business and economic understanding and engagement between India and the United States.

Users will be able to access data via two avenues of focus: by State or by sector/subsector. In addition to being a compact source of comparative data, the site offers users access to a curated collection of new articles and reports that support and extend their understanding of the State/sector relationship.

## Setup
1. Copy repo to desktop and navigate to folder in Terminal `$ cd [project folder]`
2. Update bundler dependencies `$ bundler install`
3. Start development server `$ bundle exec jekyll serve`

**Note:** GitHub Pages & Siteleaf handle the build process on sync.

## Directory Structure
The basic site structure for the site looks like this:
```
.
├── _data
├── _includes
├── _layouts
├── _posts
├── _sass
|   ├── custom
|   ├── minima.scss
├── _sectors
├── _site
├── _states
├── _subsectors
├── _trackers
├── assets
|   ├── img
|   └── js
├── .jekyll-metadata
├── _config.yml
├── about.md
├── index.md
├── search.md
├── sectors.md
└── states.md
```
### _data
The `_data` folder contains CSV, JSON, or YAML files that are used throughout the site, but are primarily used to store the data for the National Goal Trackers and the India map geojson. See [Jekyll documentation](https://jekyllrb.com/docs/datafiles/) for more information.

### _includes
The `_includes` folder contains the HTML for the modular pieces of the site's layout that need to be included across multiple pages. For example, `head.html` and `footer.html` are stored here. See [Jekyll documentation](https://jekyllrb.com/docs/includes/) for more information.

### _layouts
The `_layouts` folder contains the HTML for distinctive page layouts. For example, `post.html`, `states.html`, and `sectors.html`. See [Jekyll documentation](https://jekyllrb.com/docs/themes/) for more information.

### _posts
Contains the `.md` files for the news articles/posts. Posts have the the following default front matter:
```
layout: post
content_type: Post
states: 
sectors: 
subsectors: 
sources:
  name: 
  url: 
details:
  name: 
  url:
```
See [Jekyll documentation](https://jekyllrb.com/docs/posts/) for more information.

### _sass
Contains the SASS files for styling the site. As of 2/15/17, the project uses the Minima gem-based theme which means the only files included in this folder are custom sass files specific to the India States project. Likely to get overhauled when the design phase of the site starts. See [Jekyll documentation](https://jekyllrb.com/docs/themes/) for more information.

**Note:** GitHub Pages automatically compiles the SASS files, so don't worry about running a separate compiler.

### _sectors, _states, _subsectors, _trackers
These folders hold the content for their respective content types and are called "collections" in Jekyll terminology. Each state, sector, subsector, etc. gets its own markdown file that contains the relevant front matter and content for that particular item. See [Jekyll documentation](https://jekyllrb.com/docs/collections/) for more information. The default front matter settings for each of these collections is listed below:

#### _sectors
```
layout: sectors
content_type: Sector
```

#### _states
```
layout: states
content_type: State
size: 
population: 
party_affiliation: 
legislative_seats: 
rajya_seats: 
gdp: 
development_indicators:
  mortality: 
  literacy: 
```

#### _subsectors
```
layout: sectors
content_type: Subsector
sector: 
```

#### _trackers
```
layout: trackers
content_type: Tracker
start_date: 
end_date: 
sectors: 
subsectors: 
data_name: 
```

### _site
The compiled site files. This folder is automatically generated by Jekyll's build process. You should not make manual changes to this folder.

### assets
These contain the static assets for the site, including images and JavaScript files. See [Jekyll documentation](https://jekyllrb.com/docs/assets/) for more information.

### [pages].md
Parent level pages on the site, such as `/about`, `/states`, `/sectors`, are created by making a `.md` file in the root directory of the project. See [Jekyll documentation](https://jekyllrb.com/docs/pages/) for more information.


