///Variables globales
var $TABLA_LISTA_CONTRATOS = null;

//Onload page
$(function () {
    ConstruirTablaContratos();
    $("#form-filtro-tabla").submit(FiltrarTablaContratos);
});

function FiltrarTablaContratos() {

    if ($TABLA_LISTA_CONTRATOS != null) {
        $TABLA_LISTA_CONTRATOS.draw();
    }
    return false;
}

function ConstruirTablaContratos() {
    var $filtro = $("#input-filtro");
    $TABLA_LISTA_CONTRATOS = $("#tabla-Contratos").DataTable({
        "ajax": {
            "url": URL_LISTAR_CONTRATOS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [            
            { "data": "Nit" },
            { "data": "Cliente" },
             { "data": "NombreContrato" },
            { "data": "FechaContrato" },
             { "data": "FechaFirma" },
            { "data": "FechaTerminacion" },
             {
                 "data": "DocumentoId",
                 "orderable": false,
                 "searchable": false,
                 "render": function (data, type, full, meta) {

                     return (PERMISO_EMPRESA_CLIENTE_CONTRATO_DONWLOAD)?
                         '<a class="btn btn-success" href="' + URL_DESCARGAR_CONTRATO + '?id=' + data + '" title="Descargar">' +
                         '<span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span> Descargar' +
                         '</a>'
                         :"";
                 }
             },

        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}
