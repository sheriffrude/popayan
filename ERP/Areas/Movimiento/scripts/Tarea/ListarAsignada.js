var TAREA_ASIGNADA_LISTAR = {
    $TABLA: null,
    TAREA_TIPO_ASIGNACION: {
        Responsable: 1,
        Asignado: 2
    },
    OnLoad: function() {
        TAREA_ASIGNADA_LISTAR.CrearTabla();
        $("#form_tareas_asignadas")[0].reset();
        $("#form_tareas_asignadas").submit(TAREA_ASIGNADA_LISTAR.RecargarTabla);
       
    },
    CrearTabla: function () {
        if (TAREA_ASIGNADA_LISTAR.$TABLA != null)
            TAREA_ASIGNADA_LISTAR.$TABLA.destroy();
        var $filtro = null;
        TAREA_ASIGNADA_LISTAR.$TABLA = $("#tabla_tareas_asignadas").DataTable({
            "scrollX": true,
            "ajax": {
                "url": URL_TAREA_ASIGNADAS_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = $("#input_search_tareas_asignadas").val();
                    d.tipoAsignacionId = $("#form_tareas_asignadas #TipoAsignacionId").val(); 
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
                            '<input type="radio" name="input_radio_tarea_asignada" id="input_radio_tarea_asignada' + data + '" onclick="TAREA_LISTAR.Consultar(' + data + ')" class="custom-radio" />' +
                            '<label for="input_radio_tarea_asignada' + data + '" class="custom-radio-label"></label>' +
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
        if (TAREA_ASIGNADA_LISTAR.$TABLA != null)
            TAREA_ASIGNADA_LISTAR.$TABLA.draw("page");
        return false;
    },
    RecargarTabla: function () {
        if (TAREA_ASIGNADA_LISTAR.$TABLA != null)
            TAREA_ASIGNADA_LISTAR.$TABLA.draw();
        return false;
    },
    ResetearFiltroTabla: function () {
        $("#form_tareas_asignadas")[0].reset();
        TAREA_ASIGNADA_LISTAR.RecargarTabla();
        Utils._BuilderDropDown();
    },
}