import React, { useEffect, useState } from 'react';
import './App.css';
import List from './components/list/List';
import SearchBar from './components/search/SearchBar';
import Snackbar from '@material-ui/core/Snackbar';

const api_key = 'beca3c92';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState();
  const [nominations, setNominations] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  
  const vertical = 'bottom';
  const horizontal = 'right';

  const handleNomination = async (nomination) => {
    console.log(nomination);
    setNominations([...nominations, nomination]);
    if (nominations.length == 4) {
      setOpenNotification(true);
    }
  }

  const handleRemoveNomination = async (movie) => {
    console.log(movie);
    const curNominations = [...nominations];
    const idx = nominations.indexOf(movie);
    if (idx > -1) {
      curNominations.splice(idx, 1);
      setNominations(curNominations);
    }
  }

  const handleQuery = async (e) => {
    setQuery(e.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data");
      return await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${api_key}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Ensure valid response
          if (data.Response === "True") {
            setMovies(data.Search)
          } else {
            setMovies([]);
          }
        })
        .catch(err => console.log(err));
    }

    fetchData()
  }, [query]);

  return (
    <div className="App">
      <h2>The Shoppies</h2>
      <SearchBar query={query} handleQuery={handleQuery} />
      <div className="spacer" />
      <div className="list-container">
        <List items={movies} type={query === '' ? 'Results' : `Results for "${query}"`} onSelect={handleNomination} />
        <div style={{width: '20px'}}></div>
        <List items={nominations} type={"Nominations"} onSelect={handleRemoveNomination} />
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openNotification}
        message="You've selected 5 nominations!"
        key={vertical + horizontal}
      />
    </div>
  );
}

export default App;
