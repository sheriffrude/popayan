/**
 * Variables globales
**/
var $TABLA_ARL = null;

/**
 * OnLoad Page
**/
$(function () {
    ConstruirTablaARL();
    $("#form-filtro-tabla").submit(RecargarTablaArl);
});

function RecargarTablaArl() {
    if ($TABLA_ARL != null) {
        $TABLA_ARL.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaARL() {
    $("#input-filtro").val('');
    RecargarTablaArl();
}

function ConstruirTablaARL() {
    var $filtro = $("#input-filtro");
    $TABLA_ARL = $("#tabla-arl").DataTable({
        "ajax": {
            "url": URL_LISTAR_ARL,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nombre" },
            { "data": "Pais" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_ARL)
                    ? '<a href="' + URL_EDITAR_ARL + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}
