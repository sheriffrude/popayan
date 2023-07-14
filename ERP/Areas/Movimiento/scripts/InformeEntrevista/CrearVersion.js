var DATA_USUARIOS = [];
var DATA_COPIADOS = [];
var DATA_TEMAS = [];
var DATA_COMPROMISO_AGENCIA = [];
var DATA_COMPROMISO_CLIENTE = [];
var DATA_CLIENTES = [];
var $TABLA_COMPROMISO_CLIENTE_VISUALIZAR = null;
var $TABLA_COMPROMISO_AGENCIA_VISUALIZAR = null;
var FILE = null;

function OnLoadCrearVersionInforme() {
    DATA_USUARIOS = [];
    DATA_COPIADOS = [];
    DATA_TEMAS = [];
    DATA_COMPROMISO_AGENCIA = [];
    DATA_COMPROMISO_CLIENTE = [];
    DATA_CLIENTES = [];
    tinymce.init({
        selector: '#InformacionGeneral'
    });

    $("#Fecha").datepicker({ minDate: "+0D" }).datepicker("setDate", new Date());
    $("#FechaReunion").datepicker({ minDate: "+0D" }).datepicker("setDate", new Date());
    $("#FechaCompromisoCliente").datepicker({ minDate: "+0D" }).datepicker("setDate", new Date());

    $('#HoraInicio').timepicker();
    $('#HoraFin').timepicker();

    $("#input-filtro-empleado").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: URL_AUTOCOMPLETAR_USUARIO,
                type: "POST",
                dataType: "json",
                data: {
                    filtro: request.term,
                },
                success: function (result) {
                    if (result.state == true) {
                        response(result.data);
                        var total = result.data.length;
                        if (total == 0) {
                            Utils._BuilderMessage("danger", "No existen clientes asociados a la empresa!");
                        }
                    } else {
                        Utils._BuilderMessage("danger", result.message);
                    }
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            });

        },
        minLength: 3,
        select: function (event, ui) {

            seleccionarUsuario(ui.item.id, ui.item.label);
            $(this).val("");
            return false;
        },
        search: function (event, ui) {
        }

    });


    $("#input-filtro-copiar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: URL_AUTOCOMPLETAR_USUARIO,
                type: "POST",
                dataType: "json",
                data: {
                    filtro: request.term,
                },
                success: function (result) {
                    if (result.state == true) {
                        response(result.data);
                        var total = result.data.length;
                        if (total == 0) {
                            Utils._BuilderMessage("danger", "No existen clientes asociados a la empresa!");
                        }
                    } else {
                        Utils._BuilderMessage("danger", result.message);
                    }
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            });

        },
        minLength: 3,
        select: function (event, ui) {

            seleccionarCopiar(ui.item.id, ui.item.label);
            $(this).val("");
            return false;
        },
        search: function (event, ui) {
        }

    });

    
    $('[data-toggle="tooltip"]').tooltip();
}

$TABLA_COPIADOS = null;

function seleccionarCopiar(id, nombre) {
    var estado = true;
    var tamanoDataSetUsuario = DATA_COPIADOS.length;

    for (var i = 0; DATA_USUARIOS.length > i; i++) {
        if (DATA_USUARIOS[i]["id"] == id) {
            estado = false;
           
            Utils._BuilderMessage("danger", "El usuario ya ha sido seleccionado!");
            break;
        } else {

            estado = true;
        }
    }

    if (estado == true) {


        if (tamanoDataSetUsuario == 0) {
            DATA_COPIADOS.push({
                nombre: nombre,
                id: id
            })
        } else {
            for (var i = 0; tamanoDataSetUsuario > i; i++) {
                if (DATA_COPIADOS[i]["id"] == id) {
                    estado = false;
                    break;
                } else {

                    estado = true;
                }
            }

            if (estado == true) {
                DATA_COPIADOS.push({
                    nombre: nombre,
                    id: id
                });
                if ($TABLA_COPIADOS != null)
                    $TABLA_COPIADOS.fnDestroy();
            } else {
                Utils._BuilderMessage("danger", "El usuario ya ha sido seleccionado!");
            }
        }
    }
    ContruirTablaCopiados();
    return false;
}



