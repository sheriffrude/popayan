var $TABLA_SOLICITUDES_PENDIENDTES = null;
var $TABLA_STATUS = null;
var CONTACTOID = 0;
var ARRAY_SOLICITUDID = [];

$(function () {
    TablaSolicitudesPendientes();
});

function TablaSolicitudesPendientes() {
    var $filtro = $("#texto");
    
    $TABLA_SOLICITUDES_PENDIENDTES = $("#tabla_Solicitudes_pendientes").DataTable({
        "scrollX": true,
        "bDestroy": true,
        "ajax": {
            "url": URL_LISTAR_SOLICITUD_PENDIENTE,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.estadoId = $("#TipoCierreId").val();
                d.marcaId = $("#MarcaIdBusqueda").val();
            }
        },
        "columns": [
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return (TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_PENDIENTE_MARCAR == true)
                        ? '<input type="checkbox"  id="' + data + '" onclick="SeleccionarItem(' + data + ')" />'
                        : '';
                }
            },
            {
                "data": "Id",
                "render": function (data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "Empresa" },
            { "data": "TipoRequerimiento" },
            { "data": "Id" },
            { "data": "Titulo" },
            { "data": "Descripcion" },
            { "data": "SolicitadoPor" },
            { "data": "Depto" },
            {
                "data": "FechaCreacion",
                "width": "15%"
            },
            {
                "data": "Fecha",
                "width": "15%"
            },
            {
                "data": "Estado",
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return '<span class="label">' + full.Estado + '</span>';
                }

            },
            {
                "data": "Path",
                 "render": function (data, type, full, meta) {
                     return '<a href="@Url.Content(' + full.Path + ')" target="_blank" class="btn btn-secondary">Descargar</a>';
                }
            },
            { "data": "Archivo" },
            {
                "data": "Marca",
                "width": "15%"},
            {
                "data": "Status",
                "orderable": false,
            },
            {
                "data": "StatusDir",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return (TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_PENDIENTE_CREAR_STATUS == true)
                        ? data + '<br><a href="' + URL_AGREGAR_STATUS + '?id=' + full.Id + '" data-toggle="modal" data-target="#"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>'
                        : data;
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return (TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_PENDIENTE_VER_STATUS == true) ? '<input type="button" class="btn btn-trafico" value="Ver" Onclick="HistorialStatus(' + data + ')" >': '';
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return (TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_PENDIENTE_LISTAS_CONTACTOS == true)
                        ? '<input type="button" class="btn btn-trafico" value="' + full.TotalContactos + '" Onclick="DetalleContactos(' + data + ')">'
                        : '';

                }
            },
        ],
        "fnRowCallback": function (nRow, aData) {
            var color = "";
            var $nRow = $(nRow);
            if (aData.Estado == "En Progreso") {
                $nRow.css({ "background-color": "#9bd39b" });
                if (aData.Marca == "Sin Revisar" ) {
                    $nRow.css({ "background-color": "#8fcacb" });
                }
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
        }
    });

}

function SeleccionarItem(id) {

    var tam = ARRAY_SOLICITUDID.length;
    for (i = 0; i < tam; i++) {
        if (ARRAY_SOLICITUDID[i] == id) {
            ARRAY_SOLICITUDID.splice(i, 1);
            return false;
        }
    }
    ARRAY_SOLICITUDID.push(id);
}

function MarcarSolicitud() {

    var marcaId = $("#MarcaId").val();

    if (marcaId == '') {
        return false;
    } else {

        if (ARRAY_SOLICITUDID.length == 0)
            return false;

        var parametros = {
            marcaId: marcaId,
            ListaSolicitudId: ARRAY_SOLICITUDID
        }

        $.ajax({
            url: URL_MARCAR_SOLICITUD,
            type: 'POST',
            dataType: 'json',
            data: parametros,
            success: function (respuesta) {

                if (respuesta.state == true) {
                    Utils._BuilderMessage("success", respuesta.message);
                    TablaSolicitudesPendientes();
                    ARRAY_SOLICITUDID = [];
                } else {
                    Utils._BuilderMessage("danger", respuesta.message);
                    ARRAY_SOLICITUDID = [];
                }
            }
        });
    }
}

function CrearContacto() {
    var id = $("#SolicitudId").val();
    Utils._OpenModal(URL_AGREGAR_CONTACTO + "?id=" + id, "", "md");
}

function DetalleContactos(id) {
    Utils._OpenModal(URL_LISTAR_CONTACTOS + "?solicitudId=" + id, "OnLoadListaContactos", "lg");
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
                    return (TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_PENDIENTE_EDITAR_CONTACTOS == true)
                        ? '<a href="' + URL_EDITAR_CONTACTO + '?contactoId=' + full.ContactoId + '" data-toggle="modal" data-target="#"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>'
                        : '';
                }
            },
            {
                "data": "Id",
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return (TRA_TRAFICO_ADMINISTRATIVO_SOLICITUD_PENDIENTE_EDITAR_CONTACTOS == true)
                        ? '<span class="glyphicon glyphicon-remove" aria-hidden="true" Onclick="ElimminarContacto(' + full.ContactoId + ')"></span>'
                        : '';

                }
            },
            { "data": "Nombre", },
            { "data": "Cargo" },
            { "data": "Correo" },
            { "data": "Direccion" },
            { "data": "Fijo" },
            { "data": "Cel" }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function ElimminarContacto(id) {

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
                TablaSolicitudesPendientes();

            } else {
                Utils._BuilderMessage("danger", respuesta.message);
            }
        }
    });
}

function HistorialStatus(id) {
    Utils._OpenModal(URL_HISTORIAL_STATUS + "?solicitudId=" + id, "OnLoadHistorico", "lg");
}

function OnLoadHistorico() {
    TablaHistoricosStatus();
}

function TablaHistoricosStatus() {

    $TABLA_STATUS = $("#tabla_historico_Status").DataTable({

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
    TablaSolicitudesPendientes();
}

function OnBeginCrearContacto(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessCrearContacto(resultado) {
    APROBACIONID = (resultado.data);
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    Utils._CloseModal();
    TablaSolicitudesPendientes();
}

function OnBeginEditarContacto(jqXHR, settings) {
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessEditarContacto(resultado) {
    APROBACIONID = (resultado.data);
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }

    Utils._BuilderMessage(tipoMensaje, resultado.message);
    Utils._CloseModal();
    TablaSolicitudesPendientes();
}

function OnClickDownload() {

    var src = $('img[alt="Logo"]').attr('src');

    var parameters = {
        UsuaruioId: $("#UsuarioId").val(),
        NombreUsuario: $("#NombreUsuario").val()
    };

    ReportsP._OpenTab("PDF", "Trafico/SolicitudesPendientes.trdp", parameters);
    //ReportsP._Download("PDF", "ReportPrueba.trdp", parameters);
}



