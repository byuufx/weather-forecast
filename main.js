import { searchCity } from "./modules/request.js"


document.addEventListener("DOMContentLoaded", function (e) {

    document.getElementById('cityForm').addEventListener('submit', function (e) {

        e.preventDefault();

        const cityInput = document.getElementById('searchCityInput');

        if (cityInput.value.length <= 2 || cityInput.value.length == undefined) {

            cityInput.classList.add('is-invalid');

            setTimeout(function () {
                cityInput.classList.remove('is-invalid');
            }, 3000);

            return false;

        }

        //busca pelo ID da cidade
        searchCity(cityInput.value);
    });


});