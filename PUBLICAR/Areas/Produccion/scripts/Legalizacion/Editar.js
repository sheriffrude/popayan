var LegalizacionEditar = {

    /**
     * OnLoad
     */
    init: function () {
        LegalizacionEditar.URL_DETALLE_LEGALIZACION_ITEM = "/Produccion/Legalizacion/ListarItemDetalle";
        LegalizacionEditar.ITEM_ID = $("#IdLegalizacion").val();
        LegalizacionEditar.CrearTablaDetalle();
        Utils._InputFormatPrice();
        LegalizacionEditar.URL_CAMBIAR_ESTADO = "/Produccion/Legalizacion/CancelarItem";
    },

    /**
     * CrearTablaDetalle
     */
    CrearTablaDetalle: function () {
        var $filtro = $("#input_filtro_listar_anticipos");

        this.$TABLA = $("#tabla_item_legalizacion_detalle").DataTable({
            "scrollX": true,
            "bDestroy": true,
            "ajax": {
                "url": LegalizacionEditar.URL_DETALLE_LEGALIZACION_ITEM,
                "type": "POST",
                "data": function (d) {
                    d.search["value"] = $filtro.val();
                    d.legalizacionId = LegalizacionEditar.ITEM_ID;
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
                    "data": "Id",
                    "orderable": false,
                    "width": "10%",
                    "render": function (data, type, full, meta) {
                        var html = '<a class="btn btn-danger btn-sm" onclick="LegalizacionEditar.CambiarEstado(' + data + ')" ><span class="glyphicon glyphicon-minus"></span>Eliminar</a>';
                        return html;
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return (true)
                            ? '<a href="' + URL_EDITAR_LEGALIZACION + '?id=' + data + '"  data-toggle="modal" data-target="#" data-size="lg" class="btn btn-secondary btn-sm" data-execute-onload="LegalizacionEditar.CargarFormato" >Editar</a>'
                            : "";
                    }
                },
            ],
            "drawCallback": function (settings) {
                Utils._InputFormatPrice();
                Utils._BuilderModal();
                $("#tabla_legalizacion_detalle").parent("div.col-sm-12").eq(0).css("overflow", "auto");
                $(".boton-desactivar-persona").bootstrapToggle({
                    on: '',
                    off: ''
                });
            }
        });

    },

    /**
    * CambiarEstado
    */
    CambiarEstado: function (item) {
        LegalizacionEditar.ITEM_LEGALIZACION_ID = item;
        Utils._BuilderConfirmation('CANCELAR ITEM LEGALIZACIÓN', '¿Está seguro que desea realizar esta acción?', LegalizacionEditar.AbrirModalCambioEstado, LegalizacionEditar.RecargarTabla);
    },

    AbrirModalCambioEstado: function () {

        var parameters = {
            legalizacionId: LegalizacionEditar.ITEM_ID,
            legaliacionItemId: LegalizacionEditar.ITEM_LEGALIZACION_ID
        };

        RequestHttp._Post(LegalizacionEditar.URL_CAMBIAR_ESTADO, parameters, null, function (data) {
            if (data != null) {
                if (data.state == true) {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                    LegalizacionEditar.RecargarTabla();
                } else {
                    var tipoMensaje = (data.state == true) ? "success" : "danger";
                    Utils._BuilderMessage(tipoMensaje, data.message);
                }
            }
        })

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

    CargarFormato: function () {

        $.datepicker.setDefaults($.datepicker.regional["es"]);
        $("#FechaFactura").datepicker();
        var $textBox = $("#TotalImpuestos");
        var impuestoId = $("#ImpuestoId").val();
        var url = "/Produccion/Legalizacion/ConsultarImpuestosEmpresa";


        if (impuestoId == 0 || impuestoId == null || impuestoId == "") {
            $textBox.val(0);
            LegalizacionEditar.PORCENTAJE_IMPUESTOS = 0;
            $("#Total").val(parseInt($("#ValorItem").formatPriceGetVal()));
            return false;
        }
        var parameters = {
            anticipoId: $("#AnticipoId").val(),
            impuestoId: impuestoId,
        };

        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: parameters,
            success: function (data, text) {
                //Guardar el porcentaje seleccionado
                var porcentaje = data.data[0].Porcentaje;
                LegalizacionEditar.PORCENTAJE_IMPUESTOS = porcentaje;
                var valorItem = LegalizacionEditar.ReplaceAll($("#ValorItem").val(), ",", "");
                var impuesto = (parseFloat(valorItem) * LegalizacionEditar.PORCENTAJE_IMPUESTOS) / 100;
                $textBox.val(formatNumber.new(Math.round(impuesto)));
                var valorTotal = parseFloat(valorItem) + impuesto;
                $("#Total").val(formatNumber.new(Math.round(valorTotal)));
            },
            error: function(request, status, error) {
                Utils._BuilderMessage("danger", error);
            }
        });

    },

    OnChangeItem: function () {
        var impuesto = (parseFloat($("#ValorItem").formatPriceGetVal()) * LegalizacionEditar.PORCENTAJE_IMPUESTOS) / 100;
        $("#TotalImpuestos").val(formatNumber.new(Math.round(impuesto) ));

        var valorTotal = parseFloat($("#ValorItem").formatPriceGetVal()) + parseFloat($("#TotalImpuestos").formatPriceGetVal());
        $("#Total").val(formatNumber.new(valorTotal));
    },

    OnChangeImpuesto: function (e, url) {

        var impuestoId = $(e).val();
        var $textBox = $("#TotalImpuestos");

        if (impuestoId == 0 || impuestoId == null || impuestoId == "") {
            $textBox.val(0);
            LegalizacionEditar.PORCENTAJE_IMPUESTOS = 0;
            $("#Total").val(parseInt($("#ValorItem").formatPriceGetVal()));
            return false;
        }

        var parameters = {
            anticipoId: $("#AnticipoId").val(),
            impuestoId: impuestoId,
        };

        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            data: parameters,
            success: function (data, text) {
                //Guardar el porcentaje seleccionado
                var porcentaje = data.data[0].Porcentaje;
                LegalizacionEditar.PORCENTAJE_IMPUESTOS = porcentaje;
                var valorItem = LegalizacionEditar.ReplaceAll($("#ValorItem").val(), ",", "");
                var impuesto = (parseFloat(valorItem) * LegalizacionEditar.PORCENTAJE_IMPUESTOS) / 100;
                $textBox.val(formatNumber.new(Math.round(impuesto)));
                var valorTotal = parseFloat(valorItem) + impuesto;
                $("#Total").val(formatNumber.new( Math.round(valorTotal)));
                $("#Porcentaje").val(LegalizacionEditar.PORCENTAJE_IMPUESTOS);
            },
            error: function(request, status, error) {
                Utils._BuilderMessage("danger", error);
            }
        });

        return false;
    },

    OnCompleteEditarLegalizacion: function (response) {

        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            var tipoMensaje = "danger";
            if (resultado.state == true) {
                tipoMensaje = "success"
                Utils._CloseModal();
                LegalizacionEditar.RecargarTabla();
            }
            Utils._BuilderMessage(tipoMensaje, resultado.message);
        }
    },

    /**
     * RecargarTabla
     */
    RecargarTabla: function () {

        if (LegalizacionEditar.$TABLA != null) {
            LegalizacionEditar.$TABLA.draw();
        }
        return false;
    },

    ReplaceAll: function (text, busca, reemplaza) {
        while (text.toString().indexOf(busca) != -1)
            text = text.toString().replace(busca, reemplaza);
        return text;
    },

}
$(function () {
    LegalizacionEditar.init();
});

var formato = {

    formatear: function (num) {
        var data = num.replace(".", "");
        data = data.replace(",", ".");
        var retorno = parseFloat(data);
        return retorno;
    },
}