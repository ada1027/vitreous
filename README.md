##**Vitreous**

## Inspiration:
cmd-f's theme this year was Wonderland, a place where we don't know what is "behind the looking glass", full of wacky things we don't understand. We realized that sometimes, our app connections can look like this; with unclear connections and data links. We wanted to tackle the issue of cybersecurity at the awareness level, showing every user where they've given their data to and giving them the appropriate recommendations.

## What it does:
_Vitreous_ is a web application that gives you clarity over your own cybersecurity.
- Login with OAuth/passkey
- Display all connected accounts
- Identify data breaches
- Identify dormant accounts
- Accessible design
- Gives personalized security recommendations for every user using our risk-assessment algorithm

## How we built it:
We designed our UI and UX on Figma then created our front end using HTML, Tailwind CSS, and Typescript. Backend was built with Python. We used  _GeminiAPI_, Gmail API,  _Have I Been Pwned_ API and OAuth to identify key words and connections between signed in accounts and other online platforms.
We identify dormant accounts and cybersecurity risks by scanning domain names appearing in sign-up/login emails with Gmail API, de-duplicating identified domain names, and flagging them.
This information is parsed to Gemini and using an algorithm based on recency, legitimacy of the company, and sensitivity of information, Vitreous provides personalized security recommendations to each user.

## Challenges we ran into:
We weren't sure initially how to identify dormant accounts. Using Gmail API and Gemini, we found the solution 
Additionally, we ran into challenges integrating the frontend and backend, which led to us having to scrap some features or having to adapt things differently.

## Accomplishments that we're proud of:
We're proud of creating an accessible design that is simple to navigate. Additionally, we are proud of how we incorporated APIs to give personalized security recommendations. 

## What we learned:
We've learned to constantly have to adapt things and work on our front end - back end integration. We further developed an appreciation of cybersecurity and necessity for public awareness.

## What's next for Vitreous:
We hope to create clarity and awareness of data connections so that we can match cybersecurity needs to every user. While we have a consumer app at the moment, we could implement additional features for households and organizations to view shared information risks.
