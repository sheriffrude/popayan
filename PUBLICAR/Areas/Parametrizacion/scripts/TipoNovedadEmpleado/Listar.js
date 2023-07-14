///Variables globales
var $TABLA_TIPO_NOVEDAD_EMPLEADO = null;

//Onload page
$(function () {
    ConstruirTablaTipoNovedadEmpleado();
    $("#form-filtro-tabla").submit(RecargarTablaTipoNovedadEmpleado);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoNovedadEmpleado() {
    if ($TABLA_TIPO_NOVEDAD_EMPLEADO != null) {
        $TABLA_TIPO_NOVEDAD_EMPLEADO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoNovedadEmpleado() {
    $("#input-filtro").val('');
    RecargarTablaTipoNovedadEmpleado();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoNovedadEmpleado() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_NOVEDAD_EMPLEADO = $("#tabla-tipo-novedad-empleado").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_NOVEDAD_EMPLEADO,
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
                    return (PERMISO_EDITAR_TIPO_NOVEDAD_EMPLEADO)
                        ? '<a href="' + URL_EDITAR_TIPO_NOVEDAD_EMPLEADO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}