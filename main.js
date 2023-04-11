
function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCityByLocation);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
 function getCityByLocation(position) {
    console.log('position', position)
    const {latitude,longitude } = position.coords

    let url =`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
   
    try {

         fetch(url)
        .then((res) =>  res.json())
        .then((result) =>{
            console.log(result)
        getWeatherByLocation(result.city) 

        })
    
    } catch (error) {
        console.log(error)
    }
    
}

getLocation()

const getWeatherByLocation = (city)=>{
    const spinner = document.getElementById("spinner");
  spinner.classList.remove("invisble");

    console.log(city)

    let urlForcast =`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`;
    let urlAstronomy =`http://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&q=${city}&dt=${new Date()}`;
  
    let urls = [urlForcast, urlAstronomy];

    Promise.all(
        urls.map((url)=>{    
  return  fetch(url).then((res) => res.json())

    }))
    .then((result)=>{
        console.log(result)
        const weatherData = result[0];
        const astronomyData = result[1];
        displayData(weatherData, astronomyData)
         createEvents()
    })

}

 const displayData = (weatherData, astronomyData) =>{
    //hide spinner

    const spinner = document.getElementById('spinner');
    spinner.classList.add('invisible');

//     //show table
    const containerData = document.getElementById('data-to-display');
         containerData.classList.remove('invisible');

    const city = document.getElementById('city');
     const tbody = document.getElementById('weather-data');
    const astronomyCards = document.getElementById('astronomy-cards');

      cleanDom(city, tbody, astronomyCards);

   const { forecast, location} = weatherData;

    city.innerText =`Display the weather for ${location.name} in ${location.country}`;
   const {astronomy} = astronomyData;
    createAstronomyCards(astronomyCards, astronomy);    
      createTable(tbody, forecast);
  };
    const createTable = (tbody, forecast) => {
     forecast.forecastday.forEach((day)=>{
     const row = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
     const td3 = document.createElement('td');
    const td4 = document.createElement('td');

    td1.innerText= day.date;
    td2.innerText= day.day.mintemp_c;
    td3.innerText= day.day.maxtemp_c;
    td4.innerText= day.day.condition.text;

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    tbody.appendChild(row);


})
 }

const createAstronomyCards = (astronomyCards, astronomy) =>{
    const divSun = document.createElement('div');
    divSun.setAttribute('class', 'card');
    const divSunBody = document.createElement('div');
    divSunBody.setAttribute('class', 'card-body');
    const h5sun = document.createElement('h5');
    h5sun.setAttribute('class', 'card-title');
    h5sun.innerText='Sun';

    const ulSun = document.createElement('ul');
    ulSun.setAttribute('class', 'list-group list-group-flush');
    const ulSunRise = document.createElement('li');
    ulSunRise.setAttribute('class', 'list-group-item');
    ulSunRise.innerText = `Sunrise is at ${astronomy.astro.sunrise}`
    const ulSunSet = document.createElement('li');
    ulSunSet.setAttribute('class', 'list-group-item');
    ulSunSet.innerText = `Sunrise is at ${astronomy.astro.sunset}`;

    ulSun.appendChild(ulSunRise);
    ulSun.appendChild(ulSunSet);
    divSunBody.appendChild(h5sun);
    divSun.appendChild(divSunBody);
    divSun.appendChild(ulSun);
    astronomyCards.appendChild(divSun)

    
}



const createEvents = ()=>{
    const search = document.getElementById('city-search');
    let city ='';
    search.addEventListener('input', (event) =>{
        // console.log(event.target.value);
        city= event.target.value;
    });

    search.addEventListener('keyup', (event) =>{
        if(event.key === 'Enter'){
            getWeatherByLocation(city);
        };

    });
};

const cleanDom = (city, tbody, astronomyCards) =>{
    city.innerHTML ='';
    tbody.innerHTML ='';
    astronomyCards.innerHTML ='';

}








