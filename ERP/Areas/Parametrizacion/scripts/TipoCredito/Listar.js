///Variables globales
var $TABLA_TIPO_CREDITO = null;

//Onload page
$(function () {
    ConstruirTablaTipoCredito();
    $("#form-filtro-tabla").submit(RecargarTablaTipoCredito);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoCredito() {
    if ($TABLA_TIPO_CREDITO != null) {
        $TABLA_TIPO_CREDITO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoCredito() {
    $("#input-filtro").val('');
    RecargarTablaTipoCredito();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoCredito() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_CREDITO = $("#tabla-tipo-credito").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_CREDITO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_TIPO_CREDITO)
                        ? '<a href="' + URL_EDITAR_TIPO_CREDITO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}