///Variables globales
var $TABLA_TIPO_PRODUCTO_BANCO = null;

//Onload page
$(function () {
    ConstruirTablaTipoProductoBanco();
    $("#form-filtro-tabla").submit(RecargarTablaTipoProductoBanco);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoProductoBanco() {
    if ($TABLA_TIPO_PRODUCTO_BANCO != null) {
        $TABLA_TIPO_PRODUCTO_BANCO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoProductoBanco() {
    $("#input-filtro").val('');
    RecargarTablaTipoProductoBanco();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoProductoBanco() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_PRODUCTO_BANCO = $("#tabla-tipo-producto-banco").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_PRODUCTO_BANCO,
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
                    return (PERMISO_EDITAR_TIPO_PRODUCTO_BANCO)
                        ? '<a href="' + URL_EDITAR_TIPO_PRODUCTO_BANCO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}