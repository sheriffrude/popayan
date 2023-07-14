var LegalizacionCrearItem = {

    PRESUPUESTO_ID: null,
    VERSION_PRESUPUESTO_ID: null,
    ITEM_ID: null,
    $TABLA_ANTICIPO: null,
    $TABLA_DATOS_LEGALIZACION: null,
    ANTICIPO: [],
    LISTA_OPCIONES_IMPUESTOS: [],
    FILEGUARDAR: [],

    /**
     * OnLoad
     */
    init: function () {
        LegalizacionCrearItem.URL_LISTAR_MIS_ANTICIPOS = "/Produccion/Legalizacion/ListarAnticipos";
        LegalizacionCrearItem.URL_PRESUPUESTO_ANTICIPOS_DETALLE = '/Produccion/PresupuestoItemAnticipo/Consultar';
        LegalizacionCrearItem.URL_DETALLE_ANTICIPO_ITEM = "/Produccion/PresupuestoItemAnticipo/ListarItemAnticiposDetalle";
        LegalizacionCrearItem.URL_LISTAR_IMPUESTOS_EMPRESA = "/Produccion/Legalizacion/ListarOpcionesPorEmpresa";
        LegalizacionCrearItem.URL_UPLOAD = "/Produccion/FacturaProveedor/CrearUpload";
        LegalizacionCrearItem.DATA_LEGALIZACION = [];
        LegalizacionCrearItem.CONTADOR = 0;
    },

    OnChangeItem: function () {
        var valorTotal = parseInt($("#ValorItem").formatPriceGetVal()) + parseInt($("#TotalImpuestos").formatPriceGetVal());
        $("#Total").val(valorTotal);
    },

    /**
     * OnLoadLegalizacion
     */
    OnLoadLegalizacion: function () {

        LegalizacionCrearItem.ANTICIPO = [];
        LegalizacionCrearItem.ANTICIPO.push($("#IdAnticipo").val());

        var parametros = {
            idAnticipo: $("#IdAnticipo").val()
        }

        RequestHttp._Post(LegalizacionCrearItem.URL_LISTAR_IMPUESTOS_EMPRESA, parametros, null, function (response) {

            if (response != null) {
                if (response.state == true) {
                    LegalizacionCrearItem.LISTA_OPCIONES_IMPUESTOS = response.data;
                    $(".select_impuestos_item_asociado").each(function () {
                        $('#ImpuestoId').append($('<option>', {
                            value: 0,
                            text: 'Seleccione'
                        }));
                        valoresPorDefecto = null;
                        Utils._LoadDataToDropDownListMultiple($(this), LegalizacionCrearItem.LISTA_OPCIONES_IMPUESTOS, valoresPorDefecto);
                    });

                    $('#ImpuestoId').append($('<option>', {
                        value: 0,
                        text: 'Seleccione'
                    }));

                }
                else
                    Utils._BuilderMessage("danger", response.message);
            }
        })

        $.datepicker.setDefaults($.datepicker.regional["es"]);
        $("#FechaFactura").datepicker({
            dateFormat: 'dd/mm/yy',
            firstDay: 1
        }).datepicker("setDate", new Date()).val('');
        Utils._InputFormatPrice();

    },

    OnChangeImpuesto: function (e, url) {

        var impuestoId = $(e).val();
        var $textBox = $("#TotalImpuestos");

        if (impuestoId == 0 || impuestoId == null || impuestoId == "") {
            $textBox.val(0);
            $("#Total").val(parseInt($("#ValorItem").formatPriceGetVal()));
            return false;
        }

        if (LegalizacionCrearItem.ANTICIPO == 0) {
            Utils._BuilderMessage("danger", "Debe seleccionar el anticipo a legalizar.");
            return false;
        }

        var parameters = {
            anticipoId: LegalizacionCrearItem.ANTICIPO[0],
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
        var Porcentaje = $('#Porcentaje').val();
        var Retencion = intVal($('#Retencion').val());


        // Consultar el valor total del item
        var totalAnticipo = parseFloat($('#TotalAnticipo').formatPriceGetVal());
        var totalLegalizado = parseFloat($('#TotalLegalizado').formatPriceGetVal());

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
        var tamano = LegalizacionCrearItem.DATA_LEGALIZACION.length;
        var valorTotal = parseInt($("#ValorFacturaSinIva").formatPriceGetVal()) + parseInt($("#ValorIvaFactura").formatPriceGetVal());
        LegalizacionCrearItem.CONTADOR = LegalizacionCrearItem.CONTADOR + 1;

        var objectData = {
            "Id": LegalizacionCrearItem.CONTADOR,
            "Anticipo": LegalizacionCrearItem.ANTICIPO[0],
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
            "Adjuntos": LegalizacionCrearItem.FILEGUARDAR,
            "Porcentaje": Porcentaje,
            "Retencion": Retencion
        };

        if (totalLegalizado == totalAnticipo) {
            Utils._BuilderMessage("danger", "Ya se legalizó el total de este anticipo");
            return false;
        }

        if ((totalLegalizado + parseInt(Total)) > (totalAnticipo + ((totalAnticipo * 20) / 100))) {
            Utils._BuilderMessage("danger", "No se puede legalizar un valor superior al total del anticipo");
            return false;
        }

        var totalALegalizar = 0;

        for (var i = 0; i < tamano; i++) {
            if (LegalizacionCrearItem.DATA_LEGALIZACION[i].Anticipo == LegalizacionCrearItem.ANTICIPO[0]) {
                totalALegalizar = parseInt(LegalizacionCrearItem.DATA_LEGALIZACION[i].Total) + parseInt(Total);

                if ((totalALegalizar + totalLegalizado) > (totalAnticipo + ((totalAnticipo * 20) / 100))) {
                    Utils._BuilderMessage("danger", "No se puede legalizar un valor superior al total del anticipo");
                    return false;
                }
            }
        }

        LegalizacionCrearItem.DATA_LEGALIZACION.push(objectData);
        LegalizacionCrearItem.RecargarTablaDatosLegalizacion();
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

        LegalizacionCrearItem.FILEGUARDAR = [];
    },

    /**
     * Recarga la tabla telefonos
     */
    RecargarTablaDatosLegalizacion: function () {
        var tamano = LegalizacionCrearItem.DATA_LEGALIZACION.length;
        for (var i = 0; i < tamano; i++) {
            LegalizacionCrearItem.DATA_LEGALIZACION[i]["id"] = i;
        }
        if (LegalizacionCrearItem.$TABLA_DATOS_LEGALIZACION != null) {
            LegalizacionCrearItem.$TABLA_DATOS_LEGALIZACION.fnDestroy();
        }
        LegalizacionCrearItem.ConstruirTablaDatosLegalizacion();
    },

    /**
     * Construye la tabla 
     */
    ConstruirTablaDatosLegalizacion: function () {

        LegalizacionCrearItem.$TABLA_DATOS_LEGALIZACION = $("#tabla-datos-legalizacion").dataTable({

            "destroy": true,
            "serverSide": false,
            "info": false,
            "data": LegalizacionCrearItem.DATA_LEGALIZACION,
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
                        html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="LegalizacionCrearItem.EliminarRegistro(' + data + ')" />';
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

        var longitudData = LegalizacionCrearItem.DATA_LEGALIZACION.length;

        for (var i = 0; longitudData > i; i++) {
            if (LegalizacionCrearItem.DATA_LEGALIZACION[i]["Id"] == id) {
                LegalizacionCrearItem.DATA_LEGALIZACION.splice(i, 1);
                break;
            }
        }

        LegalizacionCrearItem.ConstruirTablaDatosLegalizacion();
    },

    /**
     * OnBeginCrearAnticipo
     * @param {any} jqXHR
     * @param {any} settings
    */
    OnBeginCrear: function (jqXHR, settings) {

        var data = $(this).serializeObject();
        var tamano = LegalizacionCrearItem.DATA_LEGALIZACION.length;

        if (tamano == 0) {
            Utils._BuilderMessage("danger", "Debe adicionar al menos un item para guardar la legalización");
            return false;
        }

        data["TotalLegalizado"] = 0;
        data["TotalAnticipo"] = 0;
        data["AnticipoId"] = LegalizacionCrearItem.ANTICIPO[0];
        data["ValorItem"] = 0;
        data["TotalImpuestos"] = 0;
        data["Total"] = 0;
        data["Legalizaciones"] = LegalizacionCrearItem.DATA_LEGALIZACION;
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
        LegalizacionEditar.RecargarTabla();
    },

    UploadFileFactura: function (e) {
        RequestHttp._UploadFile(e, LegalizacionCrearItem.URL_UPLOAD, function (result) {
            if (result != null) {
                LegalizacionCrearItem.FILEGUARDAR = {
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

    //Impuesto Manual
    ImpuestoManualLegalizacion: function () {
        if ($(Manual).is(':checked')) {
            $(TotalImpuestos).prop('readonly', false);
            $(ImpuestoId).selectpicker('deselectAll');
            $(ImpuestoId).prop('disabled', true);
            $(ImpuestoId).selectpicker('refresh');
            $(ImpuestoId).removeAttr("selected");
        }
        else {
            $(TotalImpuestos).val('')
            $(TotalImpuestos).prop('readonly', true);
            $(ImpuestoId).prop('disabled', false);
            $(ImpuestoId).selectpicker('refresh');
        }
    },

}

$(function () {
    LegalizacionCrearItem.init();
});