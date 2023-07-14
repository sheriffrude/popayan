///Variables globales
var $TABLA_ENTIDAD_SALUD = null;

//Onload page
$(function () {
    ConstruirTablaEntidadSalud();
    $("#form-filtro-tabla").submit(RecargarTablaEntidadSalud);
});

/**
*
*/
function RecargarTablaEntidadSalud() {
    if ($TABLA_ENTIDAD_SALUD != null) {
        $TABLA_ENTIDAD_SALUD.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaEntidadSalud() {
    $("#input-filtro").val('');
    RecargarTablaEntidadSalud();
}

function ConstruirTablaEntidadSalud() {
    var $filtro = $("#input-filtro");
    $TABLA_ENTIDAD_SALUD = $("#tabla-entidad-salud").DataTable({
        "ajax": {
            "url": URL_LISTAR_ENTIDAD_SALUD,
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
            { "data": "Pais" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_ENTIDAD_SALUD)
                    ? '<a href="' + URL_EDITAR_ENTIDAD_SALUD + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";

                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}