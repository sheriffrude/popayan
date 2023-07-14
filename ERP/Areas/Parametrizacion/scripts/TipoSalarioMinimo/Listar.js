///Variables globales
var $TABLA_TIPO_SALARIO_MINIMO = null;

//Onload page
$(function () {
    ConstruirTablaTipoSalarioMinimo();
    $("#form-filtro-tabla").submit(RecargarTablaTipoSalarioMinimo);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoSalarioMinimo() {
    if ($TABLA_TIPO_SALARIO_MINIMO != null) {
        $TABLA_TIPO_SALARIO_MINIMO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoSalarioMinimo() {
    $("#input-filtro").val('');
    RecargarTablaTipoSalarioMinimo();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoSalarioMinimo() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_SALARIO_MINIMO = $("#tabla-tipo-salario-minimo").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_SALARIO_MINIMO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Ano" },
            { "data": "Valor" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_TIPO_SALARIO_MINIMO)
                        ? '<a href="' + URL_EDITAR_TIPO_SALARIO_MINIMO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}