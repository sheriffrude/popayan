/*
*VARIBLES GLOBALES
*/
var DATA_TIPO_DOCUMENTO = null;
var $TABLA_ENVIAR_DOCUMENTO = null;
var $TABLA_DOCUMENTO_CARGADO = null;
var $TABLA_USUARIOS = null;
var TIPO = null;
var PARAMETRO = null;
var ARRAY_DOCUMENTOS = [];
var ARRAY_USUARIOS = [];
var ARRAY_USUARIOS_ENVIAR = [];
var CHECK_TODO_DOCUMENTOS = false;

/*
*Funcion que simula el Onload
**/
function OnloadEnviarDocumento(){
    //Cargar Autocomletar buscar usuario
    $InputBuscarUsuario = $("#input-buscar-usuario");
    OnAutocompleteBuscarUsuario($InputBuscarUsuario);
    $("#nav-tabs-enviar-documento a").on("click", function () { OnClickTabEnviarDocumento(this) });
}


/*
*Funcion para utilizar las funciones javascript de cada tab
*/
function OnClickTabEnviarDocumento(e) {

    //e.preventDefault();
    var tab = $(e).attr("data-number-tab");
    if (tab == 2) {
        OnloadEnviarDocumentoHistorico();
    } else {
       
    }
}

/**
 * Consultar lista de proveedores para el seleccionar
 */
function CargarListaTipoDocumento() {
    RequestHttp._Post(URL_LISTAR_TIPO_DOCUMENTO, null, null, function (data) {
        if (data != null) {
            var tipoMensaje = (data.state == true) ? "sucess" : "danger";
            Utils._BuilderMessage(tipoMensaje, data.message);
            if (data.state == true) {
                DATA_TIPO_DOCUMENTO = data.data;
                CargarTipoDocumento();
            } else {
                Utils._BuilderMessage("danger", data.message);
            }

        }
    })
}

/*
*Cargar selects 
*/
function OnChangeSelectTipoFiltro(e) {
    var tipo = parseInt($(e).val());
    var $labelDocumento = $("#label-numero-documento");


    switch (tipo) {
        case 0:
            $labelDocumento.text('Seleccione');
            $("#input-documento").addClass('hidden');
            $("#select-documento").addClass('hidden');
            $("#boton-buscar-documento").addClass('hidden');
            break;
        case 1:
            $labelDocumento.text('Ingrese un # de OC');
            $("#input-documento").removeClass('hidden');
            $("#boton-buscar-documento").removeClass('hidden');
            $("#select-documento").addClass('hidden');
            break;
        case 2:
            $labelDocumento.text('Ingrese un # de Ppto Interno');
            $("#input-documento").removeClass('hidden');
            $("#boton-buscar-documento").removeClass('hidden');
            $("#select-documento").addClass('hidden');
            break;
        case 3:
            $labelDocumento.text('Ingrese el # de OT');
            $("#input-documento").removeClass('hidden');
            $("#boton-buscar-documento").removeClass('hidden');
            $("#select-documento").addClass('hidden');
            break;
        case 4:
            $labelDocumento.text('Ingrese el Nit del Proveedor');
            $("#input-documento").removeClass('hidden');
            $("#boton-buscar-documento").removeClass('hidden');
            $("#select-documento").addClass('hidden');
            break;
        case 5:
            $labelDocumento.text('Ingrese el Nombre del Proveedor');
            $("#input-documento").removeClass('hidden');
            $("#boton-buscar-documento").removeClass('hidden');
            $("#select-documento").addClass('hidden');
            break;
        case 6:
            $("#input-documento").addClass('hidden');
            $("#boton-buscar-documento").removeClass('hidden');
            $("#select-documento").removeClass('hidden');
            if (DATA_TIPO_DOCUMENTO != null) {

            } else {
                CargarListaTipoDocumento();
            }
            break;
        case 7:
            $labelDocumento.text('Ingrese el Nombre del Proveedor');
            $("#input-documento").addClass('hidden');
            $("#boton-buscar-documento").removeClass('hidden');
            $("#select-documento").addClass('hidden');
            break;


    }

}