function ContruirTablaCopiados() {
    $TABLA_COPIADOS = $("#tabla-copiados").dataTable({
        "destroy": true,
        "bPaginate": false,
        "info": false,
        "serverSide": false,
        "data": DATA_COPIADOS,
        "columns": [
            {
                "title": "nombre",
                "data": "nombre",
                "orderable": false,
            },
            {
                "data": "id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarOpcionCopiados(' + data + ')" >';
                }
            }
        ]
    });

    $("#input-filtro-copiar").val("");
}
function EliminarOpcionCopiados(id) {
    var tamanoDataSetOpciones = DATA_COPIADOS.length;

    for (var i = 0; tamanoDataSetOpciones > i; i++) {
        if (DATA_COPIADOS[i]["id"] == id) {
            DATA_COPIADOS.splice(i, 1);
            break;
        }
    }

    if ($TABLA_COPIADOS != null) {
        $TABLA_COPIADOS.fnDestroy();
    }
    ContruirTablaCopiados();
}

function seleccionarUsuario(id, nombre) {
    console.log(id + "---->");
    var estado = false;
    var tamanoDataSetUsuario = DATA_USUARIOS.length;
    if (tamanoDataSetUsuario == 0) {
        DATA_USUARIOS.push({
            nombre: nombre,
            id: id
        })
    } else {
        for (var i = 0; tamanoDataSetUsuario > i; i++) {
            if (DATA_USUARIOS[i]["id"] == id) {
                estado = false;
                break;
            } else {

                estado = true;
            }

        }
        if (estado == true) {
            DATA_USUARIOS.push({
                nombre: nombre,
                id: id
            });
            if ($TABLA_USUARIO != null)
                $TABLA_USUARIO.fnDestroy();
        } else {
            Utils._BuilderMessage("danger", "El usuario ya ha sido seleccionado!");
        }
    }

    ContruirTablaUsuarios();
    return false;
}

function ContruirTablaUsuarios() {
    $TABLA_USUARIO = $("#tabla-usuario").dataTable({
        "destroy": true,
        "bPaginate": false,
        "info": false,
        "serverSide": false,
        "data": DATA_USUARIOS,
        "columns": [
            {
                "title": "nombre",
                "data": "nombre",
                "orderable": false,
            },
            {
                "data": "id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarOpcion(' + data + ')" >';
                }
            }
        ]
    });

    $("#input-filtro-empleado").val(" ");
}
function EliminarOpcion(id) {
    var tamanoDataSetOpciones = DATA_USUARIOS.length;

    for (var i = 0; tamanoDataSetOpciones > i; i++) {
        if (DATA_USUARIOS[i]["id"] == id) {
            DATA_USUARIOS.splice(i, 1);
            break;
        }
    }

    if ($TABLA_USUARIO != null) {
        $TABLA_USUARIO.fnDestroy();
    }
    ContruirTablaUsuarios();
}


function AdicionarNombre() {
    $("#tabla-clientes_informe_entrevista").removeClass("hidden");
    var nombre = $("#Nombre").val();
    var email = $("#correo").val();
    var copia = ($("#checkinforme_etrevista_copiar_a").is(':checked'));

    if (!Validations._Requerido(email)) {
        Utils._BuilderMessage("danger", "El campo correo no puede ser nulo.");
        return false;
    }
    if (!Validations._Requerido(nombre)) {
        Utils._BuilderMessage("danger", "El campo nombre no puede ser nulo.");
        return false;
    }
    var tamanoDataTelefonos = DATA_CLIENTES.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        if (DATA_CLIENTES[i]["nombre"] == nombre) {
            Utils._BuilderMessage("danger", "Ya existe este nombre.");
            return false;
        }
    }
    var objectTelefono = {
        "nombre": nombre,
        "email": email,
        "copia": copia

    };
    DATA_CLIENTES.push(objectTelefono);
    RecargarTablaClientes();
    $("#Nombre").val("");
    $("#correo").val("");
    $("#checkinforme_etrevista_copiar_a").prop('checked', false);
    console.info(DATA_CLIENTES);
}


/**
 * Recarga la tabla telefonos
 */
