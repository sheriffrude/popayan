/**
 * Variables globales
 */
var $TABLA_EMPLEADO_MEMORANDO = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaMemorandos();
    $("#form-filtro-tabla").submit(RecargarTablaMemorandos);
});

/**
 * Filtrar tabla memorando
 * @returns {boolean} 
 */
function RecargarTablaMemorandos() {
    if ($TABLA_EMPLEADO_MEMORANDO != null) {
        $TABLA_EMPLEADO_MEMORANDO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaEmpleadoMemorando() {
    $("#input-filtro").val('');
    RecargarTablaMemorandos();
}

/**
 * Construye tabla de memorandos
 */
function ConstruirTablaMemorandos() {
    var $filtro = $("#input-filtro");
    $TABLA_EMPLEADO_MEMORANDO = $("#tabla-empleado-memorando").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPLEADO_MEMORANDO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "NombreCompleto" },
            { "data": "Observacion" },
            { "data": "Estado" },
            {
                "data": "MemorandoId",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_DESCARGAR_EMPLEADO_MEMORANDO)
                        ? '<a href="' + URL_DESCARGAR_EMPLEADO_MEMORANDO + '?id=' + data + '" title="Descargar">' +
                            '<img src="/Content/images/Gestion/boton-descargar.png" alt="Descargar" />' +
                        '</a>'
                    : "";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_EMPLEADO_MEMORANDO)
                        ? '<a href="' + URL_EDITAR_EMPLEADO_MEMORANDO + '?id2=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}