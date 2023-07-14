$(function () {
    AprobacionAnticipoListar.OnLoad();
});

var AprobacionAnticipoListar = {
    $TABLA: null,
    PRESUPUESTO_ID: null,
    VERSION_PRESUPUESTO_ID: null,
    ITEM_ID: null,
    ID_ANTICIPO: null,

    OnLoad: function () {
        this.CrearTabla();
        AprobacionAnticipoListar.PRESUPUESTO_ID = 0;
        AprobacionAnticipoListar.VERSION_PRESUPUESTO_ID = 0;
        AprobacionAnticipoListar.ITEM_ID = 0;
        AprobacionAnticipoListar.URL_PRESUPUESTO_ANTICIPOS_DETALLE = '/Produccion/PresupuestoItemAnticipo/Consultar';
        AprobacionAnticipoListar.URL_DETALLE_ANTICIPO_ITEM = "/Produccion/PresupuestoItemAnticipo/ListarItemAnticiposDetalle";
        $("#form-filtro-tabla")[0].reset();
        $("#form-filtro-tabla").submit(this.RecargarTabla);
    },
    CrearTabla: function () {
        var filtro = $("#input-filtro");
        //var $mostrar = $filtro.val();
        //alert(filtro.val());
        console.log(filtro, URL_APROBACION_ANTICIPO_LISTAR, $("#Estado").val());
        this.$TABLA = $("#tabla_aprobaciones_anticipos").DataTable({
            "scrollX": true,
            "ajax": {
                "url": URL_APROBACION_ANTICIPO_LISTAR,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = filtro.val();
                    d.estado = $("#Estado").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "PresupuestoId",
                    "render": function (data, type, full, meta) {
                        var url = URL_PRESUPUESTO_CONSULTAR + '/' + data;
                        var html = '<a href="' + url + '" target="_blank" class="btn btn-secondary" >Abrir # ' + data + '</a>';
                        return html;
                    }
                },
                {
                    "data": "AprobacionPresupuestoGrupoUsuarioId",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        if (full.EstadoId == 1) {///Pendiente
                            var url = URL_APROBACION_ANTICIPO_RESPONDER + '/' + data;
                            html = '<a href="' + url + '"  data-toggle="modal" data-target="#" class="btn btn-secondary" >Aprobar/Rechazar</a>';
                        }
                        return html;
                    }
                },
                { "data": "Empresa" },
                { "data": "Cliente" },
                { "data": "Producto" },
                { "data": "OrdenTrabajo" },
                { "data": "EnviadoPor" },
                { "data": "FechaHora" },
                {
                    "data": "AnticipoId",
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (data != null) {
                            html = '<button value="' + full.Id + '" class="btn btn-secondary" onclick="AprobacionAnticipoListar.AbrirModalDetalleAnticipos(' + data + "," + full.PresupuestoId + "," + full.VersionPresupuesto + ')">' +
                                'Detalle anticipo # ' + data + '</button>';
                        }
                        return html;
                    }   
                },
                { "data": "RazonSolicitud" },
                { "data": "FechaRegistro" },
                { "data": "FechaAnticipo" },
                { "data": "FormaPago" },
                { "data": "TotalAnticipo" },
                {
                    "data": "Estado",
                    "render": function (data, type, full, meta) {
                        var html = '<label>' + data + '</label>';
                        var url = URL_JERARQUIA_APROBACION_ANTICIPO_LISTAR + '/' + full.AnticipoId;
                        html += '<a href="' + url + '" class="btn btn-secondary" data-size="lg" data-toggle="modal" data-target="#" data-execute-onload="AprobacionAnticipoListarJerarquia.Onload" >Ver Jerarquía</a>';
                        return html;
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
            }
        });
    },
    
    RecargarTabla: function () {
        AprobacionAnticipoListar.$TABLA.draw();
        return false;
    },
    RecargarTablaPage: function () {
        AprobacionAnticipoListar.$TABLA.draw("Page");
        return false;
    },
    ResetearFiltroTabla: function () {
        $("#input-filtro").val("");
        $("#form-filtro-tabla")[0].reset();
        AprobacionAnticipoListar.RecargarTabla();
        Utils._BuilderDropDown();
    },

    /**
     * AbrirModalDetalleAnticipos
     */
    AbrirModalDetalleAnticipos: function (id, presupuestoId, versionId) {
        AprobacionAnticipoListar.PRESUPUESTO_ID = presupuestoId;
        AprobacionAnticipoListar.VERSION_PRESUPUESTO_ID = versionId;
        AprobacionAnticipoListar.ITEM_ID = id;


        AprobacionAnticipoListar.URL_PRESUPUESTO_DESEMBOLSAR_ANTICIPO = "/Produccion/Anticipo/Crear";
        AprobacionAnticipoListar.URL_PRESUPUESTO_LISTAR_ANTICIPOS = '/Produccion/PresupuestoItemAnticipo/Listar';
        AprobacionAnticipoListar.URL_CAMBIAR_ESTADO_ANTICIPO = '/Produccion/PresupuestoItemAnticipo/Cancelar';
        AprobacionAnticipoListar.URL_CANCELAR_ANTICIPO_DESEMBOLSADO = '/Produccion/PresupuestoItemAnticipo/CancelarDesembolsar';
        AprobacionAnticipoListar.ID_ANTICIPO = 0;
        var url = AprobacionAnticipoListar.URL_PRESUPUESTO_ANTICIPOS_DETALLE + "/?presupuestoId=" + presupuestoId + "&versionPresupuestoId=" + versionId + "&itemId=" + id;
        Utils._OpenModal(url, AprobacionAnticipoListar.CargarDatosModal, "lg");
    },

    /**
     * CargarDatosModal
     */
    CargarDatosModal: function () {
        AprobacionAnticipoListar.CrearTablaDetalle();
    },

    /**
     * CrearTablaDetalle
     */
    CrearTablaDetalle: function () {

        var $filtro = $("#input_filtro_listar_anticipos");

        this.$TABLA = $("#tabla_anticipo_detalle").DataTable({
            "scrollX": true,
            "bDestroy": true,
            "ajax": {
                "url": AprobacionAnticipoListar.URL_DETALLE_ANTICIPO_ITEM,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = $filtro.val();
                    d.presupuestoId = AprobacionAnticipoListar.PRESUPUESTO_ID;
                    d.versionPresupuestoId = AprobacionAnticipoListar.VERSION_PRESUPUESTO_ID;
                    d.itemId = AprobacionAnticipoListar.ITEM_ID;

                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "Anticipo",
                    "render": function (data, type, full, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                { "data": "Anticipo" },
                { "data": "Item" },
                { "data": "Grupo" },
                { "data": "Nombre" },
                { "data": "Descripcion" },
                { "data": "Dias" },
                { "data": "Cantidad" },
                {
                    "data": "ValorUnitario",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "ValorItem",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "ValorAnticipo",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "ValorImpuestos",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "ValorTotal",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
              
                {
                    "data": "Anticipo", //Desembolsar anticpo
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (PERMISO_DESEMBOLSAR_ANTICIPO) {
                            
                            if (data != null) {
                                if (full.Estado == "Aprobado") {
                                    html = '<button value="' + full.Anticipo + '" class="btn btn-secondary" onclick="AprobacionAnticipoListar.AbrirModalDesembolsarAnticipos(' + data + "," + AprobacionAnticipoListar.PRESUPUESTO_ID + "," + AprobacionAnticipoListar.VERSION_PRESUPUESTO_ID + ')">' +
                                        '<i class="fa fa-money" aria-hidden="true"></i>  Desembolsar</button>';
                                }

                                if (full.Estado == "Desembolsado") {

                                    html = '<button value="' + full.Anticipo + '" class="btn btn-danger" onclick="AprobacionAnticipoListar.CambiarEstadoAnticipo(' + data + ')">' +
                                        '<i class="fa fa-money" aria-hidden="true"></i>  Cancelar desembolso</button>';

                                    //html = '<button type="button" class="btn btn-sm btn-danger" onclick="PresupuestoItemAnticipoListar.CambiarEstadoAnticipo(' + full.Id + ')" value="Cancelar desembolso">';
                                }

                            }
                        }
                        return html;
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
                Utils._BuilderModal();
                $("#tabla_anticipo").parent("div.col-sm-12").eq(0).css("overflow", "auto");
            }
        });
    },


    CambiarEstadoAnticipo: function (IdAnticipo) {
        AprobacionAnticipoListar.ID_ANTICIPO = IdAnticipo;
        Utils._BuilderConfirmation('CANCELAR DESEMBOLSO ANTICIPO', '¿Está seguro que desea realizar esta acción?', AprobacionAnticipoListar.CancelarDesembolsoAnticipo, AprobacionAnticipoListar.RecargarTabla);
    },
    CancelarDesembolsoAnticipo: function () {

        var parameters = {
            AnticipoId: AprobacionAnticipoListar.ID_ANTICIPO,
            
        };

        RequestHttp._Post(AprobacionAnticipoListar.URL_CANCELAR_ANTICIPO_DESEMBOLSADO, parameters, null, function (data) {


            if (data != null) {
                if (data.state == true) {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    AprobacionAnticipoListar.RecargarTabla();

                } else {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                }
            }

        })
    },

    /**
     * RecargarTabla
     */
    RecargarTabla: function () {
        AprobacionAnticipoListar.$TABLA.draw();
        return false;
    },

    /**
     * RecargarTablaPage
     */
    RecargarTablaPage: function () {
        AprobacionAnticipoListar.$TABLA.draw("PAGE");
        return false;
    },

    /**
     * ResetearTabla
     */
    ResetearTabla: function () {
        $("#input_filtro_listar_anticipos").val('');
        this.RecargarTabla();
        return false;
    },

    /**
     * CambiarEstado
     * @param {any} e
     */
    CambiarEstado: function (e) {
        var estado = ($(e).is(":checked") == true);
        var id = $(e).val();

        var parameters = {
            PresupuestoId: AprobacionAnticipoListar.PRESUPUESTO_ID,
            VersionPresupuestoId: AprobacionAnticipoListar.VERSION_PRESUPUESTO_ID,
            ItemId: id,
            Estado: estado
        };

        RequestHttp._Post(AprobacionAnticipoListar.URL_CAMBIAR_ESTADO_ANTICIPO, parameters, null, function (resultado) {

            if (resultado != null) {
                var tipoMensaje = (resultado.state == true) ? "success" : "danger";
                Utils._BuilderMessage(tipoMensaje, resultado.message);
                AprobacionAnticipoListar.RecargarTabla();
            }
        });

    },
    AbrirModalDesembolsarAnticipos: function (Anticipo, presupuestoId, versionId) {
        var url = AprobacionAnticipoListar.URL_PRESUPUESTO_DESEMBOLSAR_ANTICIPO + "/?presupuestoId=" + presupuestoId + "&versionPresupuestoId=" + versionId + "&itemId=" + Anticipo;
        console.log(url);
        Utils._OpenModal(url, AprobacionAnticipoListar.OnLoadDesembolsarAnticipo, "lg");
    },

    OnLoadDesembolsarAnticipo: function () {
    },
}