var $TABLA_CLIENTES = null;
function RecargarTablaClientes() {

    var tamanoDataTelefonos = DATA_CLIENTES.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        DATA_CLIENTES[i]["id"] = i;
    }
    if ($TABLA_CLIENTES != null) {
        $TABLA_CLIENTES.fnDestroy();
    }
    ConstruirTablaClientes();
}



/**
 * Construye la tabla telefonos apartir de DATA_TELEFONOS
 */
function ConstruirTablaClientes() {

    $TABLA_CLIENTES = $("#tabla-clientes_informe_entrevista").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_CLIENTES,
        "bPaginate": false,
        "columns": [
            {
                "data": "nombre",
                "orderable": false,
            },
            {
                "data": "email",
                "orderable": false,
            },
             {
                 "data": "copia",
                 "orderable": false,
                 "searchable": false,
                 "width": "20%",
                 "render": function (data, type, full, meta) {
                     if (data == true) {
                         return "Si";
                     } else {
                         return "No";
                     }

                 }
             },
              {
                  "data": "id",
                  "orderable": false,
                  "searchable": false,
                  "width": "20%",
                  "render": function (data, type, full, meta) {
                      var html = '<input type="hidden" name="ListaTelefonos" value="' + full.telefono + '" />';
                      html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarCliente(' + data + ')" />';
                      return html;
                  }
              }
        ]
    });
}

function EliminarCliente(id) {
    DATA_CLIENTES.splice(id, 1);
    RecargarTablaClientes();
}



function AdicionarTema() {
    $("#tabla-temas_informe_entrevista").removeClass('hidden');
    var tema = $("#Tema_informe_entrevista").val();

    if (!Validations._Requerido(tema)) {
        Utils._BuilderMessage("danger", "El campo tema no puede ser nulo.");
        return false;
    }
    var tamanoDataTelefonos = DATA_TEMAS.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        if (DATA_TEMAS[i]["tema"] == tema) {
            Utils._BuilderMessage("danger", "Ya existe este tema.");
            return false;
        }
    }
    var objectTelefono = {
        "tema": tema
    };
    DATA_TEMAS.push(objectTelefono);
    RecargarTablaTema();
    $("#Tema_informe_entrevista").val("");
    var tamanoDataTelefonos2 = DATA_TEMAS.length;
    if (tamanoDataTelefonos2 == 0) {
        $("#Compromiso_Agencia_Informe_Entrevista").addClass('hidden');
        $("#Compromiso_Cliente_Informe_Entrevista").addClass('hidden');
    } else {
        $("#Compromiso_Agencia_Informe_Entrevista").removeClass('hidden');
        $("#Compromiso_Cliente_Informe_Entrevista").removeClass('hidden');
    }
}



/**
 * Recarga la tabla telefonos
 */
var $TABLA_TEMAS = null;
function RecargarTablaTema() {

    var tamanoDataTelefonos = DATA_TEMAS.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        DATA_TEMAS[i]["id"] = i;
    }
    if ($TABLA_TEMAS != null) {
        $TABLA_TEMAS.fnDestroy();
    }
    ConstruirTablaTemas();
}



/**
 * Construye la tabla telefonos apartir de DATA_TELEFONOS
 */
function ConstruirTablaTemas() {

    $TABLA_TEMAS = $("#tabla-temas_informe_entrevista").dataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "info": false,
        "data": DATA_TEMAS,
        "bPaginate": false,
        "columns": [
            {
                "data": "tema",
                "orderable": false,
            },
              {
                  "data": "id",
                  "orderable": false,
                  "searchable": false,
                  "width": "20%",
                  "render": function (data, type, full, meta) {
                      var html = '<input type="hidden" name="ListaTelefonos" value="' + full.telefono + '" />';
                      html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarTema(' + data + ')" />';
                      return html;
                  }
              }
        ]
    });
}

function EliminarTema(id) {
    DATA_TEMAS.splice(id, 1);
    var tamanoDataTelefonos = DATA_TEMAS.length;
    if (tamanoDataTelefonos == 0) {
        $("#Compromiso_Agencia_Informe_Entrevista").addClass('hidden');
        $("#Compromiso_Cliente_Informe_Entrevista").addClass('hidden');
    } else {
        $("#Compromiso_Agencia_Informe_Entrevista").removeClass('hidden');
        $("#Compromiso_Cliente_Informe_Entrevista").removeClass('hidden');
    }
    ConstruirTablaTemas();
}




