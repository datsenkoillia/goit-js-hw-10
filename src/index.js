import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const countryInputEl = document.querySelector('input#search-box');
const countryListInsert = document.querySelector('.country-list');
const oneCountryInsert = document.querySelector('.country-info');

console.log('hello-hello');

function createMarkup(toSearch) {
  fetchCountries(toSearch)
    .then(insertMarkup)
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function markupCountryList({ flags, name }) {
  const country = `
    <li style="display: flex; gap: 20px; margin-bottom: 10px; align-items: center">
      <img
        width="40px"
        height="30px"
        src=${flags.png}
        alt="flag"
      />
      <p>${name.official}</p>
    </li>
  `;
  countryListInsert.insertAdjacentHTML('beforeend', country);
}

function markupOneCountry({ flags, name, capital, population, languages }) {
  const langArray = Object.values(languages).join(', ');
  const markup = `
    <div style="display: flex; gap: 20px; margin-bottom: 30px">
      <img width="50px" src=${flags.png} alt="flag" />
      <h2>${name.official}</h2>
    </div>
    <ul>
      <li><strong>Capital:</strong> ${capital}</li>
      <li><strong>Population:</strong> ${population}</li>
      <li><strong>Languages:</strong> ${langArray}</li>
    </ul>
  `;
  oneCountryInsert.innerHTML = markup;
}

function insertMarkup(array) {
  if (array.length === 1) {
    countryListInsert.innerHTML = '';
    array.forEach(country => {
      markupOneCountry(country);
    });
  } else if (array.length > 1 && array.length < 11) {
    array.forEach(country => {
      oneCountryInsert.innerHTML = '';
      markupCountryList(country);
    });
  } else {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function onInputChange(event) {
  countryListInsert.innerHTML = '';
  oneCountryInsert.innerHTML = '';
  if (event.target.value.trim() !== '') {
    const toSearch = event.target.value.trim();
    console.log(toSearch);
    createMarkup(toSearch);
  } else {
    countryListInsert.innerHTML = '';
    oneCountryInsert.innerHTML = '';
  }
}

countryInputEl.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);
