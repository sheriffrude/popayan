var LegalizacionListar = {

    $TABLA_LEGALIZACION: null,

    /**
     * OnLoad
     */
    init: function () {
        LegalizacionListar.URL_PRESUPUESTO_LISTAR_LEGALIZACIONES = "/Produccion/Legalizacion/Listar";
        LegalizacionListar.ITEM_ID = 0;
        LegalizacionListar.ID_LEGALIZACION = 0;
        LegalizacionListar.URL_PRESUPUESTO_LEGALIZACION_DETALLE = '/Produccion/Legalizacion/Consultar';
        LegalizacionListar.URL_DETALLE_LEGALIZACION_ITEM = "/Produccion/Legalizacion/ListarItemDetalle";
        LegalizacionListar.URL_CREAR_VERSION_LEGALIZACION = "/Produccion/Legalizacion/CrearVersion";

        LegalizacionListar.CrearTabla();
        $("#form-filtro-tabla").submit(LegalizacionListar.RecargarTabla);
    },

    /**
     * CrearTabla
     */
    CrearTabla: function () {

        var $filtro = $("#input-filtro");

        LegalizacionListar.$TABLA_LEGALIZACION = $("#tabla-legalizaciones").DataTable({
            "scrollX": true,
            "bDestroy": true,
            "ajax": {
                "url": LegalizacionListar.URL_PRESUPUESTO_LISTAR_LEGALIZACIONES,
                "type": "POST",
                "data": function (d) {
                    d.Id = $("#PresupuestoId").val();
                    d.search["value"] = $filtro.val();
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
                    "data": "Version",
                    "render": function (data, type, full, meta) {

                        var html = '<label> Versión: ' + data + '</label>';

                        if (full.Estado == "Rechazado") {
                            html += '<button value="' + full.Id + '" class="btn btn-secondary" onclick="LegalizacionListar.AbrirModalCrearVersionLegalizacion(' + full.Id + ')">' +
                                '<i class="fa fa-plus" aria-hidden="true"></i> Crear versión </button>';
                        }

                        return html;
                    }
                },
                { "data": "Anticipo" },
                {
                    "data": "TotalLegalizado",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
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
                    "data": "Estado",
                    "render": function (data, type, full, meta) {
                        var html = '<label>' + data + '</label>';
                        var url = URL_JERARQUIA_APROBACION_LEGALIZACION_LISTAR + '/' + full.Id;

                        if (PERMISO_APROBACION_LEGALIZACION) {
                            if (data != null) {
                                if ((full.Estado != "Registrado") && (full.Estado != "Cancelado")) {
                                    html += '<a href="' + url + '" class="btn btn-secondary" data-size="lg" data-toggle="modal" data-target="#" data-execute-onload="AprobacionLegalizacionListarJerarquia.Onload" >Ver Jerarquía</a>';
                                }
                            }
                        }
                        return html;
                    }
                },
                { "data": "FechaRegistro" },
                { "data": "UsuarioRegistro" },
                {
                    "data": "Id", // Solicitar aprobación legalizacion
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (PERMISO_APROBACION_LEGALIZACION) {
                            if (data != null) {
                                if (full.Estado == "Registrado") {
                                    html = '<a href="' + URL_APROBACION_LEGALIZACION + '?id=' + full.PresupuestoId + '&legalizacionId=' + data + '"  data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" > <i class="fa fa-share-square-o" aria-hidden="true"></i> Solicitar aprobación</a>'
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

                        if (data == "Registrado") {
                            var checked = "checked";
                            resultado = '<div class="text-center"><input type="checkbox" ' + checked + ' class="boton-desactivar-legalizacion btn-sm" onchange="LegalizacionListar.CambiarEstado( this)" data-toggle="toggle"  data-size="mini" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '"> </div>';
                        } else if (data == "Cancelado") {
                            resultado = "";
                            resultado = '<div class="text-center"><input type="checkbox" ' + checked + ' class="boton-desactivar-legalizacion btn-sm" onchange="LegalizacionListar.CambiarEstado(this)" data-toggle="toggle"  data-size="mini" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '"> </div>';
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
                        if (PERMISO_CONSULTAR_DETALLE_LEGALIZACION) {
                            if (data != null) {
                                html = '<button value="' + full.Id + '" class="btn btn-secondary" onclick="LegalizacionListar.AbrirModalDetalleLegalizacion(' + data + ')">' +
                                    'Ver detalle</button>';
                            }
                        }
                        return html;
                    }
                },
                {
                    "data": "Estado", // Editar legalización
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = "";
                        if (data == "Registrado") {

                            if (PERMISO_CONSULTAR_DETALLE_LEGALIZACION) {
                                if (data != null) {
                                    if (full.Estado == "Registrado") {
                                        html = '<a href="' + URL_CONSULTAR_ITEMS_EDITAR_LEGALIZACION + '?idPresupuesto=' + full.PresupuestoId + '&idLegalizacion=' + full.Id + '&idAnticipo=' + full.Anticipo + '"  class="btn btn-secondary btn-sm" > <i class="fa fa-edit" aria-hidden="true"></i> Editar</a>'
                                    }
                                }
                            }
                        }
                        else {
                            html = "";
                        }
                        return html;
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
                Utils._BuilderModal();
                $(".boton-desactivar-legalizacion").bootstrapToggle({
                    on: '',
                    off: ''
                });
                //Tabla
                $("#tabla-legalizaciones").parent("div.col-sm-12").eq(0).css("overflow", "auto");
            },
            "order": [[1, "desc"]]
        });

    },

    AbrirModalCrearVersionLegalizacion: function (LegalizacionId) {
        LegalizacionListar.ID_LEGALIZACION = LegalizacionId;
        Utils._BuilderConfirmation('CREAR VERSIÓN DE LEGALIZACIÓN', '¿Está seguro que desea realizar esta acción?', LegalizacionListar.CrearVersionLegalizacion, LegalizacionListar.RecargarTabla);
    },


    CrearVersionLegalizacion: function () {

        var parameters = {
            LegalizacionId: LegalizacionListar.ID_LEGALIZACION,
        };

        RequestHttp._Post(LegalizacionListar.URL_CREAR_VERSION_LEGALIZACION, parameters, null, function (data) {

            if (data != null) {
                if (data.state == true) {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    LegalizacionListar.RecargarTabla();

                } else {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                }
            }

        })
    },



    /**
     * ResetearTabla
    */
    ResetearTabla: function () {
        $("#input-filtro").val("");
        LegalizacionListar.reconstruirTabla();
    },

    /**
     * reconstruirTabla
     */
    reconstruirTabla: function () {
        LegalizacionListar.$TABLA_LEGALIZACION.draw();
    },

    /**
     * RecargarTabla
     */
    RecargarTabla: function () {
        if (LegalizacionListar.$TABLA_LEGALIZACION != null) {
            LegalizacionListar.$TABLA_LEGALIZACION.draw();
        }
        return false;
    },

    /**
     * AbrirModalDetalleAnticipos
     */
    AbrirModalDetalleLegalizacion: function (id) {
        LegalizacionListar.ITEM_ID = id;
        var url = LegalizacionListar.URL_PRESUPUESTO_LEGALIZACION_DETALLE + "/?legalizacionId=" + id;
        Utils._OpenModal(url, LegalizacionListar.CargarDatosModal, "all");
    },

    /**
     * CargarDatosModal
     */
    CargarDatosModal: function () {
        LegalizacionListar.CrearTablaDetalle();
    },

    /**
     * CrearTablaDetalle
     */
    CrearTablaDetalle: function () {

        var $filtro = $("#input_filtro_listar_anticipos");

        this.$TABLA = $("#tabla_legalizacion_detalle").DataTable({
            "scrollX": true,
            "bDestroy": true,
            "ajax": {
                "url": LegalizacionListar.URL_DETALLE_LEGALIZACION_ITEM,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = $filtro.val();
                    d.legalizacionId = LegalizacionListar.ITEM_ID;

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
                { "data": "NumeroFactura" },
                { "data": "Concepto" },
                { "data": "FechaFactura" },
                { "data": "Nit" },
                { "data": "Beneficiario" },
                { "data": "Direccion" },
                { "data": "Telefono" },
                { "data": "Ciudad" },
                {
                    "data": "Valor",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "Impuestos",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "Total",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "Adjunto",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '';
                        if (data == "") {
                            html = 'Sin registro';
                        } else {
                            html = '<a class="btn btn-secondary" href="' + data + '" >Descargar adjunto</a>';
                        }
                        return html;
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
                Utils._BuilderModal();
                $("#tabla_legalizacion_detalle").parent("div.col-sm-12").eq(0).css("overflow", "auto");
            }
        });
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
    },

    /**
     * CambiarEstado
     * @param {any} e
    */
    CambiarEstado: function (e) {

        var estado = ($(e).is(":checked") == true);
        var id = $(e).val();

        var parameters = {
            LegalizacionId: id,
            Estado: estado
        };

        RequestHttp._Post(URL_CAMBIAR_ESTADO_LEGALIZACION, parameters, null, function (resultado) {
            if (resultado != null) {
                var tipoMensaje = (resultado.state == true) ? "success" : "danger";
                Utils._BuilderMessage(tipoMensaje, resultado.message);
                LegalizacionListar.RecargarTabla();
            }
        });
    },

    DescargarInforme: function () {
        var legalizacionId = $("#LegalizacionId").val();
        var parameters = {
            LegalizacionId: legalizacionId,
        };
        ReportsP._OpenTab("PDF", "Produccion/Legalizacion/Legalizacion.trdp", parameters);
    },

}

$(function () {
    LegalizacionListar.init();
});
