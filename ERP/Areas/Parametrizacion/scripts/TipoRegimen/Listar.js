///Variables globales
var $TABLA_TIPO_REGIMEN = null;

//Onload page
$(function () {
    ConstruirTablaTipoRegimen();
    $("#form-filtro-tabla").submit(RecargarTablaTipoRegimen);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoRegimen() {
    if ($TABLA_TIPO_REGIMEN != null) {
        $TABLA_TIPO_REGIMEN.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoRegimen() {
    $("#input-filtro").val('');
    RecargarTablaTipoRegimen();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoRegimen() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_REGIMEN = $("#tabla-tipo-regimen").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_REGIMEN,
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
                    return (PERMISO_EDITAR_TIPO_REGIMEN)
                        ? '<a href="' + URL_EDITAR_TIPO_REGIMEN + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}