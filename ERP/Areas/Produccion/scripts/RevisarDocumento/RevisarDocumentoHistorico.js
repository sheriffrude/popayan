/*
* VARIABLES GLOBALES
**/
var DATA_TIPO_DOCUMENTO_REVISAR_HISTORICO = null;
var $TABLA_REVISAR_DOCUMENTO_HISTORICO = null;
var FECHA_DESDE_HISTORICO = null;
var FECHA_HASTA_HISTORICO = null;


/*
*Funcion que simula el Onload
**/
function OnloadRevisarDocumentoHistorico() {
    CargarListaTipoDocumentoRevisarHistorico();
    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#fecha-desde-revisar-documento-historico").datepicker({

        dateFormat: 'dd/mm/yy',
        firstDay: 1
    }).datepicker("setDate", new Date()).val('');

    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#fecha-hasta-revisar-documento-historico").datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1
    }).datepicker("setDate", new Date()).val('');
}


/**
 * Consultar lista de tipos de documentos para el seleccionar
 */
function CargarListaTipoDocumentoRevisarHistorico() {
    if (DATA_TIPO_DOCUMENTO_REVISAR_HISTORICO == null) {
        RequestHttp._Post(URL_LISTAR_TIPO_DOCUMENTO, null, null, function (data) {
            if (data != null) {
                var tipoMensaje = (data.state == true) ? "sucess" : "danger";
                Utils._BuilderMessage(tipoMensaje, data.message);
                if (data.state == true) {
                    DATA_TIPO_DOCUMENTO_REVISAR_HISTORICO = data.data;
                    CargarTipoDocumentoRevisarHistorico();
                } else {
                    Utils._BuilderMessage("danger", data.message);
                }

            }
        })
    }

}

/**
 * Cargar opcion de el selector de tipos de documentos
 */
function CargarTipoDocumentoRevisarHistorico() {
    var $selectTipoDocumento = $("#select-tipo-documento-revisar-historico");
    $selectTipoDocumento.append($("<option/>", { value: 0, text: "Seleccione" }));
    $selectTipoDocumento.append($("<option/>", { value: 8, text: "ESTADOS" }));

    $.each(DATA_TIPO_DOCUMENTO_REVISAR, function (index, item) {
        $selectTipoDocumento.append($("<option/>", { value: item.Value, text: item.Text }));
    });
    $selectTipoDocumento.append($("<option/>", { value: 7, text: "TODOS" }));
}



function OnChangeMostrarEstadoDocumentoRevisado(e) {
    var tipo = $(e).val();
    if (tipo == 8) {
        $("#estado-documento-revisado").removeClass('hidden');
    } else {
        $("#estado-documento-revisado").addClass('hidden');
    }
}

function BuscarHistoricoDocumentosRevisados() {

    TIPO = $("#select-tipo-documento-revisar-historico").val();
    FECHA_DESDE_HISTORICO = $("#fecha-desde-revisar-documento-historico").val();
    FECHA_HASTA_HISTORICO = $("#fecha-hasta-revisar-documento-historico").val();

    if (TIPO == 8) {
        ESTADO = $("#select-estado-documento-revisado-historico").val();
    }


    if ($TABLA_REVISAR_DOCUMENTO_HISTORICO != null) {
        $TABLA_REVISAR_DOCUMENTO_HISTORICO.draw();
        $("#caja-mostrar-historico-documento-revisar").removeClass('hidden');
    } else {
        $("#caja-mostrar-historico-documento-revisar").removeClass('hidden');
        CrearTablaDocumentosRevisados();

    }
}


/**
*Funcion para crear tabla de los documentos
*/
function CrearTablaDocumentosRevisados() {
    $TABLA_REVISAR_DOCUMENTO_HISTORICO = $("#tabla-historico-revisar-documentos").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_CONSULTAR_DOCUMENTO_REVISADO,
            "type": "POST",
            "data": function (d) {
                //d.search['value'] = $filtro.val();
                d.id = TIPO,
                d.estado = ESTADO,
                d.fechaDesde = FECHA_DESDE_HISTORICO,
                d.fechaHasta = FECHA_HASTA_HISTORICO
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "Numero" },
            { "data": "OrdenCompraId" },
            { "data": "OrdenTrabajo" },
            { "data": "Empresa" },
            { "data": "Cliente" },
            { "data": "Radicado" },
            { "data": "Fecha" },
            { "data": "Hora" },
            { "data": "Tipo" },
            { "data": "Estado" },
            { "data": "Observacion" },
            { "data": "FechaRevision" },
            { "data": "HoraRevision" },
            { "data": "DocumentoId" }


        ],
        "drawCallback": function (settings) {
            Utils._InputFormatPrice();
        }
    });
}