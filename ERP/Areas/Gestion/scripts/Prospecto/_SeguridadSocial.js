/**
 * Función de inicializacion de seguridad sacial
 */
function initSeguridadSocial() { }

/**
 * Función de obtener los datos de seguridad social
 * @param {any} data
 */
function obtenerSeguridadSocial() {
    var dataSeguridadSocial = {};
    var elements = $(".seguridad-social");
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
        if (elements[i].id != undefined) {
            dataSeguridadSocial[elements[i].name] = elements[i].value;
        }
    }    
    return dataSeguridadSocial;
}