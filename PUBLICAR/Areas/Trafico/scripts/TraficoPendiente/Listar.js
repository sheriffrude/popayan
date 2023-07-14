var $TABLA_SOLICITUDES_CLIENTE = null;
var SOLICITUDID = 0;
var EVENTO = null;

$(function () {
    TablaSolicitudes();
})

function AbrirModalCrear() {
    Utils._OpenModal(URL_CREAR_SOLICITUD_CLIENTE, "OnloadCrearSolicitud", "lg");
}

function OnloadCrearSolicitud() {
}

function TablaSolicitudes() {

    var $filtro = $("#texto");
    $TABLA_SOLICITUDES_CLIENTE = $("#tabla_Solicitudes_hechas").DataTable({
        "scrollX": true,
        "bDestroy": true,
        "ajax": {
            "url": URL_LISTAR_SOLICITUD_CLIENTE,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.estadoId = $("#TipoCierreId").val();
                d.grupoId = $("#GrupoId").val();
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
            { "data": "Titulo" },
            { "data": "Departamento" },
            { "data": "Grupo" },
            {
                "data": "Contactos",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-trafico" value="' + data.length + '" Onclick="DetalleContactos(' + full.Id + ')">';
                }
            },
            {
                "data": "Responsables",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    var cant = data.length;
                    var usuario = '';
                    if (cant > 0) {
                        for (var i = 0; i < cant; i++) {
                            usuario += '<br>' + data[i]['Nombre'] + '<br>';
                        }
                    }
                    usuario += '<br><a href="' + URL_AGREGAR_RESPONSABLE + '?id=' + full.Id + '" data-toggle="modal" data-target="#"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>';
                    usuario += ' <a href="' + URL_AGREGAR_RESPONSABLE + '?id=' + full.Id + '" data-toggle="modal" data-target="#"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></a>';
                    return usuario;
                }
            },
            {
                "data": "Status",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return data + '<br><a href="' + URL_AGREGAR_STATUS + '?id=' + full.Id + '" data-toggle="modal" data-target="#"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a> &nbsp;&nbsp;&nbsp; <a Onclick="HistorialStatus(' + full.Id + ')" data-toggle="tooltip" data-placement="top" title="Historial status"> <span class="glyphicon glyphicon-time" aria-hidden="true"></span></a> ';
                }
            },
            {
                "data": "Observacion",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return data + '<br><a href="' + URL_AGREGAR_OBSERVACION + '?id=' + full.Id + '" data-toggle="modal" data-target="#"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a> &nbsp;&nbsp;&nbsp; <a Onclick="HistorialObservacion(' + full.Id + ')" data-toggle="tooltip" data-placement="top" title="Historial Observacion"> <span class="glyphicon glyphicon-time" aria-hidden="true"></span></a> ';
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return '<span class="label">' + full.Estado + '</span>';
                }
            },
            {
                "data": "Fecha de Entrega",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return '<span class="label">' + full.FechaEntrega + '</span>';
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
                        resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CambiarEstado(this' + ',' + full.Id + ' )" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';

                    } else if (data == "Finalizada") {
                        //Estado: Finalizada
                        resultado = "";
                    } else {
                        //Estado: Cancelado
                        var checked = "";
                        resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CambiarEstado(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">';
                    }

                    return resultado;
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
                        resultado = '<input type="button" class="btn btn-trafico" value="Editar" Onclick="EditarSolicitud(' + full.Id + ')">';

                    } else if (data == "Finalizada") {
                        //Estado: Finalizada
                        resultado = "";
                    } else {
                        //Estado: Cancelado
                        resultado = '<input type="button" class="btn btn-trafico" value="Editar" Onclick="EditarSolicitud(' + full.Id + ')">';
                    }

                    return resultado;
                }
            },
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

function DetalleContactos(id) {
    Utils._OpenModal(URL_LISTAR_CONTACTOS + "?solicitudId=" + id, "OnLoadListaContactos", "lg");
}