function AdicionarCompromiso_Agencia() {
    var UsuarioId = $("#UsuariosId").val();
    var Nombre = $('#UsuariosId  option:selected').text();
    var fecha = $("#FechaCompromiso").val();
    var descripcion = $("#DescripcionCompromiso").val();
    if (!Validations._Requerido(Nombre)) {
        Utils._BuilderMessage("danger", "La Persona es obligatoria.");
        return false;
    }
    if (!Validations._Requerido(fecha)) {
        Utils._BuilderMessage("danger", "La fecha es obligatoria.");
        return false;
    }
    if (!Validations._Requerido(descripcion)) {
        Utils._BuilderMessage("danger", "El compromiso es obligatorio.");
        return false;
    }
    var tamanoDataTelefonos = DATA_COMPROMISO_AGENCIA.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        if (DATA_COMPROMISO_AGENCIA[i]["tema"] == Nombre) {
            Utils._BuilderMessage("danger", "Ya existe este tema.");
            return false;
        }
    }
    var objectTelefono = {
        "Usuarioid":UsuarioId,
        "nombre": Nombre,
        "fecha": fecha,
        "descripcion": descripcion
    };
    DATA_COMPROMISO_AGENCIA.push(objectTelefono);
    RecargarTablaCompromisoAgencia();


    //$("#UsuariosId").val("");
    $("#FechaCompromiso").val("");
    $("#DescripcionCompromiso").val("");

}

/**
 * Recarga la tabla telefonos
 */
var $TABLA_COMPROMISO_AGENCIA = null;

function RecargarTablaCompromisoAgencia() {

    var tamanoDataTelefonos = DATA_COMPROMISO_AGENCIA.length;

    for (var i = 0; i < tamanoDataTelefonos; i++) {
        DATA_COMPROMISO_AGENCIA[i]["id"] = i;
    }
    if ($TABLA_COMPROMISO_AGENCIA != null) {
        $TABLA_COMPROMISO_AGENCIA.fnDestroy();
    }
    ConstruirTablaCompromisoAgencia();
}



/**
 * Construye la tabla telefonos apartir de DATA_TELEFONOS
 */
function ConstruirTablaCompromisoAgencia() {
    $("#tabla-compromiso-agencia-entrevista").removeClass('hidden');
    $TABLA_COMPROMISO_AGENCIA = $("#tabla-compromiso-agencia-entrevista").dataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "info": false,
        "data": DATA_COMPROMISO_AGENCIA,
        "bPaginate": false,
        "columns": [
            {
                "data": "nombre",
                "orderable": false,
            }, {
                "data": "fecha",
                "orderable": false,
            }, {
                "data": "descripcion",
                "orderable": false,
            },
              {
                  "data": "id",
                  "orderable": false,
                  "searchable": false,
                  "width": "20%",
                  "render": function (data, type, full, meta) {
                      var html = '<input type="hidden" name="ListaTelefonos" value="' + full.telefono + '" />';
                      html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarCompromiso_agencia(' + data + ')" />';
                      return html;
                  }
              }
        ]
    });
}
function EliminarCompromiso_agencia(id) {
    DATA_COMPROMISO_AGENCIA.splice(id, 1);

    ConstruirTablaCompromisoAgencia();
}

//COMPROMISO CLIENTE


function AdicionarCompromiso_Cliente() {
    $('#tabla-compromiso-cliente-entrevista').removeClass("hidden");
    var Nombre = $('#Persona_Compromiso_Cliente').val();
    var fecha = $("#FechaCompromisoCliente").val();
    var descripcion = $("#DescripcionCompromisoCliente").val();
    if (!Validations._Requerido(Nombre)) {
        Utils._BuilderMessage("danger", "La Persona es obligatoria.");
        return false;
    }
    if (!Validations._Requerido(fecha)) {
        Utils._BuilderMessage("danger", "La fecha es obligatoria.");
        return false;
    }
    if (!Validations._Requerido(descripcion)) {
        Utils._BuilderMessage("danger", "El compromiso es obligatorio.");
        return false;
    }
    var tamanoDataTelefonos = DATA_COMPROMISO_CLIENTE.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        if (DATA_COMPROMISO_CLIENTE[i]["descripcion"] == descripcion) {
            Utils._BuilderMessage("danger", "Ya existe este tema.");
            return false;
        }
    }
    var objectTelefono = {
        "nombre": Nombre,
        "fecha": fecha,
        "descripcion": descripcion
    };
    DATA_COMPROMISO_CLIENTE.push(objectTelefono);
    RecargarTablaCompromisoCliente();
    $("#Persona_Compromiso_Cliente").val("");
    $("#FechaCompromisoCliente").val("");
    $("#DescripcionCompromisoCliente").val("");
}

