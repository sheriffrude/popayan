/**
 * Variables Globales
 */
var $TABLA_DEPARTAMENTO_TRAFICO = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTabla();
    $("#form-filtro-tabla").submit(RecargarTabla);
});

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaDepartamentoTrafico() {
    $("#input-filtro").val('');
    RecargarTabla();
}

/**
 * Function Recargar Tabla
 * @returns {boolean} false
 */
function RecargarTabla() {
    if ($TABLA_DEPARTAMENTO_TRAFICO != null) {
        $TABLA_DEPARTAMENTO_TRAFICO.draw();
    }
    return false;
}

/**
 * Funcion para construir tabla
 */
function ConstruirTabla() {
    var $filtro = $("#input-filtro");
    $TABLA_DEPARTAMENTO_TRAFICO = $("#tabla-departamento-trafico").DataTable({
        "ajax": {
            "url": URL_LISTAR_DEPARTAMENTO_TRAFICO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Nombre", },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_DEPARTAMENTO_TRAFICO)
                        ? '<a href="' + URL_EDITAR_DEPARTAMENTO_TRAFICO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}