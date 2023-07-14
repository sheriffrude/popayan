/// <reference path="~/Bower/bower_components/datatables.net/js/jquery.dataTables.js" />
/// <reference path="~/scripts/site.js" />
/// <reference path="~/Areas/Gestion/Views/BancoContacto/Listar.cshtml" />

//Variable Globales
var $TABLA_BANCO_CONTACTO = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaBancoContacto();
    $("#form-filtro-tabla").submit(FiltrarTablaBancoContacto);
});

/**
 * Function para filtrar la tabla BancoContacto
 * @returns {boolean} false
 */
function FiltrarTablaBancoContacto() {
    if ($TABLA_BANCO_CONTACTO != null) {
        $TABLA_BANCO_CONTACTO.draw();
    }
    return false;
}

/**
 * Funcion para construir la tabla BancoContacto
 */
function ConstruirTablaBancoContacto() {
    var $filtro = $("#input-filtro");
    $TABLA_BANCO_CONTACTO = $("#tabla-banco-contacto").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_EMPRESA_BANCO_CONTACTO_LISTAR,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Nombre", },
            { "data": "Area" },
            { "data": "Cargo" },
            {
                "data": "Telefonos",
                "render": function (data, type, full, meta) {
                    var html = "";
                    if (data != null) {
                        var telefonos = data.split(",");
                        var tamanoTelefonos = telefonos.length;
                        for (var i = 0; i < tamanoTelefonos; i++) {
                            html += telefonos[i] + "<br/>";
                        }
                    }
                    return html;
                }
            },
            {
                "data": "Celulares",
                "render": function (data, type, full, meta) {
                    var html = "";
                    if (data != null) {
                        var celulares = data.split(",");
                        var tamanoCelulares = celulares.length;
                        for (var i = 0; i < tamanoCelulares; i++) {
                            html += celulares[i] + "<br/>";
                        }
                    }
                    return html;
                }
            },
            { "data": "Correo" },
            { "data": "FechaNacimiento" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EMPRESA_BANCO_CONTACTO_EDITAR)
                        ? '<a href="' + URL_EMPRESA_BANCO_CONTACTO_EDITAR + '?id=' + data + '" class="btn btn-info btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}