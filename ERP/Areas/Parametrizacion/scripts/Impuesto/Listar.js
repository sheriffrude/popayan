///Variables globales
var $TABLA_IMPUESTO = null;

//Onload page
$(function () {
    ConstruirTablaImpuesto();
    $("#form-filtro-tabla").submit(RecargarTablaImpuesto);
});

function RecargarTablaImpuesto() {
    if ($TABLA_IMPUESTO != null) 
        $TABLA_IMPUESTO.draw();
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaImpuesto() {
    $("#input-filtro").val('');
    RecargarTablaImpuesto();
}

function ConstruirTablaImpuesto() {
    var $filtro = $("#input-filtro");
    $TABLA_IMPUESTO = $("#tabla-impuesto").DataTable({
        "ajax": {
            "url": URL_LISTAR_IMPUESTO,
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
            { "data": "TipoImpuesto" },
            {
                "data": "Porcentaje"
            },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_IMPUESTO)
                    ? '<a href="' + URL_EDITAR_IMPUESTO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}