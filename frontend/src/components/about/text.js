const imgRoot = './images/'

const getImgPath = (imgText) => {
    return `${imgRoot}${imgText}.png`
}

const GENERALFAQ = {
    title: 'What is the purpose of this site?',
    text: `The goal of this website is to provide a jumping off point to travellers who enjoy exploring a new city through its cafes. 
    Digital Nomads in particular should find various features highlighting Remote-Work friendly cafes to be useful, but with the ability
    to emphasize food or ambience, automated grouping, and term filtering, I hope many different people find value in this site.`,
    subTopics: [
        {
            title: 'What does "Find a matching café" do?',
            text: `The leftmost tab; "Find a matching café", is intended to find you the most mathematically similar cafes to a cafe you 
            know and love in a city you are travelling to. So search for a cafe you like in the left input, search for the city you're 
            travelling to in the right-side input, and select whether you'd like to emphasize ambience, default or food. The ten most 
            similar cafes from the dataset will be output, in descending order of similarity - so the topmost result is the most similar.`,
            img: 'findMatchingNavBar',
            img2: 'findMatchingOutcome'
        },
        {
            title: 'What does "Explore city" do?',
            text: `"Explore city" is for when you are travelling to a city (or simply exploring the one you're in) and would like to 
            use this tool to find some great options without already having an ideal cafe in mind. This view will group the cafes
            using machine learning - depending in part on your selected emphasis - it will surface terms important to that group, allow
            you to filter by terms, optionally draw attention to those cafes that are probably very Digital Nomad friendly, and as always
            view their distribution on the map.`,
            img: 'exploreCityNavBar',
            img2: 'exploreCityOutcome'
        }
    ]
}

const ALGORITHMFAQ = {
    title: 'What are the results based on?',
    text: `Results are derived from externally-sourced cafe reviews. Up to eighty reviews are scraped for each cafe, and those places having
    less than 800 characters of total review text are discarded for insufficient data. In order to retrieve cafes for a city, this
    website first geolocates the center of the city, then uses Googles' 'Places' API to request to the top 60 establishments listed as
    'cafe' within 2.5km of that center.`,
    subTopics: [
        {
            title: 'How are the cafés retrieved?',
            text: `Retrieving cafe reviews requires using a combination of the Google Places API, Geocoding API, and web scraping to start. 
            In the future I intend to add new cafes to cities on an individual basis as they are searched, perhaps using proximity to
            previously-loaded city locations.`
        },
        {
            title: 'What text processing is being used?',
            text: `Each cafes' reviews are concatenated into one large string. The strings are then processed into a Bag of Words vector
            through TF-IDF processing. Term-Frequency/Inverse Document Frequency weights terms more highly if they occur MORE often within
            a single cafes reviews, and as they occur LESS often in other cafes reviews. The Bag of Words itself is produced by stripping 
            stopwords from the 10k most common English words, and (Porter) Stemming the result; which is a ~6800 dimensional vector. Next,
            cafe-specific food (e.g. 'ristretto'), ambience (e.g. 'homey'), and remote-work (e.g. 'outlet') terms stemmed and appended to 
            this vector. Finally these cafe-specific terms are given a not_(term) form to account for negation. E.g. 'This cafe has no 
            outlets' -> ['cafe', 'no', 'outlet'] -> ['cafe', 'not_outlet']. Negation handling is accomplished using a two-term static 
            window (the two terms following a negation term like few, no, not, rarely, n't become a not_(term)). Studies suggest this 
            improves sentiment capturing significantly with relative ease, which is borne out by personal experience.`
        },
        {
            title: 'How does each tab work?',
            text: `'Find a matching cafe' simply processes the new cafe in the above-described manner, then compares the resultant vector
            against the vectors associated with all of the target cities' cafes. The ten vectors with the least difference mathematically 
            are returned, in order of least to most difference. 'Explore City' is where the actual machine learning comes in. This view
            operates over all cafe vectors associated with a city. The main algorithm used is K-Means, an unsupervised ML algorithm that 
            groups items together based on coordinates. However; K-Means works very poorly in sparse high-dimensional space (The Curse of
            Dimensionality), and Bag of Words with this relatively small dataset is exactly that. Therefore I first run PCA, to reduce the
            dimensionality (to 5) while preserving spacial relationships. These lower-dimensional vectors are then fed into K-Means 10 times, 
            each for 5 iterations and 9 clusters. The output with the lowest 'cost' is then cached and returned.`
        },
        {
            title: 'Emphasize ambience/food/default?',
            text: `As explained above, cafes are converted into mathematical vectors of term value. Special terms pertaining to food, ambience,
            and remote-work are kept in known positions at the end of these cafe-vectors. Because these positions are known, I am able to 
            upweight them - which increases their impact on mathematical operations over the overall vector - selectively. When emphasizing 
            food, all food term weights are multiplied by 10, and ambience + remote work terms are only multiplied by 2. Emphasize ambience and
            this pattern is reversed, emphasize default and all special terms are multiplied by 4.`
        }
    ]
}