/**
 * Cargar opcion de el selector de proveedores
 */
function CargarTipoDocumento() {
    $selectTipoDocumento = $("#select-tipo-documento");
    $selectTipoDocumento.append($("<option/>", { value: 0, text: "Seleccione" }));
    $.each(DATA_TIPO_DOCUMENTO, function (index, item) {
        $selectTipoDocumento.append($("<option/>", { value: item.Value, text: item.Text }));
    });
}

/**
*Funcion para buscar los documentos
*/
function BuscarDocumentos() {

    TIPO = $("#tipo-filtro-documento").val();

    if (TIPO == 6) {
        PARAMETRO = $("#select-tipo-documento").val();
    } else {
        if (TIPO == 7) {
            PARAMETRO = 7;
        } else {
            PARAMETRO = $("#numero-documento").val();
        }

    }


    if ($TABLA_ENVIAR_DOCUMENTO != null) {
        $TABLA_ENVIAR_DOCUMENTO.draw();
        $("#caja-mostrar-documento").removeClass('hidden');
    } else {
        $("#caja-mostrar-documento").removeClass('hidden');
        CrearTablaFacturas();

    }


}

/**
*Funcion para crear tabla de los documentos
*/
function CrearTablaFacturas() {
    $TABLA_ENVIAR_DOCUMENTO = $("#tabla-enviar-documentos").DataTable({

        "ajax": {
            "url": URL_CONSULTAR_DOCUMENTO,
            "type": "POST",
            "data": function (d) {
                //d.search['value'] = $filtro.val();
                d.id = TIPO,
                    d.parametro = PARAMETRO

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
                    var checked = ExisteDocumento(full.OrdenCompraId) ? 'checked = "checked"' : "";
                    var checkBox = '<div data-item-orden-compra="' + data + '" class="checkbox" ><input type="checkbox"  name="DocumentoId" value="' + data + '" onchange =  "OnChangeGuardarDocumento(' + data + ',' + full.OrdenCompraId + ', this)" ' + checked + '></div>'
                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                    return checkBox;

                }
            },
            { "data": "Tipo" },
            { "data": "Numero" },
            { "data": "Fecha" },
            { "data": "Hora" },
            { "data": "Radicado" },
            { "data": "OrdenCompraId" },
            { "data": "OrdenTrabajo" },
            { "data": "Empresa" },
            { "data": "Cliente" },
            { "data": "DocumentoId" },
            {
                "data": "OrdenCompraId",
                "render": function (data, type, full, meta) {
                    var VerHistorico = '<div widt="5%"><button type="button" class="btn btn-success" onclick="VerHistoricoAnticipoFactura(' + data + ')">ANTICIPO</button></div>'
                    //var resultado = ""
                    //resultado += (PERMISO_VER_DETALLE_CONTABLE_ANTICIPO) ? botonEstado : "";
                    return VerHistorico;
                }
            }


        ],
        "drawCallback": function (settings) {
            Utils._InputFormatPrice();
        }
    });
}

/*
*Buscar en el arreglo si existe el id del documento
*/
function ExisteDocumento(id) {
    var respuesta = false;
    var longitud = ARRAY_DOCUMENTOS.length;
    for (var i = 0; i < longitud; i++) {
        if (ARRAY_DOCUMENTOS[i].OrdenCompraId == id) {
            respuesta = true;
            break;
        }
    }
    return respuesta;
}

