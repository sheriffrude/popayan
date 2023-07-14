/**
 * Función de inicio de modal para registrar dedución
 */
function initDeduccion() {}

/**
 * Función que prepara los elemento a registrar
 * @param {any} jqXHR
 * @param {any} settings
 */
function obtenerDeduccion() {
    var dataDeduccion = {};
    var elements = $(".deduccion");
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
        if (elements[i].id != undefined) {
            dataDeduccion[elements[i].name] = elements[i].value;
        }
    }
    return dataDeduccion;
}