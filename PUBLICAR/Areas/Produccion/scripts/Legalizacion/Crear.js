Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) === -1;
    });
};
var LegalizacionCrear = {

    PRESUPUESTO_ID: null,
    VERSION_PRESUPUESTO_ID: null,
    ITEM_ID: null,
    $TABLA_ANTICIPO: null,
    $TABLA_DATOS_LEGALIZACION: null,
    ANTICIPO: [],
    LISTA_OPCIONES_IMPUESTOS: [],
    FILEGUARDAR: [],
    arrayList: [],
    arrayItems: [],


    /**
     * OnLoad
     */
    init: function () {
        $.datepicker.setDefaults($.datepicker.regional["es"]);
        $("#FechaFactura").datepicker({
            dateFormat: 'dd/mm/yy',
            firstDay: 1
        }).datepicker("setDate", new Date()).val('');
        Utils._InputFormatPrice();
        LegalizacionCrear.URL_LISTAR_MIS_ANTICIPOS = "/Produccion/Legalizacion/ListarAnticipos";
        LegalizacionCrear.URL_PRESUPUESTO_ANTICIPOS_DETALLE = '/Produccion/PresupuestoItemAnticipo/Consultar';
        LegalizacionCrear.URL_DETALLE_ANTICIPO_ITEM = "/Produccion/PresupuestoItemAnticipo/ListarItemAnticiposDetalle";
        LegalizacionCrear.URL_LISTAR_IMPUESTOS_EMPRESA = "/Produccion/Legalizacion/ListarOpcionesPorEmpresa";
        LegalizacionCrear.URL_UPLOAD = "/Produccion/FacturaProveedor/CrearUpload";
        LegalizacionCrear.DATA_LEGALIZACION = [];
        LegalizacionCrear.CONTADOR = 0;
    },

    /**
     * OnLoadLegalizacion
     */
    OnLoadLegalizacion: function () {

        LegalizacionCrear.$TABLA_ANTICIPO = $("#tabla-mis-anticipos").DataTable({
            "scrollX": true,
            "bDestroy": true,
            "ajax": {
                "url": LegalizacionCrear.URL_LISTAR_MIS_ANTICIPOS,
                "type": "POST",
                "data": function (d) {
                    d.presupuestoId = $("#PresupuestoId").val();
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                }
            },
            "columns": [
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return '<div class="container-radio">' +
                            '<input type="radio" name="btn_radio_anticipo" id="btn_radio_anticipo_' + data + '" value="' + data + '" onclick="LegalizacionCrear.SeleccionarItem(' + data + ')">' +
                            '<label for="btn_radio_anticipo_' + data + '"></label>' +
                            '</div>';
                    }
                },
                { "data": "Id" },
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
                { "data": "Estado" },
                {
                    "data": "TotalAnticipo",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control input_anticipo" data-format-price="" data-item-anticipo-id="' + full.Id + '" value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "TotalDesembolsado",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control input_desembolsado" data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "TotalLegalizado",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control input_legalizado" data-format-price="" data-item-legalizado-id="' + full.Id + '" value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
                {
                    "data": "TotalLegalizadoAprobado",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        var html = '<input type="text" class="form-control input_aprobado"  data-format-price value="' + data + '" disabled="disabled" />';
                        return html;
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
                Utils._BuilderModal();
                //Tabla
                $("#tabla-anticipo").parent("div.col-sm-12").eq(0).css("overflow", "auto");


                $.datepicker.setDefaults($.datepicker.regional["es"]);
                $("#FechaFactura").datepicker({
                    dateFormat: 'dd/mm/yy',
                    firstDay: 1
                }).datepicker("setDate", new Date()).val('');

                Utils._InputFormatPrice();

            }
        });
    },

    //Impuesto Manual
    ImpuestoManualLegalizacion: function () {
        //$("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").prop('readonly', false));
        //$('#inputId').prop('readonly', true); data-check-manual-id="' + full.Id .checked
        //alert($(este).attr('checked')); $("#dataPicker").selectpicker("refresh"); impuesto $("#dataPicker option:selected").val('default');
        //alert(este.checked);

        if ($(Manual).is(':checked')) {
            $(TotalImpuestos).prop('readonly', false);
            //alert($("#impuesto" + id + "" + " option:selected"));
            $(ImpuestoId).selectpicker('deselectAll');
            $(ImpuestoId).prop('disabled', true);
            $(ImpuestoId).selectpicker('refresh');
            $(ImpuestoId).removeAttr("selected");
            //alert("check");
        }
        else {
            $(TotalImpuestos).val('')
            $(TotalImpuestos).prop('readonly', true);
            $(ImpuestoId).prop('disabled', false);
            $(ImpuestoId).selectpicker('refresh');
            //alert('no check');
        }
    },

    /**
     * ResetearTabla
    */
    ResetearTabla: function () {
        $("#input-filtro").val("");
        LegalizacionCrear.reconstruirTabla();
    },

    /**
     * reconstruirTabla
     */
    reconstruirTabla: function () {
        LegalizacionCrear.$TABLA_ANTICIPO.draw();
    },

    /**
     * RecargarTabla
     */
    RecargarTabla: function () {
        if (LegalizacionCrear.$TABLA_ANTICIPO != null) {
            LegalizacionCrear.$TABLA_ANTICIPO.draw();
        }
        return false;
    },

    /**
     * SeleccionarItem
     */
    SeleccionarItem: function (id) {
        LegalizacionCrear.ANTICIPO = [];
        LegalizacionCrear.ANTICIPO.push(id);

        var parametros = {
            idAnticipo: id
        }

        RequestHttp._Post(LegalizacionCrear.URL_LISTAR_IMPUESTOS_EMPRESA, parametros, null, function (response) {

            if (response != null) {
                if (response.state == true) {
                    LegalizacionCrear.LISTA_OPCIONES_IMPUESTOS = response.data;
                    $(".select_impuestos_item_asociado").each(function () {
                        $('#ImpuestoId').append($('<option>', {
                            value: 0,
                            text: 'Seleccione'
                        }));

                        valoresPorDefecto = null;
                        Utils._LoadDataToDropDownListMultiple($(this), LegalizacionCrear.LISTA_OPCIONES_IMPUESTOS, valoresPorDefecto);
                    });

                    $('#ImpuestoId').append($('<option>', {
                        value: 0,
                        text: 'Seleccione'
                    }));

                }
                else
                    Utils._BuilderMessage("danger", response.message);
            }

            $(".select_impuestos_item_asociado").val(0);
        })
    },

    OnChangeItem: function () {
        var valorTotal = parseInt($("#ValorItem").formatPriceGetVal()) + parseInt($("#TotalImpuestos").formatPriceGetVal());
        $("#Total").val(valorTotal);
    },

    OnChangeImpuesto: function (e, url) {

        var impuestoId = $(e).val();
        var $textBox = $("#TotalImpuestos");

        if (impuestoId == 0 || impuestoId == null || impuestoId == "") {
            $textBox.val(0);
            $("#Total").val(parseInt($("#ValorItem").formatPriceGetVal()));
            return false;
        }

        if (LegalizacionCrear.ANTICIPO == 0) {
            Utils._BuilderMessage("danger", "Debe seleccionar el anticipo a legalizar.");
            return false;
        }

        var parameters = {
            anticipoId: LegalizacionCrear.ANTICIPO[0],
            impuestoId: impuestoId,
        };

        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: parameters,
            success: function (data, text) {
                var porcentaje = data.data[0].Porcentaje;
                var impuesto = (parseInt($("#ValorItem").formatPriceGetVal()) * porcentaje) / 100;
                $textBox.val(Math.round(impuesto));
                var valorTotal = parseInt($("#ValorItem").formatPriceGetVal()) + parseInt($("#TotalImpuestos").formatPriceGetVal());
                $("#Total").val(Math.round(valorTotal));
                $("#Porcentaje").val(porcentaje);
            },
            error: function (request, status, error) {
                Utils._BuilderMessage("danger", error);
            }
        });


        return false;
    },

    //Evento para calcular las retenciones
    OnChangeImpuestoRetenciones: function (e, url) {

        var retenciones = $(e).val();
        var $textRetencion = $("#Retencion");

        if (retenciones == 0 || retenciones == null || retenciones == "") {
            $textRetencion.val(0);
            LegalizacionCrear.arrayList = [];
            LegalizacionCrear.arrayItems = [];
            $("#Total").val(parseFloat($("#ValorItem").formatPriceGetVal()));
            return false;
        }

        if (LegalizacionCrear.ANTICIPO == 0) {
            Utils._BuilderMessage("danger", "Debe seleccionar el anticipo a legalizar.");
            return false;
        }

        var xy = 0;
        if (LegalizacionCrear.arrayItems.length > retenciones.length) {

            xy = LegalizacionCrear.arrayItems.diff(retenciones)[0];

        }


        var newItem = 0;
        if (retenciones.length > LegalizacionCrear.arrayItems.length) {

            newItem = retenciones.diff(LegalizacionCrear.arrayItems)[0];

        }

        LegalizacionCrear.arrayItems = retenciones;

        var parameters;

        if (xy == 0) {
            parameters = {
                anticipoId: LegalizacionCrear.ANTICIPO[0],
                retenciones: newItem,
            };
        } else {
            parameters = {
                anticipoId: LegalizacionCrear.ANTICIPO[0],
                retenciones: xy,
            };
        }


        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: parameters,
            success: function (data, text) {

                if (xy == 0) {
                    LegalizacionCrear.arrayList.push(data);
                } else {
                    toDelete = null;
                    $.each(LegalizacionCrear.arrayList, function (key, value) {


                        if (value.data[0].Id == data.data[0].Id) {

                            toDelete = key;

                        }
                    });
                    LegalizacionCrear.arrayList.splice(toDelete, 1);

                }

                var x = 0;
                for (var i = 0; i < LegalizacionCrear.arrayList.length; i++) {
                    var auxPorcentaje = LegalizacionCrear.arrayList[i].data[0].Value;
                    x += parseFloat(auxPorcentaje.toString().replace(/,/g, '.'));
                }

                $textRetencion.val(Math.round(0));

                var retencion = (parseFloat($("#ValorItem").formatPriceGetVal()) * x) / 100;
                $textRetencion.val(Math.round(retencion));

                var valorTotal = (parseFloat($("#ValorItem").formatPriceGetVal()) + parseFloat($("#TotalImpuestos").formatPriceGetVal())) - parseFloat($("#Retencion").formatPriceGetVal());
                $("#Total").val(Math.round(valorTotal));


            },
            error: function (request, status, error) {
                Utils._BuilderMessage("danger", error);
            }
        });
        return false;
    },

    //

    OnChangePais: function (e, urlDepartamentos, urlCajasCompensacion) {
        var paisId = $(e).val();
        if (paisId > 0) {
            var parameters = {
                id: paisId
            };
            var $elementListDepartamentos = $("#DepartamentoId");
            Utils._GetDataDropDownList($elementListDepartamentos, urlDepartamentos, parameters);

            var $elementListCajasCompensacion = $("#CajaCompensacionId");
            Utils._GetDataDropDownList($elementListCajasCompensacion, urlCajasCompensacion, parameters);
        }
    },


    OnChangeDepartamento: function (e, url) {
        var deptoId = $(e).val();
        if (deptoId > 0) {
            var parameters = {
                id: deptoId
            };
            var $elementList = $("#CiudadId");
            Utils._GetDataDropDownList($elementList, url, parameters);
        }
    },

    AdicionarItem: function () {

        let formatos = ['D/M/YYYY', 'D-M-YYYY'];

        var Concepto = $('#Concepto').val();
        var ValorItem = $('#ValorItem').val();
        var TotalImpuestos = $('#TotalImpuestos').val();
        var Total = $('#Total').val();
        var FechaFactura = $('#FechaFactura').val();
        var NumeroFactura = $('#NumeroFactura').val();
        var Nit = $('#Nit').val();
        var Beneficiario = $('#Beneficiario').val();
        var Telefono = $('#Telefono').val();
        var PaisId = $('#PaisId').val();
        var DepartamentoId = $('#DepartamentoId').val();
        var CiudadId = $('#CiudadId').val();
        var Ciudad = $("#CiudadId option:selected").html();
        var Direccion = $('#Direccion').val();
        var ImpuestoId = $('#ImpuestoId').val();
        var Retencion = ($('#Retencion').val());

        var Porcentaje = $('#Porcentaje').val();

        // Consultar el valor total del item
        var totalAnticipo = parseFloat($("input.input_anticipo[data-item-anticipo-id='" + LegalizacionCrear.ANTICIPO[0] + "']").formatPriceGetVal());

        var totalLegalizado = parseFloat($("input.input_legalizado[data-item-legalizado-id='" + LegalizacionCrear.ANTICIPO[0] + "']").formatPriceGetVal());

        if (!Validations._Requerido(Concepto)) {
            Utils._BuilderMessage("danger", "El concepto es obligatorio.");
            return false;
        }
        if (!Validations._Requerido(ValorItem)) {
            Utils._BuilderMessage("danger", "El valor del item es obligatorio.");
            return false;
        }
        if (!moment(FechaFactura, formatos, true).isValid()) {
            Utils._BuilderMessage("danger", "La fecha no está en un formato correcto.");
            return false;
        }

        if (!Validations._Requerido(FechaFactura)) {
            Utils._BuilderMessage("danger", "La fecha de la factura es obligatoria.");
            return false;
        }

        if (!Validations._Requerido(NumeroFactura)) {
            Utils._BuilderMessage("danger", "El numero de la factura es obligatorio.");
            return false;
        }
        if (!Validations._Requerido(Nit)) {
            Utils._BuilderMessage("danger", "El NIT es obligatorio.");
            return false;
        }
        if (!Validations._Requerido(Beneficiario)) {
            Utils._BuilderMessage("danger", "El beneficiario es obligatorio.");
            return false;
        }
        if (!Validations._Requerido(Telefono)) {
            Utils._BuilderMessage("danger", "El teléfono es obligatorio.");
            return false;
        }

        if (!Validations._Requerido(PaisId)) {
            Utils._BuilderMessage("danger", "El país es obligatorio.");
            return false;
        }
        if (!Validations._Requerido(DepartamentoId)) {
            Utils._BuilderMessage("danger", "El departamento es obligatorio.");
            return false;
        }
        if (!Validations._Requerido(CiudadId)) {
            Utils._BuilderMessage("danger", "La ciudad es obligatoria.");
            return false;
        }


        if (!Validations._Requerido(Direccion)) {
            Utils._BuilderMessage("danger", "La dirección es obligatoria.");
            return false;
        }

        $('#tabla-datos-legalizacion').removeClass("hidden");
        var tamano = LegalizacionCrear.DATA_LEGALIZACION.length;
        var valorTotal = parseInt($("#ValorFacturaSinIva").formatPriceGetVal()) + parseInt($("#ValorIvaFactura").formatPriceGetVal());
        LegalizacionCrear.CONTADOR = LegalizacionCrear.CONTADOR + 1;

        var objectData = {
            "Id": LegalizacionCrear.CONTADOR,
            "Anticipo": LegalizacionCrear.ANTICIPO[0],
            "Concepto": Concepto,
            "ValorItem": ValorItem,
            "TotalImpuestos": TotalImpuestos,
            "ImpuestoId": ImpuestoId,
            "Total": Total,
            "FechaFactura": FechaFactura,
            "NumeroFactura": NumeroFactura,
            "Nit": Nit,
            "Beneficiario": Beneficiario,
            "Telefono": Telefono,
            "Direccion": Direccion,
            "Ciudad": Ciudad,
            "Adjuntos": LegalizacionCrear.FILEGUARDAR,
            "Porcentaje": Porcentaje,
            "Retencion": Retencion
        };

        if (totalLegalizado == (totalAnticipo + (totalAnticipo * 0.2))) {
            Utils._BuilderMessage("danger", "Ya se legalizó el total de este anticipo");
            return false;
        }

        if (parseInt(Total) > (totalAnticipo + ((totalAnticipo * 20) / 100))) {
            Utils._BuilderMessage("danger", "No se puede legalizar un valor superior al total del anticipo");
            return false;
        }

        if ((totalLegalizado + parseInt(Total)) > (totalAnticipo + ((totalAnticipo * 20) / 100))) {
            Utils._BuilderMessage("danger", "No se puede legalizar un valor superior al total del anticipo");
            return false;
        }

        var totalALegalizar = 0;
        for (var i = 0; i < tamano; i++) {
            if (LegalizacionCrear.DATA_LEGALIZACION[i].Anticipo == LegalizacionCrear.ANTICIPO[0]) {
                totalALegalizar = parseInt(LegalizacionCrear.DATA_LEGALIZACION[i].Total) + parseInt(Total);

                if (totalALegalizar > (totalAnticipo + ((totalAnticipo * 20) / 100))) {
                    Utils._BuilderMessage("danger", "No se puede legalizar un valor superior al total del anticipo");
                    return false;
                }
            }

        }

        LegalizacionCrear.DATA_LEGALIZACION.push(objectData);
        LegalizacionCrear.RecargarTablaDatosLegalizacion();
        $("#Concepto").val("");
        $("#ValorItem").val("");
        $("#Total").val("0");
        $("#TotalImpuestos").val("0");
        $("#FechaFactura").val("");
        $("#NumeroFactura").val("");
        $("#Nit").val("");
        $("#Beneficiario").val("");
        $("#Telefono").val("");
        $("#Direccion").val("");
        $("#Porcentaje").val("");
        $("#Retencion").val("");
       

        LegalizacionCrear.FILEGUARDAR = [];
    },

    /**
     * Recarga la tabla telefonos
     */
    RecargarTablaDatosLegalizacion: function () {
        var tamano = LegalizacionCrear.DATA_LEGALIZACION.length;
        for (var i = 0; i < tamano; i++) {
            LegalizacionCrear.DATA_LEGALIZACION[i]["id"] = i;
        }
        if (LegalizacionCrear.$TABLA_DATOS_LEGALIZACION != null) {
            LegalizacionCrear.$TABLA_DATOS_LEGALIZACION.fnDestroy();
        }
        LegalizacionCrear.ConstruirTablaDatosLegalizacion();
    },

    /**
     * Construye la tabla 
     */
    ConstruirTablaDatosLegalizacion: function () {

        LegalizacionCrear.$TABLA_DATOS_LEGALIZACION = $("#tabla-datos-legalizacion").dataTable({

            "destroy": true,
            "serverSide": false,
            "info": false,
            "data": LegalizacionCrear.DATA_LEGALIZACION,
            "columns": [

                {
                    "data": "Id",
                    "orderable": false,
                },
                {
                    "data": "Anticipo",
                    "orderable": false,
                },
                {
                    "data": "Concepto",
                    "orderable": false,
                },
                {
                    "data": "Nit",
                    "orderable": false,
                },
                {
                    "data": "Beneficiario",
                    "orderable": false,
                },
                {
                    "data": "Telefono",
                    "orderable": false,
                },
                {
                    "data": "Direccion",
                    "orderable": false,
                },
                {
                    "data": "FechaFactura",
                    "orderable": false,
                },
                {
                    "data": "NumeroFactura",
                    "orderable": false,
                },
                {
                    "data": "ValorItem",
                    "orderable": false,
                },
                {
                    "data": "TotalImpuestos",
                    "width": "15%",
                    "orderable": false,
                },
                {
                    "data": "Total",
                    "width": "15%",
                    "orderable": false,
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<input type="hidden" name="listaLegalizaciones" value="' + full.Id + '" />';
                        html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="LegalizacionCrear.EliminarRegistro(' + data + ')" />';
                        return html;
                    }
                }
            ],

            "footerCallback": function (row, data, start, end, display) {


                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };

                // Total over all pages
                totalItem = api.column(9).data().reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

                totalImpuestos = api.column(10).data().reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

                total = api.column(11).data().reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);


                // Update footer
                $(api.column(9).footer()).html(
                    '$ ' + formatNumber.new(totalItem)
                );

                $(api.column(10).footer()).html(
                    '$ ' + formatNumber.new(totalImpuestos)
                );

                $(api.column(11).footer()).html(
                    '$ ' + formatNumber.new(total)
                );

            },
            "pageLength": 20
        });
    },

    EliminarRegistro: function (id) {

        var longitudData = LegalizacionCrear.DATA_LEGALIZACION.length;

        for (var i = 0; longitudData > i; i++) {
            if (LegalizacionCrear.DATA_LEGALIZACION[i]["Id"] == id) {
                LegalizacionCrear.DATA_LEGALIZACION.splice(i, 1);
                break;
            }
        }


        LegalizacionCrear.ConstruirTablaDatosLegalizacion();
    },

    /**
     * OnBeginCrearAnticipo
     * @param {any} jqXHR
     * @param {any} settings
    */
    OnBeginCrear: function (jqXHR, settings) {

        var data = $(this).serializeObject();
        var tamano = LegalizacionCrear.DATA_LEGALIZACION.length;

        if (tamano == 0) {
            Utils._BuilderMessage("danger", "Debe adicionar al menos un item para guardar la legalización");
            return false;
        }

        data["AnticipoId"] = LegalizacionCrear.ANTICIPO[0];
        data["ValorItem"] = 0;
        data["TotalImpuestos"] = 0;
        data["Total"] = 0;
        data["Legalizaciones"] = LegalizacionCrear.DATA_LEGALIZACION;
        settings.data = jQuery.param(data);
        return true;
    },

    OnSuccessCrear: function (resultado) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success";
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message + resultado.data);
        Utils._CloseModal();
        LegalizacionListar.RecargarTabla();
    },

    UploadFileFactura: function (e) {
        RequestHttp._UploadFile(e, LegalizacionCrear.URL_UPLOAD, function (result) {
            if (result != null) {
                LegalizacionCrear.FILEGUARDAR = {
                    'OriginalName': result.OriginalName,
                    'Name': result.Name,
                    'Path': result.Path,
                    'Url': result.Url,
                    'Type': result.Type,
                    'Size': result.Size,
                };
            }
        });
    },

}


$(function () {
    LegalizacionCrear.init();
});


