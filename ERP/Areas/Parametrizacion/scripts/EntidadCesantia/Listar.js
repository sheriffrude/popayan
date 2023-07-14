///Variables globales
var $TABLA_ENTIDAD_CESANTIA = null;

//Onload page
$(function () {
    ConstruirTablaEntidadCesantia();
    $("#form-filtro-tabla").submit(RecargarTablaEntidadCesantia);
});

function RecargarTablaEntidadCesantia() {
    if ($TABLA_ENTIDAD_CESANTIA != null)
        $TABLA_ENTIDAD_CESANTIA.draw();
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaEntidadCesantia() {
    $("#input-filtro").val('');
    RecargarTablaEntidadCesantia();
}

function ConstruirTablaEntidadCesantia() {
    var $filtro = $("#input-filtro");
    $TABLA_ENTIDAD_CESANTIA = $("#tabla-entidad-cesantia").DataTable({
        "ajax": {
            "url": URL_LISTAR_ENTIDAD_CESANTIA,
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
            {
                "data": "Pais",
                "width": "20%",
            },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_ENTIDAD_CESANTIA)
                        ? '<a href="' + URL_EDITAR_ENTIDAD_CESANTIA + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}