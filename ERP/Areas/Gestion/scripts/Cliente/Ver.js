/**
 * Variables Globales
 */
var $TABLA_EMPRESAS = null;

/**
 * OnLoadPage
 */
$(function () {
    CrearTablaEmpresas();

    $("#form-filtro-tabla").submit(function () {
        RecargarTablaEmpresas();
        return false;
    });

    $("#btn-ver-todo").click(function () {
        $("#input-filtro").val("");
        RecargarTablaEmpresas();
    });
});

/**
 * RecargarTablaEmpresas
 */
function RecargarTablaEmpresas() {
    if ($TABLA_EMPRESAS != null)
        $TABLA_EMPRESAS.draw();
}

/**
 * Crear tabla Empresas
 * @returns {} 
 */
function CrearTablaEmpresas() {
    var $filtro = $("#input-filtro");
    $TABLA_EMPRESAS = $("#tabla-empresas").DataTable({
        "ajax": {
            "url": URL_LISTAR_ASOCIACION_CLIENTE_EMPRESAS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nombre" },
            { "data": "Identificador" },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return (data) ? "Activo" : "Inactivo";
                }
            }
        ],
        "drawCallback": function (settings) {
        }
    });
}