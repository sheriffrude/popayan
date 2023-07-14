/**
 * Función de inicio
 */
function initContactoEmergencia() {
    $("#registra-conyuge").hide();
}

/**
 * Función de obtener los datos registrados
 */
function obtenerContactoEmergencia() {
    var dataContactoEmergencia = {};
    var elements = $(".contacto-emergencia");
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
        if (elements[i].id != undefined) {
            dataContactoEmergencia[elements[i].name] = elements[i].value;
        }
    }
    return dataContactoEmergencia;
}