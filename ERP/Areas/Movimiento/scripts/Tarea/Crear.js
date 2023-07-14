var TAREA_CREAR = {
    $TABLA_RESPONSABLES: null,
    RESPONSABLES: [],

    $TABLA_ASIGNADOS: null,
    ASIGNADOS: [],

    $TABLA_PRESUPUESTOS: null,

    ARCHIVOS: [],
    $TABLA_ARCHIVOS: null,

    OnLoad: function () {
        TAREA_CREAR.$TABLA_RESPONSABLES = null;
        TAREA_CREAR.RESPONSABLES = [];

        TAREA_CREAR.$TABLA_ASIGNADOS = null;
        TAREA_CREAR.ASIGNADOS = [];

        TAREA_CREAR.$TABLA_PRESUPUESTOS = null;

        TAREA_CREAR.ARCHIVOS = [];
        TAREA_CREAR.$TABLA_ARCHIVOS = null;

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

        if (TAREA_CREAR.$TABLA_RESPONSABLES != null)
            TAREA_CREAR.$TABLA_RESPONSABLES.destroy();

        if (TAREA_CREAR.$TABLA_ASIGNADOS != null)
            TAREA_CREAR.$TABLA_ASIGNADOS.destroy();

        var $listaTiposTarea = $("#TipoId");

        if (!Validations._IsNull(id)) {
            TAREA_CREAR.CrearTablaResponsables(id);
            TAREA_CREAR.CrearTablaAsignados(id);

            var parametros = {
                departamentoTraficoId: id
            };
            Utils._GetDropDownList($listaTiposTarea, URL_TIPO_TAREA_TRAFICO_LISTAR_OPCIONES_POR_DEPARTAMENTO_TRAFICO, parametros);
        } else {
            Utils._ClearDropDownList($listaTiposTarea);
        }
    },
    OnChangeTipoId: function (e) {

    },
    //Responsables
    CrearTablaResponsables: function (departamentoTraficoId) {
        TAREA_CREAR.$TABLA_RESPONSABLES = $("#tabla_responsables").DataTable({
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
                        var checked = TAREA_CREAR.ExisteResponsable(data) ? 'checked="checked"' : '';
                        return '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox-seleccionar-responsable' + data + '" ' + checked + ' onchange="TAREA_CREAR.SeleccionarResponsable(this)" value="' + data + '">' +
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
            if (!TAREA_CREAR.ExisteResponsable(id))
                TAREA_CREAR.RESPONSABLES.push(id);
        } else {
            var tamanoData = TAREA_CREAR.RESPONSABLES.length;
            for (var i = 0; i < tamanoData; i++) {
                if (TAREA_CREAR.RESPONSABLES[i] == id) {
                    TAREA_CREAR.RESPONSABLES.splice(i, 1);
                    break;
                }
            }
        }
    },
    ExisteResponsable: function (id) {
        var existe = false;
        var tamanoData = TAREA_CREAR.RESPONSABLES.length;
        for (var i = 0; i < tamanoData; i++) {
            if (TAREA_CREAR.RESPONSABLES[i] == id) {
                existe = true;
                break;
            }
        }
        return existe;
    },
    //Asignados
    CrearTablaAsignados: function (departamentoTraficoId) {
        TAREA_CREAR.$TABLA_ASIGNADOS = $("#tabla_asignados").DataTable({
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
                        var checked = TAREA_CREAR.ExisteAsignado(data) ? 'checked="checked"' : '';
                        return '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox-seleccionar-asignado' + data + '" ' + checked + ' onchange="TAREA_CREAR.SeleccionarAsignado(this)" value="' + data + '" />' +
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
            if (!TAREA_CREAR.ExisteAsignado(id))
                TAREA_CREAR.ASIGNADOS.push(id);
        } else {
            var tamanoData = TAREA_CREAR.ASIGNADOS.length;
            for (var i = 0; i < tamanoData; i++) {
                if (TAREA_CREAR.ASIGNADOS[i] == id) {
                    TAREA_CREAR.ASIGNADOS.splice(i, 1);
                    break;
                }
            }
        }
    },
    ExisteAsignado: function (id) {
        var existe = false;
        var tamanoData = TAREA_CREAR.ASIGNADOS.length;
        for (var i = 0; i < tamanoData; i++) {
            if (TAREA_CREAR.ASIGNADOS[i] == id) {
                existe = true;
                break;
            }
        }
        return existe;
    },
    //Archivos
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
                    TAREA_CREAR.ARCHIVOS.push(FILE);
                    TAREA_CREAR.CrearTablaArchivos();
                }
            }
            });
       // }
    },
    EliminarArchivo: function (id) {
        var cantidad = TAREA_CREAR.ARCHIVOS.length;
        for (var i = 0; cantidad > i; i++) {
            if (TAREA_CREAR.ARCHIVOS[i]["Id"] == id) {
                TAREA_CREAR.ARCHIVOS.splice(i, 1);
                break;
            }
        }

        cantidad = TAREA_CREAR.ARCHIVOS.length;
        for (var i = 0; cantidad > i; i++) {
            TAREA_CREAR.ARCHIVOS[i].Id = (i + 1);
        }

        if (TAREA_CREAR.$TABLA_ARCHIVOS != null)
            TAREA_CREAR.$TABLA_ARCHIVOS.fnDestroy();
        TAREA_CREAR.CrearTablaArchivos();
    },
    CrearTablaArchivos: function () {
        TAREA_CREAR.$TABLA_ARCHIVOS = $("#tabla_archivos").dataTable({
            "destroy": true,
            "serverSide": false,
            "data": TAREA_CREAR.ARCHIVOS,
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
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="TAREA_CREAR.EliminarArchivo(' + data + ')" >';
                    }
                }
            ]
        });
    },
    //OnBegin - OnComplete
    OnBegin: function (jqXHR, settings) {
        var cantidadResponsables = TAREA_CREAR.RESPONSABLES.length;
        if (cantidadResponsables <= 0) {
            Utils._BuilderMessage("warning", "Debe adicionar mínimo un Responsable.");
            return false;
        }

        var cantidadAsignado = TAREA_CREAR.ASIGNADOS.length;
        if (cantidadAsignado <= 0) {
            Utils._BuilderMessage("warning", "Debe adicionar mínimo un Asignado.");
            return false;
        }

        var data = $(this).serializeObject();
        data["ListaResponsables"] = TAREA_CREAR.RESPONSABLES;
        data["ListaAsignados"] = TAREA_CREAR.ASIGNADOS;
        data["ListaArchivos"] = TAREA_CREAR.ARCHIVOS;

        settings.data = jQuery.param(data);
        return true;
    },
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                TAREA_LISTAR.RecargarTablaPage();
                TAREA_PENDIENTE_LISTAR.RecargarTablaPage();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    },
}