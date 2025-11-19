function hideOops() { document.getElementById('oops').textContent = ''; }


console.log("Welcome to WeatherThingy! If you see this, you’re a dev 🦄");

function kelvinToC(val) { return Math.round(val - 273.15); }
function capFIRST(txt) { return txt.charAt(0).toUpperCase() + txt.slice(1); }

const APIKEY = '42eca859192501657c3c49662d9cf5c9';


function showInfo(wdata, locat) {
  let out = '';
  if(wdata.weather && wdata.weather[0]) {
    out += `<b>${capFIRST(wdata.weather[0].description)}</b><br>`;
  }
  out += `<span style="font-size:2em">${kelvinToC(wdata.main.temp)}°C</span><br>`;
  out += `Feels like ${kelvinToC(wdata.main.feels_like)}°C<br>`;
  out += `Humidity: ${wdata.main.humidity}%<br>`;
  out += `Wind: ${wdata.wind.speed} m/s<br>`;
  out += `<div class="tiny">in <b>${locat}</b></div>`;
  document.getElementById('info-stuff').innerHTML = out;
}

function showOops(msg) {
  document.getElementById('oops').textContent = msg || "Hmm, couldn't fetch weather…";
}

async function getWeatherBy(q) {
  hideOops();
  document.getElementById('info-stuff').innerHTML = "Loading…";
  try {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${APIKEY}`;
    let resp = await fetch(url);
    let data = await resp.json();
    if (data.cod !== 200) { showOops(data.message || 'Could not fetch weather!'); document.getElementById('info-stuff').innerHTML = ""; return; }
    showInfo(data, data.name + (data.sys.country ? ', ' + data.sys.country : ''));
  } catch (e) {
    showOops("Oops. Problem getting weather.");
    document.getElementById('info-stuff').innerHTML = "";
  }
}

async function getWeatherByCoords(lat, lon) {
  hideOops();
  document.getElementById('info-stuff').innerHTML = "Loading…";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
  try {
    let resp = await fetch(url);
    let data = await resp.json();
    if (data.cod !== 200) { showOops(data.message || 'Could not fetch weather'); document.getElementById('info-stuff').innerHTML = ""; return; }
    showInfo(data, data.name + (data.sys.country ? ', ' + data.sys.country : ''));
  } catch (err) {
    showOops("Couldn't get weather for your coords.");
    document.getElementById('info-stuff').innerHTML = "";
  }
}

document.getElementById('loc-form').addEventListener('submit', function(ev) {
  ev.preventDefault();
  let v = document.getElementById('loc-input').value.trim();
  if (!v) { showOops("Type a location!"); return; }
  getWeatherBy(v);
});

document.getElementById('use-my').addEventListener('click', function() {
  hideOops();
  if ("geolocation" in navigator) {
    document.getElementById('info-stuff').innerHTML = "Trying to find you…";
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        let lat = pos.coords.latitude, lon = pos.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      function() { showOops("Location blocked or unavailable."); document.getElementById('info-stuff').innerHTML = ""; }
    );
  } else {
    showOops("Geolocation NOT on this device!");
  }
});
