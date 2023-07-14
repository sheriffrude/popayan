///Variables globales
var $TABLA_CIUDAD = null;

//Onload page
$(function () {
    ConstruirTablaCiudad();
    $("#form-filtro-tabla").submit(RecargarTablaCiudad);
});

/**
*
*/
function RecargarTablaCiudad() {
    if ($TABLA_CIUDAD != null) {
        $TABLA_CIUDAD.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaCiudad() {
    $("#input-filtro").val('');
    RecargarTablaCiudad();
}

function ConstruirTablaCiudad() {
    var $filtro = $("#input-filtro");
    $TABLA_CIUDAD = $("#tabla-ciudad").DataTable({
        "ajax": {
            "url": URL_LISTAR_CIUDAD,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Pais", },
            { "data": "Departamento" },
            { "data": "Nombre", },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_CIUDAD)
                    ? '<a href="' + URL_EDITAR_CIUDAD + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

