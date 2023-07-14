var TAREA_PENDIENTE_LISTAR = {
    $TAREA: null,
    TAREA_TIPO_ASIGNACION: {
        Responsable: 1,
        Asignado: 2
    },
    OnLoad: function () {
        TAREA_PENDIENTE_LISTAR.CrearTarea();
        $("#form_tareas_pendientes")[0].reset();
        $("#form_tareas_pendientes").submit(TAREA_PENDIENTE_LISTAR.RecargarTabla);
    },
    CrearTarea: function () {
        if (TAREA_PENDIENTE_LISTAR.$TABLA != null)
            TAREA_PENDIENTE_LISTAR.$TABLA.destroy();

        TAREA_PENDIENTE_LISTAR.$TABLA = $("#tabla_tareas_pendientes").DataTable({
            "scrollX": true,
            "ajax": {
                "url": URL_TAREA_PENDIENTE_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = $("#input_search_tareas_pendiente").val();
                    d.tipoAsignacionId = $("#form_tareas_pendientes #TipoAsignacionId").val();
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
                            '<input type="radio" name="input_radio_tarea_pendiente" id="input_radio_tarea_pendiente' + data + '" onclick="TAREA_LISTAR.Consultar(' + data + ')" class="custom-radio" />' +
                            '<label for="input_radio_tarea_pendiente' + data + '" class="custom-radio-label"></label>' +
                            '</div>';
                    }
                },
                { "data": "OrdenTrabajo" },
                { "data": "Numero" },
                { "data": "Tipo" },
                { "data": "Titulo" },
                { "data": "DepartamentoTrafico" },
                { "data": "FechaEntrega" },
                { "data": "HoraEntrega" },
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
            ],
            "order": [[9, "desc"]],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
                Utils._BuilderToolTip();
            }
        });
    },
    RecargarTablaPage: function () {
        if (TAREA_PENDIENTE_LISTAR.$TABLA != null)
            TAREA_PENDIENTE_LISTAR.$TABLA.draw("page");
        return false;
    },
    RecargarTabla: function () {
        if (TAREA_PENDIENTE_LISTAR.$TABLA != null)
            TAREA_PENDIENTE_LISTAR.$TABLA.draw();
        return false;
    },
    ResetearFiltroTabla: function () {
        $("#form_tareas_pendientes")[0].reset();
        TAREA_PENDIENTE_LISTAR.RecargarTabla();
        Utils._BuilderDropDown();
    },
}