const RESULTSFAQ = {
    title: 'How do I interpret the results?',
    text: `If something is not clear about the website, hopefuly some help can be found below.`,
    subTopics: [
        {
            title: 'How do I interpret the wordcloud?',
            text: `Wordclouds are used to present terms while conveying their value. Terms with a larger font size have higher value than
            smaller-sized terms. Value is increased by term frequency in a cafes reviews, reduced if it appears in many cafes' reviews (e.g.
            'nice'), and increased by weighting if applicable. Terms are highlighted in brown if they are a term filter, green if they are
            pertinant to Remote Work, and light brown if they are 'common terms'.`
        },
        {
            title: 'Filtering by term?',
            text: `The search bar found at the top of the outcome page allows users to filter out cafes which do not have the desired term in 
            their top 100 terms. Term filters will then be highlighted dark brown in cafe wordclouds. An example use case is a user who specifically 
            wants to find a small cafe that has oat milk. They could filter by 'cute' and 'oat', knowing that in this context oat is normally 
            associated with milk, and statements like "they don't serve oat milk" would be processed into "not_oat". The search bar only allows 
            predetermined 'special terms' which  can be found at least once in any of the cafes returned - Supercalifragilistic was never an option.`,
            img: 'termFilteringMap',
            img2: 'termFilteringDetails'
        },
        {
            title: 'Remote work highlighting?',
            text: `Remote work highlighting is turned on by default, this can be turned off using the toggle at the top of the outcome page. 
            When turned on, any cafe with greater than 1% of its terms relating (positively) to remote work will have a green border. The top three
            cafes with the most positive RW terms will have crowns of bronze, silver and of course gold - which will have the highest RW term value.
            Keep in mind value does not always mean most - if one cafe has hundreds of mentions of coworking and laptop but nothing else, it will rate
            higher than other cafes that mention every possible RW term only once. Finally, RW terms will be highlighted green in the wordcloud.`,
            img: 'rwHighlightingOn',
            img2: 'rwHighlightingOff'
        },
        {
            title: 'Common terms?',
            text: `'Common terms' are highlighted in light brown, and have a slightly different implementation - though the same intent - depending
            on which tab you're viewing. While on 'Find a Similar Cafe' its fairly simple; terms in brown are shared with the target cafe. So if your 
            cafe wordcloud contains the term 'quaint', any instance of that term in the ten returned cafes' wordclouds will be highlighted. On the
            'Explore City' tab, it's a little more complicated. Because groups are of varying sizes, and can share similarities that transcend
            individual terms, the likelihood of meaning-rich terms being present in EVERY cafe of a group falls off a cliff as the group grows larger.
            In large groups the only shared terms are things like 'was' and 'good'. Therefore common terms are arrived at by adding together the term
            values of every cafe in the group, removing those which are not in at least two, and taking the 20 highest value terms from the resultant
            additive vector. The top six of these are presented explicitely ('This grouping may emphasize the following terms').`,
            img: 'findMatchingInCommon',
            img2: 'exploreCityInCommon'
        },
        {
            title: '"Not_" syntax?',
            text: `The 'not_(term)' syntax is intended to capture sentiment by seperating negative and positive uses of a term. Prior to implementation,
            if reviews were constantly saying 'This cafe is not clean' and 'They never clean this cafe', the algorithm would have stripped the 'not' and
            simply reported 'clean' as being highly important to this cafe. By using static negation handling this sentiment has been handled much more 
            accurately. When the algorithm runs across any negation term (not, no, never, rarely, n't, seldom, etc.), it converts the next two terms to 
            their not_ form. This captures things like 'This place is not modern' and 'This place is not very modern'; not_very gets stripped because 
            there is no place for it on the mathemetical vector, and not_modern remains. This method is not perfect, for example modern is too far from 
            'not' in 'This place is not the most modern', and 'This place is not inviting, modern design cues abound.' captures not_modern erroneously. 
            But external research and personal testing has indicated that accuracy is improved substantially by implementing this method.`,
            img: 'notSyntax'
        }
    ]
}

const MISCFAQ = {
    title: 'Website roadmap',
    text: `For meta details about this website, possible future changes.`,
    subTopics: [
        {
            title: 'Result accuracy',
            text: `I have a few changes in mind as I continue to support this website. In the short term I can probably noticeably improve result accuracy
            by removing or adding terms. Examples I am currently looking at include removing 'work' from RW terms, because it is much more frequently used
            in the context of getting a coffee before work, or talking about employees working there, than remote work. However; Remote Workers frequently
            say 'get some work done', so I can jump through some hoops to capture that specific phrase. There are also plenty of food terms I have yet to 
            add. Long term accuracy improvements could be gained possibly by partnering with a review-hosting website like Yelp, Google, or TripAdviser to 
            acquire much more data, as well as using a new, more advanced, and much cooler algorithm called doc2vec.`
        },
        {
            title: 'Loading new cities',
            text: `Currently I can't justify the cost of allowing the loading of multiple cities per user, which is why logging in to load new cities is a
            requirement. In the future if this website gains interest, I may find some way to fund it, whether through patreon, ads, a partnership, etc.`
        },
        {
            title: 'Design',
            text: `I'm not a designer, unsurprisingly. Paying a designer to make some revisions, therefore, would probably be a very good move.`
        },
        {
            title: 'Contact me',
            text: `If you have any comments, suggestions, or questions with regards to this website please email me at rwaugh52(at)gmail.com.`
        }
    ]
}

export const ABOUTTOPICS = [GENERALFAQ, ALGORITHMFAQ, RESULTSFAQ, MISCFAQ];

export default ABOUTTOPICS;