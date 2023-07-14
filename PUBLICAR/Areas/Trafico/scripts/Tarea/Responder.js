var TAREA_RESPONDER = {
    $TABLA_RESPONSABLES: null,
    RESPONSABLES: [],

    $TABLA_ASIGNADOS: null,
    ASIGNADOS: [],

    ARCHIVOS: [],
    $TABLA_ARCHIVOS: null,

    PIEZAS_ARTE: [],
    $TABLA_PIEZAS_ARTE: null,

    $VALIDA_PIEZA: false,

    OnLoad: function () {
        TAREA_RESPONDER.$TABLA_RESPONSABLES = null;
        TAREA_RESPONDER.RESPONSABLES = [];

        TAREA_RESPONDER.$TABLA_ASIGNADOS = null;
        TAREA_RESPONDER.ASIGNADOS = [];

        TAREA_RESPONDER.ARCHIVOS = [];
        TAREA_RESPONDER.$TABLA_ARCHIVOS = null;

        TAREA_RESPONDER.PIEZAS_ARTE = [];
        TAREA_RESPONDER.$TABLA_PIEZAS_ARTE = null;

        $("#FechaEntrega").datetimepicker({
            viewMode: 'days',
            format: 'DD/MM/YYYY',
            minDate: moment()
        });
        $('#HoraEntrega').datetimepicker({
            format: 'LT'
        });
        $("#AprobarPresupuestoCliente").bootstrapToggle({
            on: '',
            off: ''
        });
    },
    OnChangeAprobarPresupuesto: function (e) {
        if ($(e).is(":checked"))
            $("#container_presupuestos").show();
        else
            $("#container_presupuestos").hide();
    },
    OnChangeDepartamentoTraficoId: function (e) {
        var id = $(e).val();

        if (TAREA_RESPONDER.$TABLA_RESPONSABLES != null)
            TAREA_RESPONDER.$TABLA_RESPONSABLES.destroy();

        if (TAREA_RESPONDER.$TABLA_ASIGNADOS != null)
            TAREA_RESPONDER.$TABLA_ASIGNADOS.destroy();

        var $listaTiposTarea = $("#TipoId");

        if (!Validations._IsNull(id)) {
            TAREA_RESPONDER.CrearTablaResponsables(id);
            TAREA_RESPONDER.CrearTablaAsignados(id);
            var parametros = {
                departamentoTraficoId: id
            };
            Utils._GetDropDownList($listaTiposTarea, URL_TIPO_TAREA_TRAFICO_LISTAR_OPCIONES_POR_DEPARTAMENTO_TRAFICO, parametros);
        } else {
            Utils._ClearDropDownList($listaTiposTarea);
        }
    },
    OnChangeTipoId: function (obj, e) {
        texto_tipo_tarea = obj.options[obj.selectedIndex].text;
        if (texto_tipo_tarea.match(/FINALIZ.*/)) {
            TAREA_RESPONDER.$VALIDA_PIEZA = true;
            
        } 
        //console.log(JSON.stringify(document.getElementById("TipoId").childNodes));
    },
    //Responsables
    CrearTablaResponsables: function (departamentoTraficoId) {
        TAREA_RESPONDER.$TABLA_RESPONSABLES = $("#tabla_responsables").DataTable({
            "info": false,
            "bpaginate": false,
            "serverSide": true,
            "ajax": {
                "url": URL_TAREA_RESPONSABLE_LISTAR,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = null;
                    d.departamentoTraficoId = departamentoTraficoId;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },

            }, "columns": [
                {
                    "data": "UsuarioId",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var checked = TAREA_RESPONDER.ExisteResponsable(data) ? 'checked="checked"' : '';
                        return '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox-seleccionar-responsable' + data + '" ' + checked + ' onchange="TAREA_RESPONDER.SeleccionarResponsable(this)" value="' + data + '">' +
                            '<label for="checkbox-seleccionar-responsable' + data + '"></label>' +
                            '</div>';
                    }
                },
                { "data": "Nombre" }
            ],
            "order": [[1, "asc"]]
        });
    },
    SeleccionarResponsable: function (e) {
        var id = $(e).val();
        if ($(e).is(":checked")) {
            if (!TAREA_RESPONDER.ExisteResponsable(id))
                TAREA_RESPONDER.RESPONSABLES.push(id);
        } else {
            var tamanoData = TAREA_RESPONDER.RESPONSABLES.length;
            for (var i = 0; i < tamanoData; i++) {
                if (TAREA_RESPONDER.RESPONSABLES[i] == id) {
                    TAREA_RESPONDER.RESPONSABLES.splice(i, 1);
                    break;
                }
            }
        }
    },
    ExisteResponsable: function (id) {
        var existe = false;
        var tamanoData = TAREA_RESPONDER.RESPONSABLES.length;
        for (var i = 0; i < tamanoData; i++) {
            if (TAREA_RESPONDER.RESPONSABLES[i] == id) {
                existe = true;
                break;
            }
        }
        return existe;
    },
    //Asignados
    CrearTablaAsignados: function (departamentoTraficoId) {
        TAREA_RESPONDER.$TABLA_ASIGNADOS = $("#tabla_asignados").DataTable({
            "info": false,
            "bpaginate": false,
            "serverSide": true,
            "ajax": {
                "url": URL_TAREA_ASIGNADO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = "";
                    d.departamentoTraficoId = departamentoTraficoId;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },

            }, "columns": [
                {
                    "data": "UsuarioId",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var checked = TAREA_RESPONDER.ExisteAsignado(data) ? 'checked="checked"' : '';
                        return '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox-seleccionar-asignado' + data + '" ' + checked + ' onchange="TAREA_RESPONDER.SeleccionarAsignado(this)" value="' + data + '" />' +
                            '<label for="checkbox-seleccionar-asignado' + data + '"></label>' +
                            '</div>';
                    }
                },
                { "data": "Nombre" }
            ],
            "order": [[1, "asc"]]
        });
    },
    SeleccionarAsignado: function (e) {
        var id = $(e).val();
        if ($(e).is(":checked")) {
            if (!TAREA_RESPONDER.ExisteAsignado(id))
                TAREA_RESPONDER.ASIGNADOS.push(id);
        } else {
            var tamanoData = TAREA_RESPONDER.ASIGNADOS.length;
            for (var i = 0; i < tamanoData; i++) {
                if (TAREA_RESPONDER.ASIGNADOS[i] == id) {
                    TAREA_RESPONDER.ASIGNADOS.splice(i, 1);
                    break;
                }
            }
        }
    },
    ExisteAsignado: function (id) {
        var existe = false;
        var tamanoData = TAREA_RESPONDER.ASIGNADOS.length;
        for (var i = 0; i < tamanoData; i++) {
            if (TAREA_RESPONDER.ASIGNADOS[i] == id) {
                existe = true;
                break;
            }
        }
        return existe;
    },

    UploadFile: function (e) {

        console.log(e);


        // for (i = 0; i< e.files.length; i++) {

        //     file = e.files[i];
        var url = "/Trafico/Tarea/UploadMultiFilesCrear";
        RequestHttp._UploadFiles(e, url, function (result) {

            if (result != null) {
                for (i = 0; i < result.length; i++) {
                    var resulF = result[i].data;
                    console.log(resulF);
                    FILE = {
                        Id: (TAREA_CREAR.ARCHIVOS.length + 1),
                        Name: resulF.Name,
                        Path: resulF.Path,
                        OriginalName: resulF.OriginalName,
                        Url: resulF.Url
                    };
                    TAREA_RESPONDER.ARCHIVOS.push(FILE);
                    TAREA_RESPONDER.CrearTablaArchivos();
                }
            }
        });
        // }
    },
    
    
    EliminarArchivo: function (id) {
        var cantidad = TAREA_RESPONDER.ARCHIVOS.length;
        for (var i = 0; cantidad > i; i++) {
            if (TAREA_RESPONDER.ARCHIVOS[i]["Id"] == id) {
                TAREA_RESPONDER.ARCHIVOS.splice(i, 1);
                break;
            }
        }

        cantidad = TAREA_RESPONDER.ARCHIVOS.length;
        for (var i = 0; cantidad > i; i++) {
            TAREA_RESPONDER.ARCHIVOS[i].Id = (i + 1);
        }

        if (TAREA_RESPONDER.$TABLA_ARCHIVOS != null)
            TAREA_RESPONDER.$TABLA_ARCHIVOS.fnDestroy();
        TAREA_RESPONDER.CrearTablaArchivos();
    },
    CrearTablaArchivos: function () {
        TAREA_RESPONDER.$TABLA_ARCHIVOS = $("#tabla_archivos").dataTable({
            "destroy": true,
            "serverSide": false,
            "data": TAREA_RESPONDER.ARCHIVOS,
            "columns": [
                {
                    "data": "OriginalName",
                    "render": function (data, type, full, meta) {
                        return '<a href="' + full.Url + '" target="_blank" >' + data + '</a>';
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="TAREA_RESPONDER.EliminarArchivo(' + data + ')" >';
                    }
                }
            ]
        });
    },
    //Pieza Arte
    AdicionarPiezaArte: function () {
        var piezaArteId = $("#PiezaArteId").val();
        if (Validations._IsNull(piezaArteId)) {
            Utils._BuilderMessage("warning", "Debe seleccionar una Pieza de arte.");
            return false;
        }
        var cantidadPiezaArte = $("#CantidadPiezaArte").val();
        if (cantidadPiezaArte <= 0) {
            Utils._BuilderMessage("warning", "La Cantidad de la Pieza de arte debe ser mayor a cero.");
            return false;
        }
        var piezaArteTexto = $("#PiezaArteId option[value=" + piezaArteId + "]").text();

        var piezaArte = {
            Id: (TAREA_RESPONDER.PIEZAS_ARTE.length + 1),
            Nombre: piezaArteTexto,
            PiezaArteId: piezaArteId,
            Cantidad: parseInt(cantidadPiezaArte)
        };
        TAREA_RESPONDER.PIEZAS_ARTE.push(piezaArte);
        TAREA_RESPONDER.CrearTablaPiezasArte();
    },
    EliminarPiezaArte: function (id) {
        var cantidad = TAREA_RESPONDER.PIEZAS_ARTE.length;
        for (var i = 0; cantidad > i; i++) {
            if (TAREA_RESPONDER.PIEZAS_ARTE[i]["Id"] == id) {
                TAREA_RESPONDER.PIEZAS_ARTE.splice(i, 1);
                break;
            }
        }

        cantidad = TAREA_RESPONDER.PIEZAS_ARTE.length;
        for (var i = 0; cantidad > i; i++) {
            TAREA_RESPONDER.PIEZAS_ARTE[i].Id = (i + 1);
        }

        if (TAREA_RESPONDER.$TABLA_PIEZAS_ARTE != null)
            TAREA_RESPONDER.$TABLA_PIEZAS_ARTE.fnDestroy();
        TAREA_RESPONDER.CrearTablaPiezasArte();
    },
    CrearTablaPiezasArte: function () {
        TAREA_RESPONDER.$TABLA_PIEZAS_ARTE = $("#tabla_piezas_finales").dataTable({
            "destroy": true,
            "serverSide": false,
            "data": TAREA_RESPONDER.PIEZAS_ARTE,
            "columns": [
                { "data": "Nombre" },
                { "data": "Cantidad" },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="TAREA_RESPONDER.EliminarPiezaArte(' + data + ')" >';
                    }
                }
            ]
        });
    },
    //OnBegin - OnComplete
    OnBegin: function (jqXHR, settings) {
        var cantidadResponsables = TAREA_RESPONDER.RESPONSABLES.length;
        if (cantidadResponsables <= 0) {
            Utils._BuilderMessage("warning", "Debe adicionar mínimo un Responsable.");
            return false;
        }

        var cantidadAsignado = TAREA_RESPONDER.ASIGNADOS.length;
        if (cantidadAsignado <= 0) {
            Utils._BuilderMessage("warning", "Debe adicionar mínimo un Asignado.");
            return false;
        }

        if (TAREA_RESPONDER.$VALIDA_PIEZA === true && TAREA_RESPONDER.PIEZAS_ARTE.length === 0) {
            Utils._BuilderMessage("warning", "Debe adicionar al menos una Pieza de Arte ");
            return false;
        }



        var data = $(this).serializeObject();
        data["ListaResponsables"] = TAREA_RESPONDER.RESPONSABLES;
        data["ListaAsignados"] = TAREA_RESPONDER.ASIGNADOS;
        data["ListaArchivos"] = TAREA_RESPONDER.ARCHIVOS;
        data["ListaPiezasArte"] = TAREA_RESPONDER.PIEZAS_ARTE;



        settings.data = jQuery.param(data);
        return true;
    },
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success";
                TAREA_LISTAR.RecargarTablaPage();
                TAREA_PENDIENTE_LISTAR.RecargarTablaPage();
                TAREA_CONTESTADA_LISTAR.RecargarTablaPage();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    },
}