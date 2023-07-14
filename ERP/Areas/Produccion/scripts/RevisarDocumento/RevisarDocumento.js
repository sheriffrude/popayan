/*
*VARIBLES GLOBALES
*/
var DATA_TIPO_DOCUMENTO_REVISAR = null;
var $TABLA_REVISAR_DOCUMENTO = null;
var TIPO = null;
var FECHA_DESDE = null;
var FECHA_HASTA = null;
var ARRAY_DOCUMENTOS_REVISAR = [];
var CHECK_TODO_DOCUMENTOS_REVISAR = null;

/*
*Funcion que simula el Onload
**/
function OnloadRevisarDocumento() {
    CargarListaTipoDocumentoRevisar();
    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#fecha-desde-revisar-documento").datepicker({

        dateFormat: 'dd/mm/yy',
        firstDay: 1
    }).datepicker("setDate", new Date()).val('');

    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#fecha-hasta-revisar-documento").datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1
    }).datepicker("setDate", new Date()).val('');
    $("#nav-tabs-revisar-documento a").on("click", function () { OnClickTabRevisarDocumento(this) });
}

/*
*Funcion para utilizar las funciones javascript de cada tab
*/
function OnClickTabRevisarDocumento(e) {

    //e.preventDefault();
    var tab = $(e).attr("data-number-tab");
    if (tab == 2) {
        OnloadRevisarDocumentoHistorico();
    } else {

    }
}


/**
 * Consultar lista de tipos de documentos para el seleccionar
 */