function EditarSolicitud(id) {
    Utils._OpenModal(URL_EDITAR_SOLICITUD + "?id=" + id, "OnLoadListaContactos", "lg");
}

function OnLoadListaContactos() {

    $TABLA_STATUS = $("#tabla_Contactos").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_CONTACTOS,
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
                    return '<span class="glyphicon glyphicon-remove" aria-hidden="true" Onclick="ElimminarContacto(' + full.ContactoId + ')"></span>';

                }
            },
            { "data": "Nombre", },
            { "data": "Cargo" },
            { "data": "Correo" },
            { "data": "Fijo" },
            { "data": "Cel" }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function ElimminarContacto(id)
{

    CONTACTOID = id;
    var titulo = "<center>Confirmación</center>";
    var body = "¿Está seguro de eliminar este contacto?";
    Utils._BuilderConfirmation(titulo, body, 'ElimminarContactoConfirmado');
}

function ElimminarContactoConfirmado() {
    var parametros = {
        id: CONTACTOID
    };
    $.ajax({
        url: URL_ELIMINAR_CONTACTO,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            if (respuesta.state == true) {

                Utils._BuilderMessage("success", respuesta.message);
                OnLoadListaContactos();
                TablaSolicitudes();

            } else {
                Utils._BuilderMessage("danger", respuesta.message);
            }
        }
    });
}

function CrearContacto() {
    var id = $("#SolicitudId").val();
    Utils._OpenModal(URL_AGREGAR_CONTACTO + "?id=" + id, "onLoadContacto", "md");
}

function onLoadContacto() {
}

function OnBeginCrearContacto(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessCrearContacto(resultado) {

    var tipoMensaje = "danger";
    if (resultado.responseJSON.state == true) {
        tipoMensaje = "success";
    }

    Utils._BuilderMessage(tipoMensaje, resultado.responseJSON.message);
    Utils._CloseModal();
    TablaSolicitudes();
}

/* Crear Status */
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

/* Historial Status */
function HistorialStatus(id) {
    Utils._OpenModal(URL_HISTORIAL_STATUS + "?solicitudId=" + id, "OnLoadHistorico", "lg");
}

function OnLoadHistorico() {
    TablaHistoricosStatus();
}

function TablaHistoricosStatus() {

    $TABLA_SOLICITUDES_CLIENTE = $("#tabla_historico_Status").DataTable({
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

/* Crear Observacion */
function OnBeginCrearObservacion(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessCrearObservacion(resultado) {
    APROBACIONID = (resultado.data);
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    Utils._CloseModal();
    TablaSolicitudes();
}

/* Historial Observacion */
function HistorialObservacion(id) {
    Utils._OpenModal(URL_HISTORIAL_OBSERVACION + "?solicitudId=" + id, "OnLoadObservacion", "lg");
}

function OnLoadObservacion() {
    TablaHistoricosObservacion();
}

function TablaHistoricosObservacion() {

    $TABLA_SOLICITUDES_CLIENTE = $("#tabla_historico_Observacion").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_LISTAR_HISTORICO_OBSERVACION,
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
            { "data": "Observacion" }
        ]
    });
}

function CambiarEstado(e, id) {
    var titulo = "<center>Confirmación</center>";
    var body = "¿Está seguro de realizar ésta Solicitud?";
    EVENTO = e;
    var resultado = Utils._BuilderConfirmation(titulo, body, 'AbrirModalActivacionInactivacionSolicitud', 'RecargarTabla');
}

function RecargarTabla() {
    $TABLA_SOLICITUDES_CLIENTE.draw();
}

function AbrirModalActivacionInactivacionSolicitud() {
    var estado = ($(EVENTO).is(":checked") == true);

    var id = $(EVENTO).val();

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
    Utils._OpenModal(URL_CIERRE_SOLICITUD + "?solicitudId=" + SOLICITUDID, "", "md");
}