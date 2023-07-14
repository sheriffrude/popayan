///Variables globales
var $TABLA_ENTIDADPENSION = null;

//Onload page
$(function () {
    ConstruirTablaEntidadPension();
    $("#form-filtro-tabla").submit(RecargarTablaEntidadPension);
});

function RecargarTablaEntidadPension() {
    if ($TABLA_ENTIDADPENSION != null) {
        $TABLA_ENTIDADPENSION.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaEntidadPension() {
    $("#input-filtro").val('');
    RecargarTablaEntidadPension();
}

function ConstruirTablaEntidadPension() {
    var $filtro = $("#input-filtro");
    $TABLA_ENTIDADPENSION = $("#tabla-EntidadDePension").DataTable({
        "ajax": {
            "url": URL_LISTA_ENTIDADPENSION,
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
                    return (PERMISO_EDITAR_ENTIDADPENSION)
                    ? '<a href="' + URL_EDITA_ENTIDADPENSION + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}