function CargarListaTipoDocumentoRevisar() {
    if (DATA_TIPO_DOCUMENTO_REVISAR == null) {
        RequestHttp._Post(URL_LISTAR_TIPO_DOCUMENTO, null, null, function (data) {
            if (data != null) {
                var tipoMensaje = (data.state == true) ? "sucess" : "danger";
                Utils._BuilderMessage(tipoMensaje, data.message);
                if (data.state == true) {
                    DATA_TIPO_DOCUMENTO_REVISAR = data.data;
                    CargarTipoDocumentoRevisar();
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
function CargarTipoDocumentoRevisar() {
    $selectTipoDocumento = $("#select-tipo-documento-revisar");
    $selectTipoDocumento.append($("<option/>", { value: 0, text: "Seleccione" }));
    
    $.each(DATA_TIPO_DOCUMENTO_REVISAR, function (index, item) {
        $selectTipoDocumento.append($("<option/>", { value: item.Value, text: item.Text }));
    });
    $selectTipoDocumento.append($("<option/>", { value: 7, text: "TODOS" }));
}

function BuscarRevisarDocumentos() {

    TIPO = $("#select-tipo-documento-revisar").val();
    FECHA_DESDE = $("#fecha-desde-revisar-documento").val();
    FECHA_HASTA = $("#fecha-hasta-revisar-documento").val();

    if ($TABLA_REVISAR_DOCUMENTO != null) {
        $TABLA_REVISAR_DOCUMENTO.draw();
        $("#caja-mostrar-documento-revisar").removeClass('hidden');
    } else {
        $("#caja-mostrar-documento-revisar").removeClass('hidden');
        CrearTablaDocumentoRevisar();

    }
}

/**
*Funcion para crear tabla de los documentos
*/
function CrearTablaDocumentoRevisar() {
    $TABLA_REVISAR_DOCUMENTO = $("#tabla-revisar-documentos").DataTable({

        "ajax": {
            "url": URL_CONSULTAR_DOCUMENTO_REVISAR,
            "type": "POST",
            "data": function (d) {
                //d.search['value'] = $filtro.val();
                d.id = TIPO,
                d.fechaDesde = FECHA_DESDE,
                d.fechaHasta = FECHA_HASTA
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            {
                "data": "DocumentoId",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = ExisteDocumentoRevisar(full.OrdenCompraId) ? 'checked = "checked"' : "";
                    var checkBox = '<div data-item-orden-compra="' + data + '" class="checkbox" ><input type="checkbox"  name="DocumentoId" value="' + data + '" onchange =  "OnChangeGuardarDocumentoRevisar(' + data + ',' + full.OrdenCompraId + ',' + full.Numero + ', this)" ' + checked + '></div>'
                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                    return checkBox;

                }
            },
            { "data": "Numero" },
            { "data": "OrdenCompraId" },
            { "data": "OrdenTrabajo" },
            { "data": "Empresa" },
            { "data": "Cliente" },
            { "data": "Radicado" },
            { "data": "Fecha" },
            { "data": "Hora" },
            { "data": "Tipo" },
            { "data": "DocumentoId" }


        ],
        "drawCallback": function (settings) {
            Utils._InputFormatPrice();
        }
    });
}

/*
*Buscar en el arreglo si existe el id del documento
*/
function ExisteDocumentoRevisar(id) {
    var respuesta = false;
    var longitud = ARRAY_DOCUMENTOS_REVISAR.length;
    for (var i = 0; i < longitud; i++) {
        if (ARRAY_DOCUMENTOS_REVISAR[i].OrdenCompraId == id) {
            respuesta = true;
            break;
        }
    }
    return respuesta;
}

/**
*Funcion para guardar el item en el array
*/
function OnChangeGuardarDocumentoRevisar(facturaId, OrdenCompraId, Numero, e) {
    if ($(e).is(":checked")) {
        $(e).attr('checked', 'checked');
        var DOCUMENTO = {
            'facturaId': facturaId,
            'OrdenCompraId': OrdenCompraId,
            'Numero': Numero
        };
        ARRAY_DOCUMENTOS_REVISAR.push(DOCUMENTO);
    } else {
        $(e).attr('checked', false);
        var longitud = ARRAY_DOCUMENTOS_REVISAR.length;
        for (var i = 0; longitud > i; i++) {
            if (ARRAY_DOCUMENTOS_REVISAR[i].OrdenCompraId == OrdenCompraId) {
                ARRAY_DOCUMENTOS_REVISAR.splice(i, 1);
                break;
            }
        }
    }
}

/*
* Funcion para eliminar un documento del array de documentos
**/
function EliminarDocumento(id) {

    if (CHECK_TODO_DOCUMENTOS_REVISAR == false) {
        var tamanoDocumento = ARRAY_DOCUMENTOS_REVISAR.length;
        var posicionDocumento = 0;
        for (i = 0; tamanoDocumento > i; i++) {
            if (ARRAY_DOCUMENTOS_REVISAR[i].Orden == id) {
                posicionDocumento = i;
                break;
            }
        }
        ARRAY_DOCUMENTOS_REVISAR.splice(i, 1);
        return false;
    } else {
        CHECK_TODO_DOCUMENTOS_REVISAR = false;
        ARRAY_DOCUMENTOS_REVISAR = [];
        $("#TodoDocumentoRevisarId").attr("checked", false);
        //$("#tabla-enviar-documentos tbody tr").each(function (i) {
        //    if ($("#tabla-enviar-documentos tr").find("input[name='DocumentoId']").is(":checked")) {
        //        $("#tabla-enviar-documentos tbody tr").find("input[name='DocumentoId']").attr('checked', false);
        //    }
        //});
    }

}

/*
* Seleccionar todos los documentos
*/
function OnChangeSeleccionarTodosDocumentosRevisar(e) {
    if ($(e).is(":checked")) {
        //$("#tabla-enviar-documentos tbody tr").each(function (i) {
        //    if (!$("#tabla-enviar-documentos tr").find("input[name='DocumentoId']").is(":checked")) {
        //        $("#tabla-enviar-documentos tbody tr").find("input[name='DocumentoId']").attr('checked', 'checked');
        //    }
        //});

        CHECK_TODO_DOCUMENTOS_REVISAR = true;
        $(e).attr('checked', 'checked');
        ARRAY_DOCUMENTOS_REVISAR = [];

        var DOCUMENTO = {
            'facturaId': 0,
            'OrdenCompraId': 'TODOS'
        };
        ARRAY_DOCUMENTOS_REVISAR.push(DOCUMENTO);
    } else {
        CHECK_TODO_DOCUMENTOS_REVISAR = false;
        ARRAY_DOCUMENTOS_REVISAR = [];
        //$("#tabla-enviar-documentos tbody tr").each(function (i) {
        //    if ($("#tabla-enviar-documentos tr").find("input[name='DocumentoId']").is(":checked")) {
        //        $("#tabla-enviar-documentos tbody tr").find("input[name='DocumentoId']").attr('checked', false);
        //    }
        //});

    }
}

/*
* Funcion para aprobar los documentos seleccionados
**/
function AprobarDocumento() {
    var longitudArrayDocumentos = ARRAY_DOCUMENTOS_REVISAR.length;

    if (longitudArrayDocumentos > 0) {
        Utils._BuilderConfirmation('ENVIAR DOCUMENTOS A APROBACIÓN', '¿DESEA APROBAR ESTOS DOCUMENTOS?', 'EnviarDocumentoAprobado', '');
    } else {
        Utils._BuilderMessage("info", "Debe seleccionar un documento");
        
    }
}

function EnviarDocumentoAprobado() {
    var longitudArrayDocumentos = ARRAY_DOCUMENTOS_REVISAR.length;

    if (longitudArrayDocumentos > 0) {
        var parameters = {
            ListaDocumento: ARRAY_DOCUMENTOS_REVISAR,
            CheckTodo: CHECK_TODO_DOCUMENTOS_REVISAR
        };
        RequestHttp._Post(URL_APROBAR_DOCUMENTO, parameters, null, function (data) {
            if (data != null) {
                var tipoMensaje = (data.state == true) ? "success" : "danger";
                Utils._BuilderMessage(tipoMensaje, data.message);
                if (data.state == true) {
                    ARRAY_DOCUMENTOS_REVISAR = [];

                    $("#fecha-desde-revisar-documento").val("");
                    $("#fecha-hasta-revisar-documento").val("");
                    CHECK_TODO_DOCUMENTOS_REVISAR = false;
                    $("#TodoDocumentoRevisarId").attr("checked", false);
                    $("#caja-mostrar-documento-revisar").addClass('hidden');
                    
                }

            }
        })
    } else {
        if (longitudArrayDocumentos == 0) {
            Utils._BuilderMessage("info", "Debe seleccionar un documento");
        }
    }
}

/**
* Abrir modal para agregar observacion a documentos a rechazar
*/
function AbrirModalRechazarDocumento() {
    if (CHECK_TODO_DOCUMENTOS_REVISAR == true) {
        RechazarTodosDocumentos();

    } else {
        var longitudArrayDocumentos = ARRAY_DOCUMENTOS_REVISAR.length;
        if (longitudArrayDocumentos > 0) {
            URL_VER_DOCUMENTOS_RECHAZAR = '';
            URL_VER_DOCUMENTOS_RECHAZAR = URL_VER_DOCUMENTO_RECHAZAR
            Utils._OpenModal(URL_VER_DOCUMENTOS_RECHAZAR, 'RechazarDocumento');
        } else {
            Utils._BuilderMessage("info", "Debe seleccionar un documento");
        }
    }

}

/*
* Cargar el textarea de observacion para todos los documentos
**/
function RechazarTodosDocumentos() {
    RequestHttp._Post(URL_CONSULTAR_TODOS_DOCUMENTOS, null, null, function (response) {
        if (response != null) {
            var tipoMensaje = (response.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoMensaje, response.message);
            if (response.state == true) {
                ARRAY_DOCUMENTOS_REVISAR = response.data;
                Utils._OpenModal(URL_VER_DOCUMENTO_RECHAZAR, 'RechazarDocumento');
            }

        }
    })
}


/*
* Funcion para rechazar los documentos seleccionados
**/
function RechazarDocumentos() {
    var seguir = false;
    $("textarea[name='observacion-rechazo-documento']").each(function (i) {
       
        var numeroFactura = $(this).attr('data-observacion-numero-factura');
        var numeroOrdenCompra = $(this).attr('data-observacion-documento');
        var observacion = $(this).val();
        
        if (observacion != '') {
            var longitud = ARRAY_DOCUMENTOS_REVISAR.length;
            for (var i = 0; longitud > i; i++) {
                if (ARRAY_DOCUMENTOS_REVISAR[i].OrdenCompraId == numeroOrdenCompra) {
                    ARRAY_DOCUMENTOS_REVISAR[i].Observacion = observacion;
                    seguir = true;
                    break;
                }
            }
            
        } else {
            Utils._BuilderMessage("warning", "Debe ingresar la observación de la factura # " + numeroFactura);
            seguir = false;
            return false;
        }

    });

    console.log(ARRAY_DOCUMENTOS_REVISAR);

    if(seguir == true){
        var longitudArrayDocumentos = ARRAY_DOCUMENTOS_REVISAR.length;

        if (longitudArrayDocumentos > 0) {
            var parameters = {
                ListaDocumento: ARRAY_DOCUMENTOS_REVISAR,
                CheckTodo: CHECK_TODO_DOCUMENTOS_REVISAR
            };
            RequestHttp._Post(URL_RECHAZAR_DOCUMENTO, parameters, null, function (data) {
                if (data != null) {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    if (data.state == true) {
                        ARRAY_DOCUMENTOS_REVISAR = [];
                        $("#fecha-desde-revisar-documento").val("");
                        $("#fecha-hasta-revisar-documento").val("");
                        CHECK_TODO_DOCUMENTOS_REVISAR = false;
                        $("#TodoDocumentoRevisarId").attr("checked", false);
                        $("#caja-mostrar-documento-revisar").addClass('hidden');
                        Utils._CloseModal();

                    }

                }
            })
        } else {
            if (longitudArrayDocumentos == 0) {
                Utils._BuilderMessage("info", "Debe seleccionar un documento");
            }
        }
    }

}

