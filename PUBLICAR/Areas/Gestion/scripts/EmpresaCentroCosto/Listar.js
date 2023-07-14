/**
 * Variables Globales
 */
var $TABLA_EMPRESA_CENTROS_COSTO = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaCentroCosto();
    $("#form-filtro-tabla").submit(RecargarTablaCentroCosto);
});

/**
 * Function Recargar Tabla
 * @returns {boolean} false
 */
function RecargarTablaCentroCosto() {
    if ($TABLA_EMPRESA_CENTROS_COSTO != null) 
        $TABLA_EMPRESA_CENTROS_COSTO.draw();
    return false;
}

/**
 * Funcion para construir tabla
 */
function ConstruirTablaCentroCosto() {
    var $filtro = $("#input-filtro");
    $TABLA_EMPRESA_CENTROS_COSTO = $("#tabla-centros-costo").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPRESA_CENTRO_COSTO,
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
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_EMPRESA_CENTRO_COSTO)
                        ? '<a href="' + URL_EDITAR_EMPRESA_CENTRO_COSTO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}