///Variables globales
var $TABLA_TIPOCONTRATO = null;

//Onload page
$(function () {
    ConstruirTablaTipoContrato();

    $("#form-filtro-tabla").submit(RecargarTablaTipoContrato);
});

function RecargarTablaTipoContrato() {
    if ($TABLA_TIPOCONTRATO != null) {
        $TABLA_TIPOCONTRATO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoContrato() {
    $("#input-filtro").val('');
    RecargarTablaTipoContrato();
}

function ConstruirTablaTipoContrato() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPOCONTRATO = $("#tabla-tipo-contrato").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPOCONTRATO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "Pais" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_TIPOCONTRATO)
                        ? '<a href="' + URL_EDITAR_TIPOCONTRATO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}