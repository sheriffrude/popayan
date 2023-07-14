var TAREA_LISTAR = {
    $TABLA: null,
    ORDEN_TRABAJO_ID: null,
    TAREA_TIPO_ASIGNACION: {
        Responsable: 1,
        Asignado: 2
    },
    TAREA_ESTADO: {
        SinResponder: 1,
        Contestada: 2,
        Finalizada: 3,
        Cancelada: 4
    },
    TAREA_TIPO: {
        CreadasPorMi: 1,
        CreadasPorOtros: 2,
        Finalizada: 3,
        Cancelada: 4
    },
    OnLoad: function (ordenTrabajoId) {
        TAREA_LISTAR.ORDEN_TRABAJO_ID = ordenTrabajoId;
        TAREA_LISTAR.CrearTabla();

        $("#form_filtro_tabla_tareas")[0].reset();
        $("#form_filtro_tabla_tareas").submit(TAREA_LISTAR.RecargarTabla);
    },
    CrearTabla: function () {
        if (TAREA_LISTAR.$TABLA != null)
            TAREA_LISTAR.$TABLA.destroy();

        var $filtro = $("#input-filtro-tareas");

        TAREA_LISTAR.$TABLA = $("#tabla_tareas").DataTable({
            "scrollX": true,
            "ajax": {
                "url": URL_TAREA_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = $filtro.val();
                    d.ordenTrabajoId = TAREA_LISTAR.ORDEN_TRABAJO_ID;
                    d.tareaTipoCreacionId = $("#TareaTipoCreacionId").val();
                    d.tareaEstadoId = $("#TareaEstadoId").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },
            },
            "columns": [
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<div class="container-radio">' +
                            '<input type="radio" name="input_radio_tarea" id="input_radio_tarea' + data + '" onclick="TAREA_LISTAR.Consultar(' + data + ')" class="custom-radio" />' +
                            '<label for="input_radio_tarea' + data + '" class="custom-radio-label"></label>' +
                            '</div>';
                    }
                },
                { "data": "Numero" },
                { "data": "Tipo" },
                { "data": "Titulo" },
                { "data": "DepartamentoTrafico" },
                { "data": "FechaEntrega" },
                { "data": "HoraEntrega" },
                { "data": "Estado" },
                {
                    "data": "Id",//Status Cliente
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return (full.Editar)
                            ? '<a href="' + URL_TAREA_STATUS_CLIENTE_LISTAR + '/' + data + '" data-toggle="modal" data-target="#" data-execute-onload="TAREA_STATUS_CLIENTE_LISTAR.OnLoad" class="btn btn-secondary btn-sm">Status cliente</a>'
                            : "";
                    },
                },
                { "data": "EnviadaPor" },
                { "data": "FechaHoraCreacion" },
                {
                    "data": "Usuarios",//Responsables
                    "orderable": false,
                    "searchable": false,
                    "width": "20%",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        var cant = data.length;
                        for (var i = 0; i < cant; i++) {
                            if (data[i]['TipoAsignacionId'] == TAREA_LISTAR.TAREA_TIPO_ASIGNACION.Responsable) {
                                if (data[i]['Lectura'])
                                    html += '<span class="label label-success" data-toggle="tooltip" data-placement="left" title="' + data[i]['FechaHoraLectura'] + '" >' + data[i]['Nombre'] + '</span><br />';
                                else
                                    html += '<span class="label label-default">' + data[i]['Nombre'] + '</span><br />';
                            }
                        }
                        return html;
                    }
                },
                {
                    "data": "Usuarios",//Asinados
                    "orderable": false,
                    "searchable": false,
                    "width": "20%",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        var cant = data.length;
                        for (var i = 0; i < cant; i++) {
                            if (data[i]['TipoAsignacionId'] == TAREA_LISTAR.TAREA_TIPO_ASIGNACION.Asignado) {
                                if (data[i]['Lectura'])
                                    html += '<span class="label label-success" data-toggle="tooltip" data-placement="left" title="' + data[i]['FechaHoraLectura'] + '" >' + data[i]['Nombre'] + '</span><br />';
                                else
                                    html += '<span class="label label-default">' + data[i]['Nombre'] + '</span><br />';
                            }
                        }
                        return html;
                    }
                },
                {
                    "data": "TotalArchivos",
                    "orderable": false,
                    "searchable": false,
                },
                {
                    "data": "Id",//Acciones
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (PERMISO_TAREA_CONSULTAR || PERMISO_TAREA_RESPONDER || PERMISO_TAREA_CANCELAR || PERMISO_TAREA_FINALIZAR) {
                            html = '<div class="btn-group">' +
                                '<button type= "button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown"> Acciones <span class="caret"></span ></button>' +
                                '<ul class="dropdown-menu">';
                            if (PERMISO_TAREA_CONSULTAR)
                                html += '<li><a href="' + URL_TAREA_CONSULTAR + '/' + full.Id + '" data-toggle="modal" data-target="#" data-execute-onload="TAREA_CONSULTAR.OnLoad" data-size="lg">Ver detalle</a></li>';

                            if (full.EstadoId === TAREA_LISTAR.TAREA_ESTADO.Finalizada || full.EstadoId === TAREA_LISTAR.TAREA_ESTADO.Contestada || full.Estado === TAREA_LISTAR.TAREA_ESTADO.Cancelada)
                                html += '';
                            else if (full.EstadoId === TAREA_LISTAR.TAREA_ESTADO.SinResponder) {
                                if (PERMISO_TAREA_RESPONDER && full.Responder)
                                    html += '<li><a href="' + URL_TAREA_RESPONDER + '/' + full.Id + '" data-toggle="modal" data-target="#" data-execute-onload="TAREA_RESPONDER.OnLoad" data-size="lg">Responder</a></li>';
                                if (PERMISO_TAREA_CANCELAR && full.Editar)
                                    html += '<li><a href="' + URL_TAREA_CANCELAR + '/' + full.Id + '" data-toggle="modal" data-target="#" data-size="lg">Cancelar</a></li>';
                                if (PERMISO_TAREA_FINALIZAR && full.Finalizar) {
                                    html += '<li><a href="' + URL_TAREA_FINALIZAR + '/' + full.Id + '" data-toggle="modal" data-target="#" data-size="lg">Finalizar</a></li>';
                                }
                            }
                            html += '</ul></div>';
                        }
                        return html;
                    }
                },
            ],
            "order": [[10, "desc"]],
            "fnRowCallback": function (nRow, aData) {
                var $nRow = $(nRow);
                if (aData.EstadoId == TAREA_LISTAR.TAREA_ESTADO.Cancelada) {
                    $nRow.addClass("bg-red");
                } else if (aData.EstadoId == TAREA_LISTAR.TAREA_ESTADO.Finalizada) {
                    $nRow.addClass("bg-gray");
                } else if (aData.EstadoId == TAREA_LISTAR.TAREA_ESTADO.SinResponder
                    || aData.EstadoId == TAREA_LISTAR.TAREA_ESTADO.Contestada) {
                    if (aData.Editar)
                        $nRow.addClass("bg-white");
                    else
                        $nRow.addClass("bg-blue-sky");
                }
                return nRow;
            },
            "drawCallback": function (settings) {
                Utils._BuilderModal();
                Utils._BuilderToolTip();
            }
        });
    },
    RecargarTabla: function () {
        if (TAREA_LISTAR.$TABLA != null)
            TAREA_LISTAR.$TABLA.draw();
        return false;
    },
    RecargarTablaPage: function () {
        if (TAREA_LISTAR.$TABLA != null)
            TAREA_LISTAR.$TABLA.draw("page");
        return false;
    },
    ResetearFiltroTabla: function () {
        $("#form_filtro_tabla_tareas")[0].reset();
        TAREA_LISTAR.RecargarTabla();
        Utils._BuilderDropDown();
    },
    Consultar: function (id) {
        var url = URL_TAREA_CONSULTAR + '/' + id;
        Utils._OpenModal(url, TAREA_CONSULTAR.OnLoad, "lg");
        return false;
    },
    Crear: function () {
        var url = URL_TAREA_CREAR + "/" + TAREA_LISTAR.ORDEN_TRABAJO_ID;
        Utils._OpenModal(url, TAREA_CREAR.OnLoad, "lg");
    },
    Eliminar: function (id) {
        TAREAID = id;
        var titulo = "<center>Cancelar tareas</center>";
        var body = "¿Está seguro de cancelar esta tarea?";
        Utils._BuilderConfirmation(titulo, body, 'Cancelar', null);

    },
    Cancelar: function () {
        var parametros = {
            id: TAREAID
        };
        $.ajax({
            url: URL_CANCELAR_TAREA,
            type: 'POST',
            dataType: 'json',
            data: parametros,
            success: function (data) {
                Utils._BuilderMessage("danger", data.message);
                ConstruirPendientes();
                ConstruirAsignadas();
                ConstruirContestados();
                ConstruirTablaTarea();
            }
        });
    }
}