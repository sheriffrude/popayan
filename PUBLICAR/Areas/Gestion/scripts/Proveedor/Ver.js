/**
 * Variables Globales
 */
var $TABLA_EMPRESA = null;
var DATA_EMPRESAS = [];

$(function() {
    $("#tabla-empresas").dataTable({
        "serverSide": false,
        "bPaginate": false
    });
});