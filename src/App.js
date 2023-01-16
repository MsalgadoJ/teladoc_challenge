import React, {useState, useEffect} from 'react';
import './App.scss';
import Species from './Species';
import axios from 'axios';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

// HELPERS
const getImageKey = name => name.split(`'`)[0].toLowerCase();

const getImage = name => SPECIES_IMAGES[getImageKey(name)];

const getHeight = height => {
  if (height === 'n/a') {
    return height.toUpperCase();
  } else {
    const heightToInches = Math.round(
      Math.floor(height) / CM_TO_IN_CONVERSION_RATIO
    );
    return `${heightToInches.toString()}"`;
  }
};

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    const getSpeciesInfo = async specieUrlList => {
      try {
        const specieResponse = await Promise.all(
          specieUrlList.map(async url => {
            const urlResponse = await axios.get(url);
            return urlResponse.data;
          })
        );
        setSpeciesList(specieResponse);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };

    const getSpeciesUrls = async () => {
      try {
        const speciesResponse = await axios.get(API_URL);
        const speciesUrlList = speciesResponse.data.species;
        getSpeciesInfo(speciesUrlList);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };

    getSpeciesUrls();
  }, []);

  const renderSpecies = () =>
    speciesList.map((specie, i) => {
      const {
        name,
        classification,
        designation,
        average_height,
        films,
        language,
      } = specie;

      return (
        <Species
          name={name}
          classification={classification}
          designation={designation}
          numFilms={films.length}
          language={language}
          height={getHeight(average_height)}
          image={getImage(name)}
          key={i}
        />
      );
    });

  const renderMessage = () => {
    if (loading) {
      return 'Loading...';
    } else if (error) {
      return `There's been an error. Please, try again later.`;
    }
  };

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {loading || error ? renderMessage() : renderSpecies()}
      </div>
    </div>
  );
}

export default App;
