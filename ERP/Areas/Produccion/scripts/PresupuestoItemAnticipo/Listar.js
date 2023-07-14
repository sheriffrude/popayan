/**
 * PresupuestoItemAnticipoListar
 */
var PresupuestoItemAnticipoListar = {

    /**
     * Variables Globales
     */
    $TABLA: null,
    ID_ANTICIPO: null,

    /**
     * OnLoad
     */
    OnLoad: function () {
        PresupuestoItemAnticipoListar.URL_PRESUPUESTO_DESEMBOLSAR_ANTICIPO = "/Produccion/Anticipo/Crear";
        PresupuestoItemAnticipoListar.URL_PRESUPUESTO_LISTAR_ANTICIPOS = '/Produccion/PresupuestoItemAnticipo/Listar';
        PresupuestoItemAnticipoListar.URL_CAMBIAR_ESTADO_ANTICIPO = '/Produccion/PresupuestoItemAnticipo/Cancelar';
        PresupuestoItemAnticipoListar.URL_CANCELAR_ANTICIPO_DESEMBOLSADO = '/Produccion/PresupuestoItemAnticipo/CancelarDesembolsar';
        PresupuestoItemAnticipoListar.ID_ANTICIPO = 0;
        this.CrearTabla();
        $("#form_filtro_tabla_anticipos").submit(this.RecargarTabla);
    },

    /**
     * CrearTabla
     */
    CrearTabla: function () {

        var $filtro = $("#input_filtro_listar_anticipos");

        this.$TABLA = $("#tabla_anticipo").DataTable({
            "scrollX": true,
            "bDestroy": true,
            "ajax": {
                "url": PresupuestoItemAnticipoListar.URL_PRESUPUESTO_LISTAR_ANTICIPOS,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = $filtro.val();
                    d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                    d.versionPresupuestoId = PresupuestoConsultar.VERSION_PRESUPUESTO_ID;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "Id",
                    "render": function (data, type, full, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                { "data": "Id" },
                { "data": "UsuarioRegistro" },
                { "data": "RazonSolicitud" },
                { "data": "FechaRegistro" },
                { "data": "FechaAnticipo" },
                { "data": "FechaLegalizacionAnticipo" },
                { "data": "FormaPago" },
                {
                    "data": "Estado",
                    "render": function (data, type, full, meta) {
                        var html = '<label>' + data + '</label>';
                        var url = URL_JERARQUIA_APROBACION_ANTICIPO_LISTAR + '/' + full.Id;

                        if (PERMISO_APROBACION_ANTICIPO) {
                            if (data != null) {
                                if (full.Estado != "Registrado") {
                                    html += '<a href="' + url + '" class="btn btn-secondary" data-size="lg" data-toggle="modal" data-target="#" data-execute-onload="AprobacionAnticipoListarJerarquia.Onload" >Ver Jerarquía</a>';
                                }
                            }
                        }
                        return html;
                    }
                },
                {
                    "data": "TotalAnticipo",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "TotalDesembolsado",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "TotalLegalizado",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "Id", // Solicitar aprobación anticpo
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (PERMISO_APROBACION_ANTICIPO) {
                            if (data != null) {
                                if (full.Estado == "Registrado") {
                                    html = '<a href="' + URL_APROBACION_ANTICIPO + '?id=' + PresupuestoConsultar.PRESUPUESTO_ID + '&anticipoId=' + data + '"  data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" > <i class="fa fa-share-square-o" aria-hidden="true"></i> Solicitar aprobación</a>'
                                }
                            }
                        }
                        return html;
                    }
                },
                {
                    "data": "Id", //Desembolsar anticpo
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (PERMISO_DESEMBOLSAR_ANTICIPO) {
                            if (data != null) {
                                if (full.Estado == "Aprobado") {
                                    html = '<button value="' + full.Id + '" class="btn btn-secondary" onclick="PresupuestoItemAnticipoListar.AbrirModalDesembolsarAnticipos(' + data + "," + PresupuestoConsultar.PRESUPUESTO_ID + "," + PresupuestoConsultar.VERSION_PRESUPUESTO_ID + ')">' +
                                        '<i class="fa fa-money" aria-hidden="true"></i>  Desembolsar</button>';
                                }

                                if (full.Estado == "Desembolsado") {

                                    html = '<button value="' + full.Id + '" class="btn btn-danger" onclick="PresupuestoItemAnticipoListar.CambiarEstadoAnticipo(' + data + ')">' +
                                        '<i class="fa fa-money" aria-hidden="true"></i>  Cancelar desembolso</button>';

                                    //html = '<button type="button" class="btn btn-sm btn-danger" onclick="PresupuestoItemAnticipoListar.CambiarEstadoAnticipo(' + full.Id + ')" value="Cancelar desembolso">';
                                }

                            }
                        }
                        return html;
                    }
                },
                {
                    "data": "Estado",
                    "orderable": false,
                    "render": function (data, type, full, meta) {
                        var resultado = "";

                        if (PresupuestoConsultar.ESTADO_ID === "5" || PresupuestoConsultar.ESTADO_ID === "7") {
                            if (data == "Registrado") {
                                var checked = "checked";
                                resultado = '<div class="text-center"><input type="checkbox" ' + checked + ' class="boton-desactivar-anticipo btn-sm" onchange="PresupuestoItemAnticipoListar.CambiarEstado( this)" data-toggle="toggle"  data-size="mini" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '"> </div>';
                            } else if (data == "Cancelado") {
                                resultado = "";
                                resultado = '<div class="text-center"><input type="checkbox" ' + checked + ' class="boton-desactivar-anticipo btn-sm" onchange="PresupuestoItemAnticipoListar.CambiarEstado(this)" data-toggle="toggle"  data-size="mini" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '"> </div>';
                            } else {
                                resultado = "";
                            }

                        } else {
                            resultado = "";
                        }

                        return resultado;
                    }
                },
                {
                    "data": "Id", //Detalle
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (data != null) {
                            html = '<button value="' + full.Id + '" class="btn btn-secondary" onclick="PresupuestoItemAnticipoDetalle.AbrirModalDetalleAnticipos(' + data + ')">' +
                                'Detalle</button>';
                        }
                        return html;
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
                Utils._BuilderModal();

                $(".boton-desactivar-anticipo").bootstrapToggle({
                    on: '',
                    off: ''
                });
                //Tabla
                $("#tabla_anticipo").parent("div.col-sm-12").eq(0).css("overflow", "auto");
            }
        });

    },

    CambiarEstadoAnticipo: function (IdAnticipo) {
        PresupuestoItemAnticipoListar.ID_ANTICIPO = IdAnticipo;
        Utils._BuilderConfirmation('CANCELAR DESEMBOLSO ANTICIPO', '¿Está seguro que desea realizar esta acción?', PresupuestoItemAnticipoListar.CancelarDesembolsoAnticipo, PresupuestoItemAnticipoListar.RecargarTabla);
    },

    CancelarDesembolsoAnticipo: function () {

        var parameters = {
            AnticipoId: PresupuestoItemAnticipoListar.ID_ANTICIPO,
        };

        RequestHttp._Post(PresupuestoItemAnticipoListar.URL_CANCELAR_ANTICIPO_DESEMBOLSADO, parameters, null, function (data) {


            if (data != null) {
                if (data.state == true) {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    PresupuestoItemAnticipoListar.RecargarTabla();

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
        PresupuestoItemAnticipoListar.$TABLA.draw();
        return false;
    },

    /**
     * RecargarTablaPage
     */
    RecargarTablaPage: function () {
        PresupuestoItemAnticipoListar.$TABLA.draw("PAGE");
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
            PresupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
            VersionPresupuestoId: PresupuestoConsultar.VERSION_PRESUPUESTO_ID,
            ItemId: id,
            Estado: estado
        };

        RequestHttp._Post(PresupuestoItemAnticipoListar.URL_CAMBIAR_ESTADO_ANTICIPO, parameters, null, function (resultado) {

            if (resultado != null) {
                var tipoMensaje = (resultado.state == true) ? "success" : "danger";
                Utils._BuilderMessage(tipoMensaje, resultado.message);
                PresupuestoItemAnticipoListar.RecargarTabla();
            }
        });

    },

    /**
     * Filtrar tabla brief
     * @returns {boolean} 
     */
    RecargarTabla: function() {
        if (this.$TABLA != null) {
            this.$TABLA.draw();
        }
        return false;
    },

    AbrirModalDesembolsarAnticipos: function (id, presupuestoId, versionId) {
        var url = PresupuestoItemAnticipoListar.URL_PRESUPUESTO_DESEMBOLSAR_ANTICIPO + "/?presupuestoId=" + presupuestoId + "&versionPresupuestoId=" + versionId + "&itemId=" + id;
        console.log(url);
        Utils._OpenModal(url, PresupuestoItemAnticipoListar.OnLoadDesembolsarAnticipo, "lg");
    },

    OnLoadDesembolsarAnticipo: function () {
    },
}