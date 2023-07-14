///Variables globales
var $TABLA_CARGOS = null;

//Onload page
$(function () {
    ConstruirTablaCargo();
    $("#form-filtro-tabla").submit(RecargarTablaCargo);
});

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaCargo() {
    $("#input-filtro").val('');
    RecargarTablaCargo();
}

function RecargarTablaCargo() {

    if ($TABLA_CARGOS != null) {
        $TABLA_CARGOS.draw();
    }
    return false;
}

function ConstruirTablaCargo() {
    var $filtro = $("#input-filtro");
    $TABLA_CARGOS = $("#tabla-cargo").DataTable({
        "ajax": {
            "url": URL_LISTAR_CARGOS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nombre" },
            { "data": "Descripcion" },
            { "data": "Rol" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_CARGO)
                        ? '<a href="' + URL_EDITAR_CARGO + '?id=' + data + '"  data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}