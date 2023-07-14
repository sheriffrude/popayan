var INFORME_REUNION_LISTAR = {
    $TABLA: null,
    OnLoad: function () {
        INFORME_REUNION_LISTAR.CrearTabla();
    },
    CrearTabla: function () {
        INFORME_REUNION_LISTAR.$TABLA = $("#tabla_infomes_reunion").DataTable({
            "ajax": {
                "url": URL_LISTAR_LISTAR_INFORMES_ENTREVISTA,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = '';
                    d.otId = $("#OrdenTrabajoId").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },

            }, "columns": [
                { "data": "CodigoOt" },
                { "data": "TipoInforme" },
                { "data": "TipoReunion" },
                { "data": "FechaReunion" },
                { "data": "HoraInicio" },
                { "data": "HoraFin" },
                { "data": "FechaCreacion" },
                { "data": "Motivo" },
                { "data": "ElaboradoPor" },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<button class = "btn btn-xs btn-success" onclick="INFORME_REUNION_LISTAR.DescargarInforme(' + data + ')"><span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span></button>';
                    }
                },
                {
                    "data": "Estado",
                    "orderable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var resultado = "";
                        resultado = '<div class="btn-group">' +
                            '<button type= "button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Acciones<span class="caret"></span ></button>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a href="' + URL_VER_INFORME + '?id=' + full.OtId + '&codigoOt=' + full.CodigoOt + '&idInforme=' + full.Id + '" data-toggle="modal" data-target="#" data-size="all" >Ver detalle</a></li>' +
                            '<li><a href="' + URL_CREAR_VERSION_INFORME + '?id=' + full.OtId + '&codigoOt=' + full.CodigoOt + '&idInforme=' + full.Id + '" data-toggle="modal" data-execute-onload="OnLoadCrearVersionInforme" data-target="#" data-size="all">Crear Nueva versión</a></li>';
                        if (full.UrlArchivo != null) {
                            resultado += '<li><a href="' + full.UrlArchivo + '" target="_blank">Descargar Archivo Adjunto</a></li>'
                        }
                        else {
                            resultado += '</ul></div>'
                        }
                        return resultado;
                    }
                }

            ],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
            }
        });
    },
    DescargarInforme: function (i) {
        var parameters = {
            InformeEntrevistaId: i
        };
        ReportsP._Download("PDF", "Trafico/InformeEntrevista/InformeEntrevista.trdp", parameters);
    }
}