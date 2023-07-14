/**
 * Variables globales
 */
var $TABLA_UNIDADES_NEGOCIO = null;

/**
 * OnLoad Page
 */
$(function () {
    ConstruirUnidadesNegocio();
});

/**
 * RecargarTablaUnidadesNegocio
 */
function RecargarTablaUnidadesNegocio() {
    if ($TABLA_UNIDADES_NEGOCIO != null) {
        $TABLA_UNIDADES_NEGOCIO.draw();
    }
    return false;
}

/**
 * ConstruirUnidadesNegocio
 */
function ConstruirUnidadesNegocio() {
    $TABLA_UNIDADES_NEGOCIO = $("#tabla-unidades-negocio").DataTable({
        "ajax": {
            "url": URL_LISTAR_UNIDADES_NEGOCIO,
            "type": "POST",
            "data": function (d) {
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        }, "columns": [
            {
                "data": "Nombre", "width": "60%"
            },
            {
                "data": "Estado", "width": "20%"
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    if (PERMISO_VER_DETALLE)
                        return '<a href="' + URL_VER_DETALLE + '/' + data + '" class="btn btn-secondary" >Ver detalle</a>';
                    return null;
                }
            },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}
