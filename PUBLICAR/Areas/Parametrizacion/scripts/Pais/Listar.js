/// <reference path="~/Bower/bower_components/datatables.net/js/jquery.dataTables.js" />
/// <reference path="~/scripts/site.js" />
/// <reference path="~/Areas/Parametrizacion/Views/Pais/Listar.cshtml" />

//Variable Globales
var $TABLA_PAISES = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaPaises();
    $("#form-filtro-tabla").submit(RecargarTablaPaises);
});

/**
 * Function para filtrar la tabla Paises
 * @returns {boolean} false
 */
function RecargarTablaPaises() {
    if ($TABLA_PAISES != null) {
        $TABLA_PAISES.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla Paises
 * @returns {boolean} false
 */
function ResetearTablaPais() {
    $("#input-filtro").val('');
    RecargarTablaPaises();
}

/**
 * Funcion para construir la tabla Paises
 */
function ConstruirTablaPaises() {
    var $filtro = $("#input-filtro");
    $TABLA_PAISES = $("#tabla-paises").DataTable({
        "ajax": {
            "url": URL_LISTAR_PAIS,
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
            { "data": "Moneda" },
            {
                "data": "SimboloMonetario",
                "width": "20%",
            },
            {
                "data": "Estado",
                "render": function (data, type, full, meta) {
                    return (data == 1)
                        ? 'Activo'
                        : "Inactivo";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_PAIS) 
                        ? '<a href="' + URL_EDITAR_PAIS + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}