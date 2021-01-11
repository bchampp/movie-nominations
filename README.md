# Movie Nomination App
This repository contains my implementation for the Spotify Summer 2021 Intern Challenge.
Live deployment of the project can be found <a href="https://shoppy-movies.netlify.app/">here!</a>

## Implementation
The implementation for the project can be found inside the `src` folder. At the top level, there's index.tsx & App.tsx which handle the entry point for React and the base `App` component. Additionally there are several folders:
- `api` contains functions that interact with the OMDB API.
- `components` contains all the React components I implemented.
- `constants` contains constants that are used throughout the application.
- `hooks` contains a custom debounce hook for fetching the data.
- `models` contains models for data. In this case I have defined a model for a Movie type.
- `styles` contains all the css files for the components. 
- `util` contains utility functions that are used in the application.

I chose to implement this in TypeScript since I use TS for my work already (specifically for Angular and Lambda functions), and I don't have much experience writing React components in TS. I learned a lot through this project in terms of the built-in React types and handling event, state and hook types. 

## Design
A figma design for my UI can be found <a href='https://www.figma.com/file/rhelRGBy1cl3FHE6cSAXu7/The-Shoppies?node-id=0%3A1'>here</a>. I used figma to help design the flow of the program, and how I wanted the movie cards to look and interact. This helped guide my development as I built and styled my React components.

## Notes
There are a few details I would like to point out and discuss about my implementation.
1. I wrote a custom debounce hook to handle query updates. There are different ways to debounce the user input, but I felt that writing a custom hook to interface with the API directly was the best solution for this. Alternatively I could have managed the query state in it's own component, and only fetched the data when the debounce resolves. I chose to instead implement it in a hook that also returns the search results, as I wanted to keep my query state in the top level component (`App.tsx`).
2. I chose to use the returned ID's from the search API to find more data about each movie. Using the results from the Search API directly only provides the movies title, poster and year, whereas using the Get API provides much more information about each movie. This was then used to build more complex cards than what I had initially implemented. 
3. I only used the `useState` and `useEffect` hooks from react. Had there been more complex data flow, I probably would have used the `useReducer` hook or even implemented a Redux store. However, I felt that managing state at the App level was sufficient. 
4. For my animations, I chose to use the <a href='https://github.com/aholachek/react-flip-toolkit'>react-flip-toolkit library</a>. I wanted to create simple list transitions, as well as the ability to expand cards to show more information. This library provided an awesome component `<Flipped>` which allowed me to handle my card data in these animations. I would definitely like to spend more time on this and potentially implement my own version of the component.

## Running locally 
To run this project locally, follow these steps. 

### Clone the repository
`
git clone https://github.com/bchampp/movie-nominations.git
`

### Install the dependencies
`
npm i
`
or 
`
yarn
`

### Run the development server
`
npm start
`