/**
 * Recarga la tabla telefonos
 */
var $TABLA_COMPROMISO_CLIENTE = null;
function RecargarTablaCompromisoCliente() {

    var tamanoDataTelefonos = DATA_COMPROMISO_CLIENTE.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        DATA_COMPROMISO_CLIENTE[i]["id"] = i;
    }
    if ($TABLA_COMPROMISO_CLIENTE != null) {
        $TABLA_COMPROMISO_CLIENTE.fnDestroy();
    }
    ConstruirTablaCompromisoCliente();
}



/**
 * Construye la tabla telefonos apartir de DATA_TELEFONOS
 */
function ConstruirTablaCompromisoCliente() {

    $TABLA_COMPROMISO_CLIENTE = $("#tabla-compromiso-cliente-entrevista").dataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "info": false,
        "data": DATA_COMPROMISO_CLIENTE,
        "bPaginate": false,
        "columns": [
            {
                "data": "nombre",
                "orderable": false,
            }, {
                "data": "fecha",
                "orderable": false,
            }, {
                "data": "descripcion",
                "orderable": false,
            },
              {
                  "data": "id",
                  "orderable": false,
                  "searchable": false,
                  "width": "20%",
                  "render": function (data, type, full, meta) {
                      var html = '<input type="hidden" name="ListaTelefonos" value="' + full.telefono + '" />';
                      html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarCompromiso_cliente(' + data + ')" />';
                      return html;
                  }
              }
        ]
    });
}

function EliminarCompromiso_cliente(id) {
    DATA_COMPROMISO_CLIENTE.splice(id, 1);

    ConstruirTablaCompromisoCliente();
}

//--VISUALIZAR--//

