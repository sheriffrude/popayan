var $TABLA_SOLICITUDES = null;
var SOLICITUDID = 0;

$(function () {
    TablaSolicitudes();
})


function AbrirModalCrear() {
    Utils._OpenModal(URL_CREAR_SOLICITUD, "OnloadCrearSolicitud", "lg");
}

function TablaSolicitudes() {

    var $filtro = $("#texto");
    

    $TABLA_SOLICITUDES = $("#tabla_Solicitudes_hechas").DataTable({
        "scrollX": true,
        "bDestroy": true,
        "ajax": {
            "url": URL_LISTAR_SOLICITUD,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.estadoId = $("#TipoCierreId").val();
            }
        },
        "columns": [
            {
                "data": "Id",
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "TipoRequerimiento" },
            
            { "data": "Id" },
            { "data": "Titulo" },
            {
                "data": "Descripcion",
                "width": "50%",
            },
            { "data": "SolicitadoPor" },
            { "data": "Depto" },
            { "data": "FechaCreacion", },   
            {
                 "data": "Responsables",
                 "orderable": false,
                 "searchable": false,
                 "width": "20%",
                 "render": function (data, type, full, meta) {
                     var cant = data.length;
                     var usuario = '';
                     for (var i = 0; i < cant; i++) {
                         usuario += '<br>' + data[i]['Nombre'] + '<br>';
                     }
                     return usuario;
                 }
            },
            { "data": "Fecha" },
            {
                "data": "Estado",
                "width": "10%",
                "render": function (data, type, full, meta) {

                    if (full.Marca == 1 && full.StatusDir == "") {
                        return '<span class="label">' + full.Estado + '</span>';
                    }
                    else if (full.Marca == 1 && full.StatusDir != "") {
                        return '<span class="label">' + full.Estado + '</span>';
                    } else {

                        if (data == "En Progreso") {
                            if (PERMISO_TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_ADMINISTRATIVA_CREAR_STATUS == true)
                                return '<span class="label">' + full.Estado + '</span> <br><span class="glyphicon glyphicon-ok" aria-hidden="true" Onclick="CambiarEstadoSolicitud(' + full.Id + ')"></span>';
                            else
                                return '<span class="label">' + full.Estado + '</span>';

                        } else if (data == "Finalizada") {
                            return '<span class="label">' + full.Estado + '</span>';
                        }
                        else {
                            return '<span class="label">' + full.Estado + '</span>';
                        }
                    }                    
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {

                    var resultado = "";
                    if (data == "En Progreso") {
                        //Estado: En Progreso
                        var checked = "checked";

                        if (PERMISO_TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_ADMINISTRATIVA_CREAR_STATUS == true) {
                            resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CambiarEstado(this' + ',' + full.Id + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';
                        }
                        else {
                            resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CambiarEstado(this' + ',' + full.Id + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';
                        }

                    } else if (data == "Finalizada") {
                        //Estado: Finalizada
                        resultado = '<input type="checkbox" ' + checked + ' class="boton - desactivar - persona" onchange="" data-toggle="toggle" data-onstyle="success" data-offstyle="" value="' + full.Id + '">';
                    } else {
                        //Estado: Cancelado
                        var checked = "";
                        resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CambiarEstado(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';
                    }

                    return resultado;
                }
            },
            {
                "data": "Status",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {

                    if (PERMISO_TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_ADMINISTRATIVA_CREAR_STATUS == true){

                        return data + '<br><a href="' + URL_AGREGAR_STATUS + '?id=' + full.Id +
                            '" data-toggle="modal" data-target="#" data-toggle="tooltip" data-placement="top" title="Agregar status"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a> &nbsp;&nbsp;&nbsp; <a Onclick="HistorialStatus(' + full.Id + ')" data-toggle="tooltip" data-placement="top" title="Historial status"> <span class="glyphicon glyphicon-time" aria-hidden="true"></span></a> ';

                    } else {
                        return data;
                    }
                }
            },
            {
                "data": "StatusDir",
                "orderable": false,
            },
            {
                "data": "Accion",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return '<a href="' + URL_CIERRE_SOLICITUD + '?solicitudId=' + full.Id +
                        '" data-toggle="modal" data-target="#" data-toggle="tooltip" data-placement="top" title="Agregar status"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a>';
                }
            }
        ],
        "fnRowCallback": function (nRow, aData) {
            var color = "";
            var $nRow = $(nRow);
            if (aData.Estado == "En Progreso") {
                $nRow.css({ "background-color": "#9bd39b" });
            } else if (aData.Estado == "Finalizada") {
                $nRow.css({ "background-color": "#bfbfbf" });
            } else {
                //Canceladas
                $nRow.css({ "background-color": "#e07370" });
            }
            return nRow;
        },
        "order": [[1, "desc"]],
        "drawCallback": function (settings) {

            Utils._BuilderModal();
            $(".boton-desactivar-persona").bootstrapToggle({
                on: '',
                off: ''
            });

        }
    });
}

function CambiarEstadoSolicitud(id) {
        SOLICITUDID = id;
        var titulo = "<center>Confirmación</center>";
        var body = "¿Está seguro de Terminar ésta Solicitud?";
        Utils._BuilderConfirmation(titulo, body, 'AbrirModalCierreSolicitud','RecargarTabla'); 
}

function CambiarEstado(e, id) {
    var titulo = "<center>Confirmación</center>";
    var body = "¿Está seguro de realizar ésta Solicitud?";
    var datos = e;
    var resultado = Utils._BuilderConfirmation(titulo, body, 'AbrirModalActivacionInactivacionSolicitud', 'RecargarTabla', datos);
}

function RecargarTabla() {
    $TABLA_SOLICITUDES.draw();
}

function AbrirModalActivacionInactivacionSolicitud(e) {

    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();

    if (estado == true)
        idEstado = 1;
    else
        idEstado = 3;

    var parameters = {
        Id: id,
        Estado: idEstado
    };

    RequestHttp._Post(URL_CAMBIAR_ESTADO_SOLICITUD, parameters, null, function (resultado) {

        if (resultado != null) {
            var tipoMensaje = (resultado.state == true) ? "success" : "danger";

            Utils._BuilderMessage(tipoMensaje, resultado.message);
            RecargarTabla();
        }
    });
}

function AbrirModalCierreSolicitud() {
    var url = URL_CIERRE_SOLICITUD + "?solicitudId=" + SOLICITUDID;
    Utils._OpenModal(url, "", "md");
}

function OnBeginCrearStatus(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessCrearStatus(resultado) {
    APROBACIONID = (resultado.data);
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }

    Utils._BuilderMessage(tipoMensaje, resultado.message);
    Utils._CloseModal();
    TablaSolicitudes();
}

function HistorialStatus(id) {
    Utils._OpenModal(URL_HISTORIAL_STATUS + "?solicitudId=" + id, "OnLoadHistorico", "lg");
}

function OnLoadHistorico() {
    TablaHistoricosStatus();
}

function TablaHistoricosStatus() {

    $TABLA_SOLICITUDES = $("#tabla_historico_Status").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_LISTAR_HISTORICO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = '';
                d.solicitudId = $("#SolicitudId").val();
            }
        },
        "columns": [
            {
                "data": "Id",
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "Empleado", },
            { "data": "FechaCreacion" },
            { "data": "Status" }
        ]
    });

}

function OnBeginCierreSolicitud(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnCompleteCierreSolicitud(resultado) {

    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    Utils._CloseModal();
    TablaSolicitudes();
}