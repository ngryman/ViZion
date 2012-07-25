var socket = io.connect('http://' + location.hostname + ':' + '4242');

$(document).ready(function() {
    $.loadingStart = function() {
        $('#loading').effect("pulsate", { times: 9999 }, 2000);
    };

    $.loadingStop = function() {
        $('#loading').stop(true, true).hide();
    };
});