function Visualizar() {

    $("#Form_Crear_Informe_Entrevista").addClass('hidden');
    $("#Visualizar_Informe_Entrevista").removeClass('hidden');
    $("#Guardar").removeClass('hidden');

    $("#Visualizar_cliente").text('  ' + ORDEN_TRABAJO_LISTAR.CLIENTE);
    var fecha = $("#Fecha").val();
    var lugar = $("#Lugar").val();
    $("#Visualizar_Fecha_lugar").text(fecha + ' ; ' + lugar);
    var referencia = $("#Titulo").val();
    $("#Visualizar_Referencia").text(referencia);
    var tipoReunion = $("#TipoReunionId option:selected").text();
    $("#Visualizar_Tipo_Reunion").text(tipoReunion);
    var HoraInicio = $("#HoraInicio").val();
    $("#Visualizar_Hora_Inicio").text(HoraInicio);
    var HoraInicio = $("#HoraFin").val();
    $("#Visualizar_Hora_Fin").text(HoraInicio);
    var tam = DATA_USUARIOS.length;
    var usuarios = '<ul>';
    for (i = 0; i < tam; i++) {
        usuarios += '<li>' + DATA_USUARIOS[i]['nombre'] + '</li>';
    }
    usuarios += '</ul>';
    $("#Visualizar_Asistentes_Agencia").html(usuarios);

    var tam2 = DATA_CLIENTES.length;
    var clientes = '<ul>';
    for (i = 0; i < tam2; i++) {
        if (DATA_CLIENTES[i]['copia'] == false) {
            clientes += '<li>' + DATA_CLIENTES[i]['nombre'] + '</li>';
        }

    }
    clientes += '</ul>';
    $("#Visualizar_Cliente_Agencia").html(clientes);
    var nota = $("#Nota").val();
    $("#Visualizar_Nota").text(nota);
    var descripcion = tinyMCE.get('Descripcion').getContent({ format: 'html' });
    if (descripcion === "") {
        descripcion = $("#Descripcion").val();
    }
    $("#Visualizar_Info_General").html(descripcion);
    //temas tratados
    var tam3 = DATA_TEMAS.length;
    var temas = '<ul>';
    for (i = 0; i < tam3; i++) {
        temas += '<li>' + DATA_TEMAS[i]['tema'] + '</li>';
    }
    temas += '</ul>';
    $("#Visualizar_Temas").html(temas);
    //Compromisos Agencia



    $TABLA_COMPROMISO_AGENCIA_VISUALIZAR = $("#tabla-visualizar-compromiso-agencia").dataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "info": false,
        "data": DATA_COMPROMISO_AGENCIA,
        "bPaginate": false,
        "columns": [
            {
                "data": "nombre",
                "orderable": false,
            }, {
                "data": "fecha",
                "orderable": false,
            }, {
                "data": "descripcion",
                "orderable": false,
            }
        ]
    });

    //Compromiso cliente


    $TABLA_COMPROMISO_CLIENTE_VISUALIZAR = $("#tabla-visualizar-compromiso-cliente").dataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "info": false,
        "data": DATA_COMPROMISO_CLIENTE,
        "bPaginate": false,
        "columns": [
            {
                "data": "nombre",
                "orderable": false,
            }, {
                "data": "fecha",
                "orderable": false,
            }, {
                "data": "descripcion",
                "orderable": false,
            }
        ]
    });


}
//--CERRAR VISUALIZACION --//
function CerrarVisualizacion(){
    $("#Form_Crear_Informe_Entrevista").removeClass('hidden');
    $("#Visualizar_Informe_Entrevista").addClass('hidden');
    tinymce.init({
        selector: '#Descripcion'
    });
}

//---ONBEGIN--//

var DATA_TEMAS_STRING = [];
function OnBeginFormCrearVersionInformeEntrevista(jqXHR, settings) {
   /* var tamanoDataPreguntas = DATA_CLIENTES.length;
    if (tamanoDataPreguntas <= 0) {
        Utils._BuilderMessage("danger", "Debe adicionar minimo una pregunta para continuar.");
        return false;
    }
    */
    var tamanoDataTelefonos = DATA_TEMAS.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        DATA_TEMAS_STRING.push(DATA_TEMAS[i]['tema']);
    }

    var data = $(this).serializeObject();

    var descripcion = tinyMCE.get('InformacionGeneral').getContent({ format: 'text' });
    //var descripcion = $("#Descripcion").val();
    //if (descripcion === "") {
    //    descripcion = $("#Descripcion").val();
    //}
    data["InformacionGeneral"] = descripcion.toString();
    data["ListaAsistentesAgencia"] = DATA_USUARIOS;
    data["ListaAsistentesAgenciaCopia"] = DATA_COPIADOS;
    data["ListaClientes"] = DATA_CLIENTES;
    data["ListaTemas"] = DATA_TEMAS_STRING;
    data["File"] = FILE;

    data["ListaCompromisosAgenciaVersion"] = DATA_COMPROMISO_AGENCIA;
    data["ListaCompromisosClienteVersion"] = DATA_COMPROMISO_CLIENTE;
    settings.data = jQuery.param(data);
    console.log(settings.data);
    return true;

}

//-- ONSUCCESS --//

function OnSuccessCrearVersionInformeEntrevista(resultado) {
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
        
    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    $("#atras_listar_informe_entrevista").trigger("click");
}


function SubirArchivo(e) {
    RequestHttp._UploadFile(e, URL_SUBIR_ARCHIVOS_TEMP_INFOME_ENTREVISTA, function (result) {
        if (result != null) {
            FILE = {
                'Name': result.data.Name,
                'Path': result.data.Path,
                'OriginalName': result.data.OriginalName
            };
        }
    });
}

function OnchangeDepartamentoVersion(e, url) {
    var deptoId = $(e).val();
    if (deptoId > 0) {
        var parameters = {
            id: deptoId
        };
        var $elementList = $("#CiudadId");
        Utils._GetDataDropDownList($elementList, url, parameters);
    }
}