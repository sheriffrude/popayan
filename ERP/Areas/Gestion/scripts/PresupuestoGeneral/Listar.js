///Variables globales
var $TABLA_PRESUPUESTO_GENERAL = null;

//Onload page
$(function () {
    ConstruirTablaPresupuestoGeneral();
    $("#form-filtro-tabla").submit(RecargarTablaPresupuestoGeneral);
});

function RecargarTablaPresupuestoGeneral() {
    if ($TABLA_PRESUPUESTO_GENERAL != null)
        $TABLA_PRESUPUESTO_GENERAL.draw();
    return false;
}

function ConstruirTablaPresupuestoGeneral() {
    var $filtro = $("#input-filtro");
    $TABLA_PRESUPUESTO_GENERAL = $("#tabla-presupuesto-general").DataTable({
        "ajax": {
            "url": URL_LISTAR_PRESUPUESTO_GENERAL,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        },
        "columns": [
            { "data": "Anio" },
            { "data": "Empresa" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<a href="' + URL_PARAMETRIZAR_PRESUPUESTO_GENERAL + '?id=' + data + '" class="btn btn-info btn-sm" >Parametrizar</a>';
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<a href="' + URL_ALIMENTAR_PRESUPUESTO_GENERAL + '?id=' + data + '" class="btn btn-info btn-sm" >Alimentar</a>';
                }
            }

        ],
        "drawCallback": function (settings) {
        }
    });
}