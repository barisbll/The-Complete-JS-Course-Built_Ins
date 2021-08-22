'use strict';

class Workout {
  date = new Date();
  id = Date.now();

  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords; // []
  }
}

class Running extends Workout {
  type = 'running';

  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this._pace();
    this._description();
  }

  _pace() {
    this.pace = this.distance / this.duration;
  }

  _description() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${
      this.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'
    } ${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(distance, duration, coords, elevation) {
    super(distance, duration, coords);
    this.elevation = elevation;
    this._speed();
    this._description();
  }

  _speed() {
    this.speed = this.distance / (this.duration / 60);
  }

  _description() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${
      this.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'
    } ${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

const run1 = new Running(10, 10, 10, 10);
const cycling1 = new Cycling(10, 10, 10, 10);

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #workouts = [];
  #map;
  #mapEvent;
  #mapZoomLevel = 13;

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._moveToMarker.bind(this));
    this._getLocalStorage();
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('You should allow us to get the location data');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.addEventListener('click', this._showForm.bind(this));

    this.#workouts.forEach(work => this._renderWorkout(work));
  }

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField(e) {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    const isNotNull = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const isPositive = (...inputs) => inputs.every(inp => inp > 0);

    //Get data from form
    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;

      //Check the data
      if (
        (isNotNull(duration, distance, cadence),
        isPositive(duration, distance, cadence))
      ) {
        workout = new Running(
          distance,
          duration,
          this.#mapEvent.latlng,
          cadence
        );
        //Add new object to workout array
        this.#workouts.push(workout);
      } else return;
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //Check the data
      if (
        isNotNull(duration, distance, elevation) &&
        isPositive(duration, distance)
      ) {
        workout = new Cycling(
          distance,
          duration,
          this.#mapEvent.latlng,
          elevation
        );
        //Add new object to workout array
        this.#workouts.push(workout);
      } else return;
    }

    //Render workout on map as marker
    this._renderWorkout(workout);

    //Render workout on list
    this._renderWorkoutMarker(workout);

    //Set local storage
    this._setLocalStorage();

    //Hide the form + Clear the inputs
    this._hideForm();
  }

  _renderWorkout(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.description}`)
      .openPopup();
  }

  _renderWorkoutMarker(workout) {
    let html = `
          <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title"> ${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              this.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          `;

    if (workout.type === 'running') {
      html += `
          <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
          `;
    } else if (workout.type === 'cycling') {
      html += `
          <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevation}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
          `;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _hideForm() {
    // To avoid form disappear animation
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);

    //Clear the fields
    inputCadence.value =
      inputDistance.value =
      inputElevation.value =
      inputDuration.value =
        '';
  }

  _moveToMarker(e) {
    const workoutEle = e.target.closest('.workout');

    if (!workoutEle) return;

    const workout = this.#workouts.find(
      work => work.id === +workoutEle.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    this.#workouts = data;
    this.#workouts.forEach(work => this._renderWorkoutMarker(work));
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
