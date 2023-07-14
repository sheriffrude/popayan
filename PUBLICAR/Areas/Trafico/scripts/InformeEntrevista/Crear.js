var INFORME_REUNION_CREAR = {
    DATA_USUARIOS: [],
    $TABLA_USUARIO: null,

    DATA_COPIADOS: [],
    $TABLA_COPIADOS: null,

    DATA_CLIENTES: [],
    $TABLA_CLIENTES: null,

    DATA_TEMAS: [],
    $TABLA_TEMAS: null,

    DATA_COMPROMISO_AGENCIA: [],
    $TABLA_COMPROMISO_AGENCIA: null,

    DATA_COMPROMISO_CLIENTE: [],
    $TABLA_COMPROMISO_CLIENTE: null,

    $TABLA_COMPROMISO_CLIENTE_VISUALIZAR: null,
    $TABLA_COMPROMISO_AGENCIA_VISUALIZAR: null,

    DATA_ASISTENTES_PREDETERMINDADOS: [],

    FILE: null,

    OnLoad: function () {
        ///Limpiar variables
        INFORME_REUNION_CREAR.DATA_USUARIOS = [];
        INFORME_REUNION_CREAR.DATA_COPIADOS = [];
       
        INFORME_REUNION_CREAR.DATA_COMPROMISO_AGENCIA = [];
        INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE = [];
        INFORME_REUNION_CREAR.DATA_CLIENTES = [];

        //Iniacializa plugins Javascripts
        //tinymce.execCommand('mceRemoveControl', true, '#Descripcion');
        tinymce.remove('#Descripcion');
        tinymce.init({
            selector: '#Descripcion'
        });
        $("#Fecha").datepicker().datepicker("setDate", new Date());
        $("#FechaCompromiso").datepicker().datepicker("setDate", new Date());
        $("#FechaCompromisoCliente").datepicker().datepicker("setDate", new Date());
        $('#HoraInicio').datetimepicker({
            format: 'LT'
        });
        $('#HoraFin').datetimepicker({
            format: 'LT'
        });
        $('[data-toggle="tooltip"]').tooltip();

        //Autocomplementar asistentes agencia
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
                                Utils._BuilderMessage("danger", "No se encontraron registros con este criterio de busqueda!");
                            }
                        } else {
                            Utils._BuilderMessage("danger", result.message);
                        }
                    },
                    error: function (request, status, error) {
                        Utils._BuilderMessage("danger", error);
                    }
                });

            },
            minLength: 3,
            select: function (event, ui) {
                INFORME_REUNION_CREAR.SeleccionarAsistenteAgencia(ui.item.id, ui.item.label);
                $(this).val("");
                return false;
            },
            search: function (event, ui) {
            }
        });

        //Autocompletar asistentes agencia - copiar
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
                                Utils._BuilderMessage("danger", "No se encontraron registros con este criterio de busqueda!!");
                            }
                        } else {
                            Utils._BuilderMessage("danger", result.message);
                        }
                    },
                    error: function (request, status, error) {
                        Utils._BuilderMessage("danger", error);
                    }
                });

            },
            minLength: 3,
            select: function (event, ui) {
                INFORME_REUNION_CREAR.SeleccionarAsistenteAgenciaCopiarA(ui.item.id, ui.item.label);
                $(this).val("");
                return false;
            },
            search: function (event, ui) {
            }
        });

        INFORME_REUNION_CREAR.CargarAsistentesAgenciaPreterminados();
    },
    /**
     * OnchangeDepartamento
     * @param {} e 
     * @returns {} 
     */
    OnchangeDepartamento: function (e) {
        var departamentoId = $(e).val();
        if (departamentoId > 0) {
            var parameters = {
                id: departamentoId
            };
            var $elementList = $("#CiudadId");
            Utils._GetDataDropDownList($elementList, URL_CAMBIO_DEPTO, parameters);
        }
    },
    /**
     * CargarAsistentesAgenciaPreterminados
     * @returns {} 
     */
    CargarAsistentesAgenciaPreterminados: function () {
        RequestHttp._Post(URL_CARGA_ASISTENTES_PREDETERMINADOS,
            {
                ordenTrabajoId: ORDEN_TRABAJO_LISTAR.ID_SELECIONADO
            }, null, function (response) {
                if (!Validations._IsNull(response)) {
                    if (response.state) {
                        INFORME_REUNION_CREAR.DATA_ASISTENTES_PREDETERMINDADOS = response.data;
                        if (!Validations._IsNull(INFORME_REUNION_CREAR.DATA_ASISTENTES_PREDETERMINDADOS) && INFORME_REUNION_CREAR.DATA_ASISTENTES_PREDETERMINDADOS.length > 0)
                            INFORME_REUNION_CREAR.ContruirTablaUsuariosPorDefecto();
                    } else {
                        Utils._BuilderMessage("danger", response.message);
                    }
                }
            })
    },
    /**
     * ContruirTablaUsuariosPorDefecto
     * @returns {} 
     */
    ContruirTablaUsuariosPorDefecto: function () {
        INFORME_REUNION_CREAR.$TABLA_USUARIO = $("#tabla-usuarios-por-defecto").dataTable({
            "destroy": true,
            "bPaginate": false,
            "info": false,
            "serverSide": false,
            "data": INFORME_REUNION_CREAR.DATA_ASISTENTES_PREDETERMINDADOS,
            "columns": [
                {
                    "data": "Nombre",
                    "orderable": false,
                }
            ]
        });

        $("#input-filtro-empleado").val("");
    },
    /**
     * SeleccionarAsistenteAgencia
     * @param {} id 
     * @param {} nombre 
     * @returns {} 
     */
    SeleccionarAsistenteAgencia: function (id, nombre) {
        var tamanoData = INFORME_REUNION_CREAR.DATA_USUARIOS.length;
        if (tamanoData == 0) {
            INFORME_REUNION_CREAR.DATA_USUARIOS.push({
                Nombre: nombre,
                Id: id
            })
        } else {
            for (var i = 0; tamanoData > i; i++) {
                if (INFORME_REUNION_CREAR.DATA_USUARIOS[i]["Id"] == id) {
                    Utils._BuilderMessage("warning", "El usuario ya ha sido seleccionado!");
                    break;
                }

            }
            INFORME_REUNION_CREAR.DATA_USUARIOS.push({
                Nombre: nombre,
                Id: id
            });
            if (INFORME_REUNION_CREAR.$TABLA_USUARIO != null)
                INFORME_REUNION_CREAR.$TABLA_USUARIO.fnDestroy();
        }

        INFORME_REUNION_CREAR.ContruirTablaUsuarios();
        return false;
    },
    /**
     * ContruirTablaUsuarios
     * @returns {} 
     */
    ContruirTablaUsuarios: function () {
        INFORME_REUNION_CREAR.$TABLA_USUARIO = $("#tabla-usuario").dataTable({
            "destroy": true,
            "bPaginate": false,
            "info": false,
            "serverSide": false,
            "data": INFORME_REUNION_CREAR.DATA_USUARIOS,
            "columns": [
                {
                    "data": "Nombre",
                    "orderable": false,
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "20%",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="INFORME_REUNION_CREAR.EliminarOpcion(' + data + ')" >';
                    }
                }
            ]
        });

        $("#input-filtro-empleado").val("");
    },
    /**
     * EliminarOpcion
     * @param {} id 
     * @returns {} 
     */
    EliminarOpcion: function (id) {
        var tamanoDataSetOpciones = INFORME_REUNION_CREAR.DATA_USUARIOS.length;
        for (var i = 0; tamanoDataSetOpciones > i; i++) {
            if (INFORME_REUNION_CREAR.DATA_USUARIOS[i]["Id"] == id) {
                INFORME_REUNION_CREAR.DATA_USUARIOS.splice(i, 1);
                break;
            }
        }
        if (INFORME_REUNION_CREAR.$TABLA_USUARIO != null) {
            INFORME_REUNION_CREAR.$TABLA_USUARIO.fnDestroy();
        }
        INFORME_REUNION_CREAR.ContruirTablaUsuarios();
    },
    /**
     * SeleccionarAsistenteAgenciaCopiarA
     * @param {} id 
     * @param {} nombre 
     * @returns {} 
     */
    SeleccionarAsistenteAgenciaCopiarA: function (id, nombre) {
        for (var i = 0; INFORME_REUNION_CREAR.DATA_USUARIOS.length > i; i++) {
            if (INFORME_REUNION_CREAR.DATA_USUARIOS[i]["Id"] == id) {
                Utils._BuilderMessage("warning", "El usuario ya ha sido seleccionado!");
                return false;
            }
        }

        var tamanoData = INFORME_REUNION_CREAR.DATA_COPIADOS.length;
        if (tamanoData == 0) {
            INFORME_REUNION_CREAR.DATA_COPIADOS.push({
                Nombre: nombre,
                Id: id
            });
        } else {
            for (var i = 0; tamanoData > i; i++) {
                if (INFORME_REUNION_CREAR.DATA_COPIADOS[i]["Id"] == id) {
                    Utils._BuilderMessage("warning", "El usuario ya ha sido seleccionado!");
                    break;
                }
            }

            INFORME_REUNION_CREAR.DATA_COPIADOS.push({
                Nombre: nombre,
                Id: id
            });

            if (INFORME_REUNION_CREAR.$TABLA_COPIADOS != null)
                INFORME_REUNION_CREAR.$TABLA_COPIADOS.fnDestroy();
        }

        INFORME_REUNION_CREAR.ContruirTablaCopiados();
        return false;
    },
    /**
     * ContruirTablaCopiados
     * @returns {} 
     */
    ContruirTablaCopiados: function () {
        INFORME_REUNION_CREAR.$TABLA_COPIADOS = $("#tabla-copiados").dataTable({
            "destroy": true,
            "bPaginate": false,
            "info": false,
            "serverSide": false,
            "data": INFORME_REUNION_CREAR.DATA_COPIADOS,
            "columns": [
                {
                    "data": "Nombre",
                    "orderable": false,
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "20%",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="INFORME_REUNION_CREAR.EliminarOpcionCopiados(' + data + ')" >';
                    }
                }
            ]
        });

        $("#input-filtro-copiar").val("");
    },
    /**
     * EliminarOpcionCopiados
     * @param {} id 
     * @returns {} 
     */
    EliminarOpcionCopiados: function (id) {
        var tamanoData = INFORME_REUNION_CREAR.DATA_COPIADOS.length;
        for (var i = 0; tamanoData > i; i++) {
            if (INFORME_REUNION_CREAR.DATA_COPIADOS[i]["Id"] == id) {
                INFORME_REUNION_CREAR.DATA_COPIADOS.splice(i, 1);
                break;
            }
        }
        if (INFORME_REUNION_CREAR.$TABLA_COPIADOS != null) {
            INFORME_REUNION_CREAR.$TABLA_COPIADOS.fnDestroy();
        }
        INFORME_REUNION_CREAR.ContruirTablaCopiados();
    },
    /**
     * AdicionarCliente
     * @returns {} 
     */
    AdicionarCliente: function () {
        $("#tabla-clientes_informe_entrevista").removeClass("hidden");
        var nombre = $("#Nombre").val();
        var email = $("#Correo").val();
        var copia = ($("#checkinforme_etrevista_copiar_a").is(':checked'));

        if (!Validations._Requerido(nombre)) {
            Utils._BuilderMessage("warning", "El campo Nombre no puede ser nulo.");
            return false;
        }
        if (!Validations._Requerido(email)) {

            Utils._BuilderMessage("warning", "El campo Correo no puede ser nulo.");
            return false;
        }
        if (!Validations._Email(email)) {
            Utils._BuilderMessage("warning", "El campo Correo no es valido.");
            return false;
        }

        var tamanoData = INFORME_REUNION_CREAR.DATA_CLIENTES.length;
        for (var i = 0; i < tamanoData; i++) {
            if (INFORME_REUNION_CREAR.DATA_CLIENTES[i]["Nombre"] == nombre) {
                Utils._BuilderMessage("warning", "Ya existe este nombre.");
                return false;
            }
        }
        var objectoCliente = {
            Nombre: nombre,
            Email: email,
            Copia: copia

        };
        INFORME_REUNION_CREAR.DATA_CLIENTES.push(objectoCliente);

        $("#Nombre").val("");
        $("#Correo").val("");
        $("#checkinforme_etrevista_copiar_a").prop('checked', false);

        INFORME_REUNION_CREAR.RecargarTablaClientes();
    },
    /**
     * RecargarTablaClientes
     * @returns {} 
     */
    RecargarTablaClientes: function () {
        var tamanoData = INFORME_REUNION_CREAR.DATA_CLIENTES.length;
        for (var i = 0; i < tamanoData; i++) {
            INFORME_REUNION_CREAR.DATA_CLIENTES[i]["Id"] = i;
        }
        if (INFORME_REUNION_CREAR.$TABLA_CLIENTES != null) {
            INFORME_REUNION_CREAR.$TABLA_CLIENTES.fnDestroy();
        }
        INFORME_REUNION_CREAR.ConstruirTablaClientes();
    },
    /**
     * ConstruirTablaClientes
     * @returns {} 
     */
    ConstruirTablaClientes: function () {
        INFORME_REUNION_CREAR.$TABLA_CLIENTES = $("#tabla-clientes_informe_entrevista").dataTable({
            "destroy": true,
            "serverSide": false,
            "data": INFORME_REUNION_CREAR.DATA_CLIENTES,
            "bPaginate": false,
            "columns": [
                {
                    "data": "Nombre",
                    "orderable": false,
                },
                {
                    "data": "Email",
                    "orderable": false,
                },
                {
                    "data": "Copia",
                    "orderable": false,
                    "searchable": false,
                    "width": "20%",
                    "render": function (data, type, full, meta) {
                        return (data == true) ? "Si" : "No";
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "20%",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="INFORME_REUNION_CREAR.EliminarCliente(' + data + ')" />';
                    }
                }
            ]
        });
    },
    /**
     * EliminarCliente
     * @param {} id 
     * @returns {} 
     */
    EliminarCliente: function (id) {
        INFORME_REUNION_CREAR.DATA_CLIENTES.splice(id, 1);
        INFORME_REUNION_CREAR.RecargarTablaClientes();
    },
    /**
     * AdicionarTema
     * @returns {} 
     */
    AdicionarTema: function () {
           
            $("#Compromiso_Agencia_Informe_Entrevista").removeClass('hidden');
            $("#Compromiso_Cliente_Informe_Entrevista").removeClass('hidden');
        
    },
    
    /**
     * AdicionarCompromisoAgencia
     * @returns {} 
     */
    AdicionarCompromisoAgencia: function () {
        var usuarioId = $("#UsuarioCompromisoAgenciaId").val();
        var nombre = $('#UsuarioCompromisoAgenciaId option:selected').text();
        var fecha = $("#FechaCompromiso").val();
        var descripcion = $("#DescripcionCompromiso").val();

        if (!Validations._Requerido(usuarioId) || !Validations._Requerido(nombre)) {
            Utils._BuilderMessage("danger", "El campo Persona es obligatoria.");
            return false;
        }
        if (!Validations._Requerido(fecha)) {
            Utils._BuilderMessage("danger", "El campo fecha es obligatoria.");
            return false;
        }
        if (!Validations._Requerido(descripcion)) {
            Utils._BuilderMessage("danger", "El campo compromiso es obligatorio.");
            return false;
        }

        var objectCompromisoAgencia = {
            UsuarioId: usuarioId,
            Nombre: nombre,
            Fecha: fecha,
            Descripcion: descripcion
        };

        INFORME_REUNION_CREAR.DATA_COMPROMISO_AGENCIA.push(objectCompromisoAgencia);
        INFORME_REUNION_CREAR.RecargarTablaCompromisoAgencia();

        $("#FechaCompromiso").val("");
        $("#DescripcionCompromiso").val("");
    },
    /**
     * RecargarTablaCompromisoAgencia
     * @returns {} 
     */
    RecargarTablaCompromisoAgencia: function () {
        var tamanoDataTelefonos = INFORME_REUNION_CREAR.DATA_COMPROMISO_AGENCIA.length;
        for (var i = 0; i < tamanoDataTelefonos; i++) {
            INFORME_REUNION_CREAR.DATA_COMPROMISO_AGENCIA[i]["Id"] = i;
        }
        if (INFORME_REUNION_CREAR.$TABLA_COMPROMISO_AGENCIA != null) {
            INFORME_REUNION_CREAR.$TABLA_COMPROMISO_AGENCIA.fnDestroy();
        }
        INFORME_REUNION_CREAR.ConstruirTablaCompromisoAgencia();
    },
    /**
     * ConstruirTablaCompromisoAgencia
     * @returns {} 
     */
    ConstruirTablaCompromisoAgencia: function () {
        $("#tabla-compromiso-agencia-entrevista").removeClass('hidden');
        INFORME_REUNION_CREAR.$TABLA_COMPROMISO_AGENCIA = $("#tabla-compromiso-agencia-entrevista").dataTable({
            "destroy": true,
            "serverSide": false,
            "bPaginate": false,
            "info": false,
            "data": INFORME_REUNION_CREAR.DATA_COMPROMISO_AGENCIA,
            "columns": [
                {
                    "data": "Nombre",
                    "orderable": false,
                }, {
                    "data": "Fecha",
                    "orderable": false,
                }, {
                    "data": "Descripcion",
                    "orderable": false,
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "20%",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="INFORME_REUNION_CREAR.EliminarCompromisoAgencia(' + data + ')" />';
                    }
                }
            ]
        });
    },
    /**
     * EliminarCompromisoAgencia
     * @param {} id 
     * @returns {} 
     */
    EliminarCompromisoAgencia: function (id) {
        INFORME_REUNION_CREAR.DATA_COMPROMISO_AGENCIA.splice(id, 1);
        INFORME_REUNION_CREAR.RecargarTablaCompromisoAgencia();
    },
    /**
     * AdicionarCompromisoCliente
     * @returns {} 
     */
    AdicionarCompromisoCliente: function () {
        $('#tabla-compromiso-cliente-entrevista').removeClass("hidden");
        var nombre = $('#Persona_Compromiso_Cliente').val();
        var fecha = $("#FechaCompromisoCliente").val();
        var descripcion = $("#DescripcionCompromisoCliente").val();

        if (!Validations._Requerido(nombre)) {
            Utils._BuilderMessage("danger", "El campo Persona es obligatoria.");
            return false;
        }
        if (!Validations._Requerido(fecha)) {
            Utils._BuilderMessage("danger", "El campo Fecha es obligatoria.");
            return false;
        }
        if (!Validations._Requerido(descripcion)) {
            Utils._BuilderMessage("danger", "El campo Compromiso es obligatorio.");
            return false;
        }

        var tamanoData = INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE.length;
        for (var i = 0; i < tamanoData; i++) {
            if (INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE[i]["Descripcion"] == descripcion) {
                Utils._BuilderMessage("danger", "Ya existe este Compromiso.");
                return false;
            }
        }

        var objectCompromisoCliente = {
            Nombre: nombre,
            Fecha: fecha,
            Descripcion: descripcion
        };
        INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE.push(objectCompromisoCliente);
        INFORME_REUNION_CREAR.RecargarTablaCompromisoCliente();

        $("#Persona_Compromiso_Cliente").val("");
        $("#FechaCompromisoCliente").val("");
        $("#DescripcionCompromisoCliente").val("");
    },
    /**
     * RecargarTablaCompromisoCliente
     * @returns {} 
     */
    RecargarTablaCompromisoCliente: function () {

        var tamanoData = INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE.length;
        for (var i = 0; i < tamanoData; i++) {
            INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE[i]["Id"] = i;
        }
        if (INFORME_REUNION_CREAR.$TABLA_COMPROMISO_CLIENTE != null) {
            INFORME_REUNION_CREAR.$TABLA_COMPROMISO_CLIENTE.fnDestroy();
        }
        INFORME_REUNION_CREAR.ConstruirTablaCompromisoCliente();
    },
    /**
     * ConstruirTablaCompromisoCliente
     * @returns {} 
     */
    ConstruirTablaCompromisoCliente: function () {
        INFORME_REUNION_CREAR.$TABLA_COMPROMISO_CLIENTE = $("#tabla-compromiso-cliente-entrevista").dataTable({
            "destroy": true,
            "serverSide": false,
            "bPaginate": false,
            "info": false,
            "data": INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE,
            "columns": [
                {
                    "data": "Nombre",
                    "orderable": false,
                }, {
                    "data": "Fecha",
                    "orderable": false,
                }, {
                    "data": "Descripcion",
                    "orderable": false,
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "20%",
                    "render": function (data, type, full, meta) {
                        return html = '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="INFORME_REUNION_CREAR.EliminarCompromisoCliente(' + data + ')" />';
                    }
                }
            ]
        });
    },
    /**
     * EliminarCompromisoCliente
     * @param {} id 
     * @returns {} 
     */
    EliminarCompromisoCliente: function (id) {
        INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE.splice(id, 1);
        INFORME_REUNION_CREAR.RecargarTablaCompromisoCliente();
    },
    /**
     * SubirArchivo
     * @param {} e 
     * @returns {} 
     */
    SubirArchivo: function (e) {
        RequestHttp._UploadFile(e, URL_SUBIR_ARCHIVOS_TEMP_INFOME_ENTREVISTA, function (result) {
            if (result != null) {
                INFORME_REUNION_CREAR.FILE = {
                    'Name': result.Name,
                    'Path': result.Path,
                    'OriginalName': result.OriginalName
                };
            }
        });
    },
    /**
     * OnBegin
     * @param {} jqXHR 
     * @param {} settings 
     * @returns {} 
     */
    OnBegin: function (jqXHR, settings) {
        //var DATA_TEMAS_STRING = [];

        //var tamanoData = INFORME_REUNION_CREAR.DATA_TEMAS.length;
        //for (var i = 0; i < tamanoData; i++) {
        //    DATA_TEMAS_STRING.push(INFORME_REUNION_CREAR.DATA_TEMAS[i]['Tema']);
        //}
        var descripcion = tinyMCE.get('Descripcion').getContent({ format: 'html' });
        if (Validations._IsNull(descripcion)) {
            Utils._BuilderMessage("warning", "El campo Descripción es obligatorio.");
            return false;
        }


        if (INFORME_REUNION_CREAR.DATA_USUARIOS.length <= 0) {
            Utils._BuilderMessage("warning", "Debe ingresar al menos un Asistente de Agencia.");
            return false;
        }

        if (INFORME_REUNION_CREAR.DATA_CLIENTES.length <= 0) {
            Utils._BuilderMessage("warning", "Debe ingresar al menos un Asistente de Cliente.");
            return false;
        }

        var data = $(this).serializeObject();

        data["Descripcion"] = descripcion;

      
       

        data["ListaAsistentesAgencia"] = INFORME_REUNION_CREAR.DATA_USUARIOS;
        data["ListaAsistentesAgenciaCopia"] = INFORME_REUNION_CREAR.DATA_COPIADOS;
        data["ListaAsistentesAgenciaPorDefecto"] = INFORME_REUNION_CREAR.DATA_ASISTENTES_PREDETERMINDADOS;

        data["ListaClientes"] = INFORME_REUNION_CREAR.DATA_CLIENTES;

        data["ListaCompromisosAgencia"] = INFORME_REUNION_CREAR.DATA_COMPROMISO_AGENCIA;
        data["ListaCompromisosCliente"] = INFORME_REUNION_CREAR.DATA_COMPROMISO_CLIENTE;

        data["File"] = FILE;

        settings.data = jQuery.param(data);
        return true;
    },
    /**
     * OnComplete
     * @param {} response 
     * @returns {} 
     */
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            if (resultado.state) {
                tipoMensaje = "success"
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}