/**
*Funcion para guardar el item en el array
*/
function OnChangeGuardarDocumento(facturaId, OrdenCompraId, e) {
    if ($(e).is(":checked")) {
        $(e).attr('checked', 'checked');
        var DOCUMENTO = {
            'facturaId': facturaId,
            'OrdenCompraId': OrdenCompraId
        };
        ARRAY_DOCUMENTOS.push(DOCUMENTO);
        $("#caja-enviar-documento").removeClass('hidden');
        $("#button-enviar-documneto").removeClass('hidden');
        ConstruirTablaDocumentos();
    } else {
        $(e).attr('checked', false);
        var longitud = ARRAY_DOCUMENTOS.length;
        for (var i = 0; longitud > i; i++) {
            if (ARRAY_DOCUMENTOS[i].OrdenCompraId == OrdenCompraId) {
                ARRAY_DOCUMENTOS.splice(i, 1);
                ConstruirTablaDocumentos();
                break;
            }
        }
    }
}

/**
* Contruye la tabla de imagenes
*/
function ConstruirTablaDocumentos() {
    var tamanoDocumento = ARRAY_DOCUMENTOS.length;
    for (i = 0; tamanoDocumento > i; i++) {
        ARRAY_DOCUMENTOS[i].Orden = i + 1;
    }

    $TABLA_DOCUMENTO_CARGADO = $("#tabla-documentos-cargados").DataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "bInfo": false,
        "data": ARRAY_DOCUMENTOS,
        "columns": [
            {
                "title": "No.",
                "data": "Orden",
                "orderable": false
            },
            {
                "title": "# OC",
                "data": "OrdenCompraId",
                "orderable": false
            },
            {
                "title": "ELIMINAR",
                "data": "Orden",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {

                    var eliminar = '<div><button class="btn btn-danger btn-xs" value="' + data + '" onclick="EliminarDocumento(' + data + ')"> <span class=" glyphicon glyphicon-remove" aria-hidden="true"></span></button></div>'

                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";

                    return eliminar;

                }
            }
        ]
    });

}

/*
* Funcion para eliminar un documento del array de documentos
**/
function EliminarDocumento(id) {

    if (CHECK_TODO_DOCUMENTOS == false) {
        var tamanoDocumento = ARRAY_DOCUMENTOS.length;
        var posicionDocumento = 0;
        for (i = 0; tamanoDocumento > i; i++) {
            if (ARRAY_DOCUMENTOS[i].Orden == id) {
                posicionDocumento = i;
                break;
            }
        }
        ARRAY_DOCUMENTOS.splice(i, 1);
        //IMAGEN.splice(i, 1);
        if ($TABLA_DOCUMENTO_CARGADO != null) {
            $TABLA_DOCUMENTO_CARGADO.draw();
        }

        ConstruirTablaDocumentos();

        if ($TABLA_ENVIAR_DOCUMENTO != null) {
            $TABLA_ENVIAR_DOCUMENTO.draw();
        }
        return false;
    } else {
        CHECK_TODO_DOCUMENTOS = false;
        ARRAY_DOCUMENTOS = [];
        $("#TodoDocumentoId").attr("checked", false);
        $("#caja-enviar-documento").addClass('hidden');
        $("#button-enviar-documneto").addClass('hidden');
        //$("#tabla-enviar-documentos tbody tr").each(function (i) {
        //    if ($("#tabla-enviar-documentos tr").find("input[name='DocumentoId']").is(":checked")) {
        //        $("#tabla-enviar-documentos tbody tr").find("input[name='DocumentoId']").attr('checked', false);
        //    }
        //});
    }
    
}

/*
* Consulta el historico de Anticipos por orden compra
*/
function VerHistoricoAnticipoFactura(ordenCompra) {
    URL_VER_HISTORICO_ANTICIPO_FACTURA = '';
    URL_VER_HISTORICO_ANTICIPO_FACTURA = URL_VER_HISTORICO_ANTICIPO_FACTURAS + "/" + ordenCompra
    Utils._OpenModal(URL_VER_HISTORICO_ANTICIPO_FACTURA, 'HistoricoAnticipoFactura', 'all');
}

