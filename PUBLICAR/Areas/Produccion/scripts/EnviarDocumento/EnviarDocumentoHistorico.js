/*
*VARIBLES GLOBALES
*/
var $TABLA_ENVIAR_DOCUMENTO_HISTORICO = null;
var DATA_TIPO_DOCUMENTO_ENVIAR_DOCUMENTO_HISTORICO = null;
var TIPO = null;
var ESTADO = null;


/*
* Simula el onload
**/
function OnloadEnviarDocumentoHistorico() {
    CargarListaTipoDocumentoHistorico();
}


/**
 * Consultar lista de tipos de documentos para el seleccionar
 */
function CargarListaTipoDocumentoHistorico() {
    if (DATA_TIPO_DOCUMENTO_ENVIAR_DOCUMENTO_HISTORICO == null) {
        RequestHttp._Post(URL_LISTAR_TIPO_DOCUMENTO, null, null, function (data) {
            if (data != null) {
                var tipoMensaje = (data.state == true) ? "sucess" : "danger";
                Utils._BuilderMessage(tipoMensaje, data.message);
                if (data.state == true) {
                    DATA_TIPO_DOCUMENTO_ENVIAR_DOCUMENTO_HISTORICO = data.data;
                    CargarTipoDocumentoEnviarDocumentoHistorico();
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
function CargarTipoDocumentoEnviarDocumentoHistorico() {
    var $selectTipoDocumento = $("#select-tipo-enviar-documento-historico");
    $selectTipoDocumento.append($("<option/>", { value: 0, text: "Seleccione" }));
    $selectTipoDocumento.append($("<option/>", { value: 8, text: "ESTADOS" }));

    $.each(DATA_TIPO_DOCUMENTO_ENVIAR_DOCUMENTO_HISTORICO, function (index, item) {
        $selectTipoDocumento.append($("<option/>", { value: item.Value, text: item.Text }));
    });
    $selectTipoDocumento.append($("<option/>", { value: 7, text: "TODOS" }));
}

function OnChangeMostrarEstadoDocumentoEnviado(e) {
    var tipo = $(e).val();
    if (tipo == 8) {
        $("#estado-documento-enviado").removeClass('hidden');
    } else {
        $("#estado-documento-enviado").addClass('hidden');
    }
}

function BuscarHistoricoDocumentosEnviados() {

    TIPO = $("#select-tipo-enviar-documento-historico").val();

    if (TIPO == 8) {
        ESTADO = $("#select-estado-enviar-documento-historico").val();
    }

   
    if ($TABLA_ENVIAR_DOCUMENTO_HISTORICO != null) {
        $TABLA_ENVIAR_DOCUMENTO_HISTORICO.draw();
        $("#caja-mostrar-enviar-documento-historico").removeClass('hidden');
    } else {
        $("#caja-mostrar-enviar-documento-historico").removeClass('hidden');
        CrearTablaDocumentosEnviados();

    }
}

/**
*Funcion para crear tabla de los documentos
*/
function CrearTablaDocumentosEnviados() {
    $TABLA_ENVIAR_DOCUMENTO_HISTORICO = $("#tabla-enviar-documentos-historico").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_CONSULTAR_DOCUMENTO_ENVIADO,
            "type": "POST",
            "data": function (d) {
                //d.search['value'] = $filtro.val();
                d.id = TIPO,
                d.estado = ESTADO
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            {
                "data": "DocumentoId",
                //"orderable": false,
                //"searchable": false,
                //"width": "5%",
                //"render": function (data, type, full, meta) {
                //    var checked = ExisteDocumento(full.OrdenCompraId) ? 'checked = "checked"' : "";
                //    var checkBox = '<div data-item-orden-compra="' + data + '" class="checkbox" ><input type="checkbox"  name="DocumentoId" value="' + data + '" onchange =  "OnChangeGuardarDocumento(' + data + ',' + full.OrdenCompraId + ', this)" ' + checked + '></div>'
                //    //var resultado = ""
                //    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                //    return checkBox;

                //}
            },
            { "data": "Tipo" },
            { "data": "Numero" },
            { "data": "Fecha" },
            { "data": "Hora" },
            { "data": "Radicado" },
            { "data": "Estado" },
            { "data": "Observacion" },
            { "data": "UsuarioRecibe" },
            { "data": "FechaEnviada" },
            { "data": "HoraEnviada" },
            { "data": "OrdenCompraId" },
            { "data": "OrdenTrabajo" },
            { "data": "Empresa" },
            { "data": "Cliente" },
            { "data": "DocumentoId" }


        ],
        "drawCallback": function (settings) {
            Utils._InputFormatPrice();
        }
    });
}