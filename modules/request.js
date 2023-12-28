export { searchCity, formatCityResponse, formatURLString }


const formatURLString = (string) => {
    
    return encodeURIComponent(
        string.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    ).replace(/[^a-z0-9-]/g, ''); // padrão sao%20paulo
}

//formata data no padrão BR
const formatDate = (date) => {

    const [year, month, day] = date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;

}

const searchCity = async (city) => {

    if(typeof city !== 'string'){
        throw new Error('Invalid city');
    }

    //busca na API pelo ID da cidade
    const URL = 'http://servicos.cptec.inpe.br/XML/listaCidades?city=' + formatURLString(city);

    return fetch(URL)
        .then(response => response.arrayBuffer())
        .then(function (buffer) {
            const decoder = new TextDecoder('iso-8859-1');
            const text = formatCityResponse(decoder.decode(buffer));
        });
} 


const searchClimate = async (ID) => {

    ID = Number(ID);

    const URL = 'http://servicos.cptec.inpe.br/XML/cidade/' + ID + '/previsao.xml';

    return fetch(URL)
        .then(response => response.arrayBuffer())
        .then(function (buffer) {
            const decoder = new TextDecoder('iso-8859-1');
            const text = formatClimateResponse(decoder.decode(buffer));
        });

}

const formatCityResponse = (xml) => {

    // para cada item cidade do XML, preenche o select de cidades.

    xml = new window.DOMParser().parseFromString(xml, "text/xml");

    let cities = xml.getElementsByTagName("cidade");

    if(cities.length  ===  0){
        alert('Cidade não encontrada!');
        return false;
    }

    let city = [];


    city = Array.from(cities[0].childNodes);

    var cityName = (city[0].innerHTML);
    var state = (city[1].innerHTML);
    var cityID = (city[2].innerHTML);

    if(Number.isNaN(cityID)){
        alert('Cidade não encontrada!');
        return false;
    }

    document.getElementById('titleCidade').innerHTML = '<b>' + cityName + ' - ' + state + '</b>';

    return searchClimate(cityID);


}

const formatClimateResponse = (xml) => {

    // formata resultados do XML (temperatura)

    xml = new window.DOMParser().parseFromString(xml, "text/xml");

    let climate = xml.getElementsByTagName("previsao");

    if(climate.length === 0){
        alert('Cidade não encontrada!');
        return false;
    }

    climate = Array.from(climate);


    for (let k = 0; k <= 2; k++) {
        var xmlSub = '<?xml version="1.0" encoding="UTF-8"?><weather>' + climate[k].innerHTML + '</weather>';

        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlSub, 'text/xml');
    
        var minima = xmlDoc.getElementsByTagName('minima')[0].textContent;
        var maxima = xmlDoc.getElementsByTagName('maxima')[0].textContent;
        var dia = xmlDoc.getElementsByTagName('dia')[0].textContent;
    

        var html = "Data: <b>" + formatDate(dia) + "</b><br><br>";
        html += " Mínima : " + minima + "º";
        html +=  "<br> Máxima : " + maxima + "º";

        var p = k + 1;

        document.getElementById("data" + p).innerHTML = html;

    }

    document.getElementById('containerResult').style.display = 'flex'; 

    document.getElementById('titleCidade').style.display = 'block';
    
}