/**
 * Consultar lista de Usuarios para el autocompletar
 */
function OnAutocompleteBuscarUsuario($e) {
    $e.autocomplete({
        source: function (request, response) {
            $.ajax({
                url: URL_AUTOCOMPLETAR_LISTAR_USUARIO,
                type: "POST",
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function (result) {
                    if (result.state == true) {
                        response(result.data);
                    } else {
                        Utils._BuilderMessage("danger", result.message);
                    }
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            CargarUsuario(ui.item.id, ui.item.value);
            
        },
        change: function (event, ui) {
            if (ui.item == null) {
                $("#input-buscar-usuario").val("");
            }
        }
    });
}

/*
* Funcion para llenar el array de usuarios
**/
function CargarUsuario(usuarioId, nombreUsuario) {
    $("#usuario-enviar-documentos").removeClass('hidden');
    if (ExisteUsuario(usuarioId) == false) {
        var USUARIO = {
            'id': usuarioId,
            'nombre': nombreUsuario
        };
        ARRAY_USUARIOS.push(USUARIO);
        ARRAY_USUARIOS_ENVIAR.push(usuarioId);
        ConstruirTablaUsuarios();
    } else {
        Utils._BuilderMessage("info", "EL Usuario Ya Se Selecciono");
    }
   
        
}

/*
*Buscar en el arreglo si existe el id del usuario
*/
function ExisteUsuario(usuarioId) {
    var respuesta = false;
    var longitud = ARRAY_USUARIOS.length;
    for (var i = 0; i < longitud; i++) {
        if (ARRAY_USUARIOS[i].id == usuarioId) {
            respuesta = true;
            break;
        }
    }
    return respuesta;
}

/**
* Contruye la tabla de imagenes
*/
function ConstruirTablaUsuarios() {
    var tamanoUsuario = ARRAY_USUARIOS.length;
    for (i = 0; tamanoUsuario > i; i++) {
        ARRAY_USUARIOS[i].Orden = i + 1;
    }

    $TABLA_USUARIOS = $("#tabla-usuario-enviar-documentos").DataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "bInfo": false,
        "data": ARRAY_USUARIOS,
        "columns": [
            {
                "title": "NOMBRE",
                "data": "nombre",
                "orderable": false
            },
            {
                "title": "ELIMINAR",
                "data": "Orden",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {

                    var eliminar = '<div><button class="btn btn-danger btn-xs" value="' + data + '" onclick="EliminarUsuario(' + data + ')"> <span class=" glyphicon glyphicon-remove" aria-hidden="true"></span></button></div>'

                    //var resultado = ""
                    //resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";

                    return eliminar;

                }
            }
        ],
        "drawCallback": function (settings) {
           
        }
    });

}

/*
* Funcion para eleiminar un usuario del array de usuarios
**/
function EliminarUsuario(id) {
    var tamanoUsuario = ARRAY_USUARIOS.length;
    var posicionUsuario = 0;
    for (i = 0; tamanoUsuario > i; i++) {
        if (ARRAY_USUARIOS[i].Orden == id) {
            posicionUsuario = i;
            break;
        }
    }
    ARRAY_USUARIOS.splice(i, 1);
    ARRAY_USUARIOS_ENVIAR.splice(i, 1);
    //IMAGEN.splice(i, 1);
    if ($TABLA_USUARIOS != null) {
        $TABLA_USUARIOS.draw();
    }

    ConstruirTablaUsuarios();
    return false;
}

/*
* Seleccionar todos los documentos
*/
function OnChangeSeleccionarTodosDocumentos(e) {
    if ($(e).is(":checked")) {
        //$("#tabla-enviar-documentos tbody tr").each(function (i) {
        //    if (!$("#tabla-enviar-documentos tr").find("input[name='DocumentoId']").is(":checked")) {
        //        $("#tabla-enviar-documentos tbody tr").find("input[name='DocumentoId']").attr('checked', 'checked');
        //    }
        //});

        CHECK_TODO_DOCUMENTOS = true;
        $(e).attr('checked', 'checked');
        ARRAY_DOCUMENTOS = [];

        var DOCUMENTO = {
            'facturaId': 0,
            'OrdenCompraId': 'TODOS'
        };
        ARRAY_DOCUMENTOS.push(DOCUMENTO);
        $("#caja-enviar-documento").removeClass('hidden');
        $("#button-enviar-documneto").removeClass('hidden');
        ConstruirTablaDocumentos();
    } else {
        CHECK_TODO_DOCUMENTOS = false;
        ARRAY_DOCUMENTOS = [];
        $("#caja-enviar-documento").addClass('hidden');
        $("#button-enviar-documneto").addClass('hidden');
        //$("#tabla-enviar-documentos tbody tr").each(function (i) {
        //    if ($("#tabla-enviar-documentos tr").find("input[name='DocumentoId']").is(":checked")) {
        //        $("#tabla-enviar-documentos tbody tr").find("input[name='DocumentoId']").attr('checked', false);
        //    }
        //});
       
    }
}

/*
* Funcion para enviar los documentos seleccionados a revicion de los usuarios seleccionados
**/
function EnviarDocumento() {

    var longitudArrayDocumentos = ARRAY_DOCUMENTOS.length;
    var longitudArrayUsuarios = ARRAY_USUARIOS.length;
    var longitudArraUsuariosEnviar = ARRAY_USUARIOS_ENVIAR.length;

    if (longitudArrayDocumentos > 0 && longitudArrayUsuarios > 0) {
        Utils._BuilderConfirmation('ENVIAR DOCUMENTOS', '¿DESEA ENVIAR ESTOS DOCUMENTOS?', 'EnviarDocumentos', '');
    } else {
        if (longitudArrayDocumentos == 0) {
            Utils._BuilderMessage("info", "Debe seleccionar un documento");
        } else {
            if (longitudArrayUsuarios == 0) {
                Utils._BuilderMessage("info", "Debe seleccionar un Usuario");
            }

        }
    }

}


function EnviarDocumentos() {
    var longitudArrayDocumentos = ARRAY_DOCUMENTOS.length;
    var longitudArrayUsuarios = ARRAY_USUARIOS.length;
    var longitudArraUsuariosEnviar = ARRAY_USUARIOS_ENVIAR.length;

    if (longitudArrayDocumentos > 0 && longitudArrayUsuarios > 0) {
        var parameters = {
            ListaDocumento: ARRAY_DOCUMENTOS,
            ListaUsuario: ARRAY_USUARIOS_ENVIAR,
            CheckTodo: CHECK_TODO_DOCUMENTOS
        };
        RequestHttp._Post(URL_ENVIAR_DOCUMENTO, parameters, null, function (data) {
            if (data != null) {
                var tipoMensaje = (data.state == true) ? "success" : "danger";
                Utils._BuilderMessage(tipoMensaje, data.message);
                if (data.state == true) {
                    ARRAY_DOCUMENTOS = [];
                    ARRAY_USUARIOS = [];
                    ARRAY_USUARIOS_ENVIAR = [];

                    $("#numero-documento").val("");
                    CHECK_TODO_DOCUMENTOS = false;
                    $("#TodoDocumentoId").attr("checked", false);
                    $("#caja-mostrar-documento").addClass('hidden');
                    $("#caja-enviar-documento").addClass('hidden');
                    $("#usuario-enviar-documentos").addClass('hidden');
                    $("#button-enviar-documneto").addClass('hidden');

                }

            }
        })
    } else {
        if (longitudArrayDocumentos == 0) {
            Utils._BuilderMessage("info", "Debe seleccionar un documento");
        } else {
            if (longitudArrayUsuarios == 0) {
                Utils._BuilderMessage("info", "Debe seleccionar un Usuario");
            }

        }
    }
}
