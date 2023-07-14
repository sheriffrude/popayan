var AnticipoListar = {

        PRESUPUESTO_ID: null,
        VERSION_PRESUPUESTO_ID: null,
        ITEM_ID: null,
        $TABLA_ANTICIPO: null,

        /**
         * OnLoad
         */
        init: function () {
            AnticipoListar.PRESUPUESTO_ID = 0;
            AnticipoListar.VERSION_PRESUPUESTO_ID = 0;
            AnticipoListar.ITEM_ID = 0;
            AnticipoListar.URL_PRESUPUESTO_ANTICIPOS_DETALLE = '/Produccion/PresupuestoItemAnticipo/Consultar';
            AnticipoListar.URL_DETALLE_ANTICIPO_ITEM = "/Produccion/PresupuestoItemAnticipo/ListarItemAnticiposDetalle";
            AnticipoListar.URL_PRESUPUESTO_LISTAR_ANTICIPOS = "/Produccion/Anticipo/Listar";
            AnticipoListar.URL_PRESUPUESTO_DESEMBOLSAR_ANTICIPO = "/Produccion/Anticipo/Crear";
            AnticipoListar.CrearTabla();
            $("#form-filtro-tabla").submit(AnticipoListar.RecargarTabla);
        },

        /**
         * CrearTabla
         */
        CrearTabla: function () {

            var $filtro = $("#input-filtro");

            AnticipoListar.$TABLA_ANTICIPO = $("#tabla-anticipo").DataTable({
                "scrollX": true,
                "bDestroy": true,
                "ajax": {
                    "url": AnticipoListar.URL_PRESUPUESTO_LISTAR_ANTICIPOS,
                    "type": "POST",
                    "data": function (d) {
                        d.search["value"] = $filtro.val();
                        d.estadoAnticipoId = $("#EstadoAnticipoId").val();

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
                    {
                        "data": "Id", //Desembolsar anticpo
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var html = "";
                            if (PERMISO_DESEMBOLSAR_ANTICIPO) {
                                if (data != null) {
                                    if (full.Estado == "Aprobado") {
                                        html = '<button value="' + full.Id + '" class="btn btn-secondary" onclick="AnticipoListar.AbrirModalDesembolsarAnticipos(' + data + "," + full.PresupuestoId + "," + full.VersionPresupuesto + ')">' +
                                            '<i class="fa fa-money" aria-hidden="true"></i>  Desembolsar</button>';
                                    }
                                }
                            }
                            return html;
                        }
                    },
                    {
                        "data": "Id", //Detalle
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var html = "";
                            if (data != null) {
                                html = '<button value="' + full.Id + '" class="btn btn-secondary" onclick="AnticipoListar.AbrirModalDetalleAnticipos(' + data + "," + full.PresupuestoId + "," + full.VersionPresupuesto + ')">' +
                                    'Detalle anticipo</button>';
                            }
                            return html;
                        }
                    },
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
                        "render": function (data, type, full, meta) {
                            var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                            return html;
                        }
                    },
                    {
                        "data": "TotalDesembolsado",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                            return html;
                        }
                    },
                    {
                        "data": "TotalLegalizado",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                            return html;
                        }
                    },

                    { "data": "PresupuestoId" },
                    { "data": "VersionPresupuesto" },
                    {
                        "data": "UsuarioRegistro",
                    },
                    { "data": "RazonSolicitud" },
                    { "data": "FechaRegistro" },
                    { "data": "FechaAnticipo" },
                    { "data": "FechaLegalizacionAnticipo" },
                    { "data": "FormaPago" },
                    {
                        "data": "Id", // Solicitar aprobación anticpo
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var html = "";
                            if (PERMISO_APROBACION_ANTICIPO) {
                                if (data != null) {
                                    if (full.Estado == "Registrado") {
                                        html = '<a href="' + URL_APROBACION_ANTICIPO + '?id=' + full.PresupuestoId + '&anticipoId=' + data + '"  data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" > <i class="fa fa-share-square-o" aria-hidden="true"></i> Solicitar aprobación</a>'
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
                    //Tabla
                    $("#tabla-anticipo").parent("div.col-sm-12").eq(0).css("overflow", "auto");
                },
                "order": [[1, "desc"]]
            });
        },

        /**
         * ResetearTabla
        */
        ResetearTabla: function () {
            $("#input-filtro").val("");
            AnticipoListar.reconstruirTabla();
        },

        /**
         * reconstruirTabla
         */
        reconstruirTabla: function () {
            AnticipoListar.$TABLA_ANTICIPO.draw();
        },

        /**
         * RecargarTabla
         */
        RecargarTabla: function () {
            if (AnticipoListar.$TABLA_ANTICIPO != null) {
                AnticipoListar.$TABLA_ANTICIPO.draw();
            }
            return false;
        },

        /**
         * AbrirModalDetalleAnticipos
         */
        AbrirModalDetalleAnticipos: function (id, presupuestoId, versionId) {
            AnticipoListar.PRESUPUESTO_ID = presupuestoId;
            AnticipoListar.VERSION_PRESUPUESTO_ID = versionId;
            AnticipoListar.ITEM_ID = id;
            var url = AnticipoListar.URL_PRESUPUESTO_ANTICIPOS_DETALLE + "/?presupuestoId=" + presupuestoId + "&versionPresupuestoId=" + versionId + "&itemId=" + id;
            Utils._OpenModal(url, AnticipoListar.CargarDatosModal, "lg");
        },

        /**
         * CargarDatosModal
         */
        CargarDatosModal: function () {            
            AnticipoListar.CrearTablaDetalle();
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
                    "url": AnticipoListar.URL_DETALLE_ANTICIPO_ITEM,
                    "type": "POST",
                    "data": function (d) {
                        d.search["value"] = $filtro.val();
                        d.presupuestoId = AnticipoListar.PRESUPUESTO_ID;
                        d.versionPresupuestoId = AnticipoListar.VERSION_PRESUPUESTO_ID;
                        d.itemId = AnticipoListar.ITEM_ID;

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
                ],
                "drawCallback": function (settings) {
                    Utils._InputFormatPrice();
                    Utils._BuilderModal();
                    $("#tabla_anticipo").parent("div.col-sm-12").eq(0).css("overflow", "auto");
                }
            });
        },

        AbrirModalDesembolsarAnticipos: function (id, presupuestoId, versionId) {

            var url = AnticipoListar.URL_PRESUPUESTO_DESEMBOLSAR_ANTICIPO + "/?presupuestoId=" + presupuestoId + "&versionPresupuestoId=" + versionId + "&itemId=" + id;
            Utils._OpenModal(url, AnticipoListar.OnLoadDesembolsarAnticipo, "lg");
        },

        OnLoadDesembolsarAnticipo: function () {
        },

        /**
         * OnBeginCrearAnticipo
         * @param {any} jqXHR
         * @param {any} settings
        */
        OnBeginCrear: function (jqXHR, settings) {
            var data = $(this).serializeObject();
            settings.data = jQuery.param(data);
            return true;
        },

        OnSuccessCrear: function (resultado) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success";
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
            Utils._CloseModal();
            AnticipoListar.RecargarTabla();
        }
}

$(function () {
    AnticipoListar.init();
});
