
var TAREA_EDITAR_FECHA_HORA_ENTREGA = {
    $TABLA_RESPONSABLES: null,
    RESPONSABLES: [],

    $TABLA_ASIGNADOS: null,
    ASIGNADOS: [],
    OnLoad: function () {

        TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_RESPONSABLES = null;
        TAREA_EDITAR_FECHA_HORA_ENTREGA.RESPONSABLES = [];

        TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_ASIGNADOS = null;
        TAREA_EDITAR_FECHA_HORA_ENTREGA.ASIGNADOS = [];

        $("#FechaEntregaNueva").datepicker({ yearRange: "-5:+5" });

        $("#HoraEntregaNueva").datetimepicker({
            format: 'LT'
        });
    },



    OnChangeDepartamentoTraficoId: function (e) {
        var id = $(e).val();

        if (TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_RESPONSABLES != null)
            TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_RESPONSABLES.destroy();

        if (TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_ASIGNADOS != null)
            TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_ASIGNADOS.destroy();

        var $listaTiposTarea = $("#TipoId");

        if (!Validations._IsNull(id)) {
            TAREA_EDITAR_FECHA_HORA_ENTREGA.CrearTablaResponsables(id);
            TAREA_EDITAR_FECHA_HORA_ENTREGA.CrearTablaAsignados(id);

            var parametros = {
                departamentoTraficoId: id
            };
            Utils._GetDropDownList($listaTiposTarea, URL_TIPO_TAREA_TRAFICO_LISTAR_OPCIONES_POR_DEPARTAMENTO_TRAFICO, parametros);
        } else {
            Utils._ClearDropDownList($listaTiposTarea);
        }
    },


    //crear tabla asignados

    CrearTablaAsignados: function (tareaId) {
        TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_ASIGNADOS = $("#tabla_asignados").DataTable({
            "info": false,
            "bpaginate": false,
            "serverSide": true,
            "ajax": {
                "url": URL_TAREA_ASIGNADO_TAREA_LISTAR,
                "type": "POST",
                "data": function (d) {
                    //d.search['value'] = "";
                    d.tareaId = tareaId;
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
                        var checked = TAREA_EDITAR_FECHA_HORA_ENTREGA.ExisteAsignado(data) ? 'checked="checked"' : '';
                        return '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox-seleccionar-asignado' + data + '" ' + checked + ' onchange="TAREA_EDITAR_FECHA_HORA_ENTREGA.SeleccionarAsignado(this)" value="' + data + '" />' +
                            '<label for="checkbox-seleccionar-asignado' + data + '"></label>' +
                            '</div>';
                    }
                },
                { "data": "Nombre" }
            ],
            "order": [[1, "asc"]]
        });
    },





    //Responsables
    CrearTablaResponsables: function (departamentoTraficoId) {
        TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_RESPONSABLES = $("#tabla_responsables").DataTable({
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
                        var checked = TAREA_EDITAR_FECHA_HORA_ENTREGA.ExisteResponsable(data) ? 'checked="checked"' : '';
                        return '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox-seleccionar-responsable' + data + '" ' + checked + ' onchange="TAREA_EDITAR_FECHA_HORA_ENTREGA.SeleccionarResponsable(this)" value="' + data + '">' +
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
            if (!TAREA_EDITAR_FECHA_HORA_ENTREGA.ExisteResponsable(id))
                TAREA_EDITAR_FECHA_HORA_ENTREGA.RESPONSABLES.push(id);
        } else {
            var tamanoData = TAREA_EDITAR_FECHA_HORA_ENTREGA.RESPONSABLES.length;
            for (var i = 0; i < tamanoData; i++) {
                if (TAREA_EDITAR_FECHA_HORA_ENTREGA.RESPONSABLES[i] == id) {
                    TAREA_EDITAR_FECHA_HORA_ENTREGA.RESPONSABLES.splice(i, 1);
                    break;
                }
            }
        }
    },
    ExisteResponsable: function (id) {
        var existe = false;
        var tamanoData = TAREA_EDITAR_FECHA_HORA_ENTREGA.RESPONSABLES.length;
        for (var i = 0; i < tamanoData; i++) {
            if (TAREA_EDITAR_FECHA_HORA_ENTREGA.RESPONSABLES[i] == id) {
                existe = true;
                break;
            }
        }
        return existe;
    },
    //Asignados
    CrearTablaAsignados: function (departamentoTraficoId) {
        TAREA_EDITAR_FECHA_HORA_ENTREGA.$TABLA_ASIGNADOS = $("#tabla_asignados").DataTable({
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
                        var checked = TAREA_EDITAR_FECHA_HORA_ENTREGA.ExisteAsignado(data) ? 'checked="checked"' : '';
                        return '<div class="container-checkbox">' +
                            '<input type="checkbox" id="checkbox-seleccionar-asignado' + data + '" ' + checked + ' onchange="TAREA_EDITAR_FECHA_HORA_ENTREGA.SeleccionarAsignado(this)" value="' + data + '" />' +
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
            if (!TAREA_EDITAR_FECHA_HORA_ENTREGA.ExisteAsignado(id))
                TAREA_EDITAR_FECHA_HORA_ENTREGA.ASIGNADOS.push(id);
        } else {
            var tamanoData = TAREA_EDITAR_FECHA_HORA_ENTREGA.ASIGNADOS.length;
            for (var i = 0; i < tamanoData; i++) {
                if (TAREA_EDITAR_FECHA_HORA_ENTREGA.ASIGNADOS[i] == id) {
                    TAREA_EDITAR_FECHA_HORA_ENTREGA.ASIGNADOS.splice(i, 1);
                    break;
                }
            }
        }
    },
    ExisteAsignado: function (id) {
        var existe = false;
        var tamanoData = TAREA_EDITAR_FECHA_HORA_ENTREGA.ASIGNADOS.length;
        for (var i = 0; i < tamanoData; i++) {
            if (TAREA_EDITAR_FECHA_HORA_ENTREGA.ASIGNADOS[i] == id) {
                existe = true;
                break;
            }
        }
        return existe;
    },
    //OnBegin - OnComplete
    OnBegin: function (jqXHR, settings) {
       

        var data = $(this).serializeObject();
        data["ListaResponsables"] = TAREA_EDITAR_FECHA_HORA_ENTREGA.RESPONSABLES;
        data["ListaAsignados"] = TAREA_EDITAR_FECHA_HORA_ENTREGA.ASIGNADOS;
       

        settings.data = jQuery.param(data);
        return true;
    },
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            console.log(resultado);
            if (resultado.state == true) {
                tipoMensaje = "success";
                TAREA_LISTAR.RecargarTablaPage();
                TAREA_PENDIENTE_LISTAR.RecargarTablaPage();
                TAREA_CONTESTADA_LISTAR.RecargarTablaPage();
                Utils._CloseModal();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    }
}