var locateIn = document.getElementById("location");

function getFilter(){
    var selectedValue = document.getElementById("filters").value;
    return selectedValue;
}

function searchFunc(){

    initMap()
}

function initMap(){

    var defaultLocation = { lat:32.3182, lng:-86.9023};
    var options = {
        zoom: 11,
        center: defaultLocation
    }

    const successCallback = (getPos) => {
        defaultLocation.lat = getPos.coords.latitude;
        defaultLocation.lng = getPos.coords.longitude;
        map = new google.maps.Map(document.getElementById("map"), options)
    
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${defaultLocation.lat},${defaultLocation.lng}&key=AIzaSyAAwBPecFmf0co-0ua1pg2tA4wXMfIn3R4`;
        const response = fetch(url);
        fetch(url)
            .then( response => response.json() )
            .then( data => {
                document.getElementById('location').value = data.results[0].formatted_address;
            })
            .catch( error => console.warn(error.message) )

        var service;
        var infoWindow;
    
        var request =
        {
            location: defaultLocation,
            radius: '.05',
            query: getFilter()
        };
    
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
    
        function callback(results, status) {
            for (var i = 0; i < results.length; i++) {
                
                var avgLAT = (results[i].geometry.viewport.ub.h + results[i].geometry.viewport.ub.j) / 2
                var avgLNG = (results[i].geometry.viewport.Qa.h + results[i].geometry.viewport.Qa.j) / 2

                estab_mark = new google.maps.Marker({position: {lat:avgLAT, lng:avgLNG}, map:map});
            }
        }  
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( successCallback );

    } 

    else{

        var map = new google.maps.Map(document.getElementById('map'), options);
        var marker = new google.maps.Marker({position: defaultLocation, map:map});
    }

    var autocomplete = new google.maps.places.Autocomplete(document.getElementById("location"));
    google.maps.event.addListener(autocomplete, "place_changed", function() {
        var place = autocomplete.getPlace();
        console.log(place.formatted_address);
        console.log(place.geometry.location.lat);
        })
}
