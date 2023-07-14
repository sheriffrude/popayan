var consultarItemPresupuestoAnticipo = function () {

    return {

        URL_PRESUPUESTO_ITEM_ASOCIADO_LISTAR: null,
        URL_ITEM_PRESUPUESTO_ANTICIPO: null,
        URL_SUBIR_ARCHIVOS_TEMP_ANTICIPOS: null,
        ARRAY_ANTICIPOS: [],
        CONTADOR: null,
        IMPUESTOS: null,
        VALIDAR: null,
        DATA_PRESUPUESTO_ANTICIPO: null,
        FILE: [],

        init: function () {
            $TABLA_ITEM_PRESUPUESTO_ANTICIPO = null;
            consultarItemPresupuestoAnticipo.URL_ITEM_PRESUPUESTO_ANTICIPO = '/Produccion/PresupuestoItemAnticipo/ListarItemAnticipos';
            consultarItemPresupuestoAnticipo.URL_SUBIR_ARCHIVOS_TEMP_ANTICIPOS = '/Produccion/PresupuestoItemAnticipo/UploadFile';
            consultarItemPresupuestoAnticipo.URL_CONSULTAR_IMPUESTOS = '/Produccion/PresupuestoItemAnticipo/ConsultarImpuestosEmpresa';
            consultarItemPresupuestoAnticipo.URL_CONSULTAR_ITEM_ANTICIPOS = '/Produccion/PresupuestoItemAnticipo/ValidarAnticiposItem';
            consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS = [];
            consultarItemPresupuestoAnticipo.CONTADOR = 0;
            consultarItemPresupuestoAnticipo.IMPUESTOS = 0;
            consultarItemPresupuestoAnticipo.VALIDAR = 0;
            consultarItemPresupuestoAnticipo.DATA_PRESUPUESTO_ANTICIPO = [];
            consultarItemPresupuestoAnticipo.FILE = [];
            $.datepicker.setDefaults($.datepicker.regional["es"]);
            $("#FechaAnticipo").datepicker({ minDate: '0' });
            $("#FechaLegalizacionAnticipo").datepicker({ minDate: '0' });
            consultarItemPresupuestoAnticipo.CargarTablaItemPresupuestoAnticipo();
        },

        CargarTablaItemPresupuestoAnticipo: function () {

            $TABLA_ITEM_PRESUPUESTO_ANTICIPO = $("#tabla_presupuesto_items_anticipos").DataTable({
                "autoWidth": false,
                "ajax": {
                    "url": consultarItemPresupuestoAnticipo.URL_ITEM_PRESUPUESTO_ANTICIPO,
                    "type": "POST",
                    "data": function (d) {
                        d.search["value"] = null;
                        d.itemId = $("#Item").val();
                        d.presupuestoId = PresupuestoConsultar.PRESUPUESTO_ID;
                        d.versionPresupuestoId = PresupuestoConsultar.VERSION_PRESUPUESTO_ID;
                        d.asociado = $("#Asociado").val();

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
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            return '<input type="checkbox"  class="radio_item_seleccionar" id="' + data + '" onclick="consultarItemPresupuestoAnticipo.SeleccionarItem(' + data + ')" />';
                        }
                    },
                    {
                        "data": "Id",
                    },
                    {
                        "data": "Grupo",
                    },
                    {
                        "data": "Nombre",
                    },
                    {
                        "data": "Dias",
                    },
                    {
                        "data": "Cantidad",
                    },
                    {
                        "data": "ValorUnitario",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" style="width:120px;" class="form-control input_anticipo" data-format-price="" data-item-valor-unitario-id="' + full.Id + '" value="' + data + '" readonly="readonly" />' +
                                '</div>';
                            return html;
                        }
                    },
                    {
                        "data": "Total",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {

                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" style="width:120px;" class="form-control input_anticipo" data-format-price="" data-item-total-id="' + full.Id + '" value="' + data + '" readonly="readonly" />' +
                                '</div>';
                            return html;
                        }
                    },
                    {
                        "data": "TotalSolicitado",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {

                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" style="width:120px;" class="form-control input_anticipo" data-format-price="" data-item-total-asociado-id="' + full.Id + '" value="' + data + '" readonly="readonly" />' +
                                '</div>';
                            return html;
                        }
                    },
                    {
                        "data": "Disponible",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {

                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" style="width:120px;" class="form-control input_anticipo" data-format-price="" data-item-disponible-id="' + full.Id + '" value="' + data + '" readonly="readonly" />' +
                                '</div>';
                            return html;
                        }
                    },
                    {
                        "data": "ValorAnticipo",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {

                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" style="width:120px;" class="form-control input_anticipo" data-format-price="" data-item-valor-anticipo-id="' + full.Id + '" value="' + data + '" onkeyup="consultarItemPresupuestoAnticipo.OnChangeAnticipo(this' + ',' + full.Id + ')" />' +
                                '</div>';
                            return html;
                        }
                    },
                    {
                        "data": "Manual",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            return '<input type="checkbox" data-item-manual-id="' + full.Id + '" class="radio_item_seleccionar input_anticipo" id="check-impuesto-' + full.Id + '" onclick="consultarItemPresupuestoAnticipo.ImpuestoManual(' + full.Id +',this)" />';
                        }
                    },
                    {
                        "data": "Impuestos",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var valor = 0;
                            return '<select id="impuesto' + full.Id + '" style="width:200px;" class="selectpicker select_impuestos_interno_item2" multiple data-live-search="true" data-impuestos="' + valor + '" data-item-id="' + full.Id + '" onchange="consultarItemPresupuestoAnticipo.OnChangeImpuestosAnticipo(this, ' + full.Id + ')"> </select>';
                        }
                    },
                    {
                        "data": "TotalImpuestoAnticipo",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" style="width:120px;" class="form-control input_anticipo" data-format-price="" data-item-anticipo-impuestos-id="' + full.Id + '" value="' + 0 + '" readonly="readonly"  onkeyup="consultarItemPresupuestoAnticipo.OnChangeAnticipo(this' + ',' + full.Id + ')" />' +
                                '</div>';
                            return html;
                        }
                    },
                    {
                        "data": "AnticipoConImpuestos",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {

                            var resultado = 0;
                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" style="width:120px;" class="form-control input_anticipo" data-format-price="" data-item-anticipomasimpuestos-id="' + full.Id + '" value="' + resultado + '" readonly="readonly" />' +
                                '</div>';
                            return html;
                        }
                    },
                    {
                        "data": "Exedente",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {

                            var resultado = full.Disponible - full.ValorAnticipo;
                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">$</label>' +
                                '<input type="text" style="width:120px;" class="form-control input_anticipo" data-format-price="" data-item-excedente-id="' + full.Id + '" value="' + resultado + '" readonly="readonly" />' +
                                '</div>';
                            return html;
                        }
                    },
                    {
                        "data": "PorcentajeAnticipo",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {

                            var resultado = ((full.Disponible - full.ValorAnticipo) / full.Disponible) * 100;
                            var html = '<div class="input-group">' +
                                '<label class="input-group-addon">%</label>' +
                                '<input type="text" style="width:50px;" class="form-control input_anticipo" data-format-price="" data-item-porcentaje-anticipo-id="' + full.Id + '" value="' + resultado + '" readonly="readonly" />' +
                                '</div>';
                            return html;
                        }
                    },
                ],
                "drawCallback": function (settings) {

                    Utils._InputFormatPrice();
                    //Tabla
                    $("#tabla_presupuesto_items_anticipos").parent("div.col-sm-12").eq(0).css("overflow", "auto");

                    Utils._BuilderModal();
                    Utils._InputFocus();
                    //Select Impuestos Interno
                    $(".select_impuestos_interno_item2").each(function () {

                        var valoresPorDefecto = $(this).attr("data-impuestos");
                        valoresPorDefecto = valoresPorDefecto.split(",");
                        Utils._LoadDataToDropDownListMultiple($(this), PresupuestoConsultar.LISTA_OPCIONES_IMPUESTOS, valoresPorDefecto);

                    });

                }
            });
        },

        SeleccionarItem: function (id) {

            //Validar el item seleccionado que si tiene asociados o item con anticipos
            var parameters = {
                itemId: id,
                presupuestoId: PresupuestoConsultar.PRESUPUESTO_ID,
                versionPresupuestoId: PresupuestoConsultar.VERSION_PRESUPUESTO_ID
            };

            //Consultar el porcentaje del impuesto para la empresa
            RequestHttp._Post(consultarItemPresupuestoAnticipo.URL_CONSULTAR_ITEM_ANTICIPOS, parameters, null, function (responseData) {

                if (responseData != null) {
                    if (responseData.data == 0) {
                        var tam = consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS.length;
                        for (i = 0; i < tam; i++) {
                            if (consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS[i] == id) {
                                consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS.splice(i, 1);
                                return false;
                            }
                        }
                        consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS.push(id);
                    } else {
                        $("#" + id + "").prop("checked", false);
                        $("input."+ id + "").attr("disabled", true);
                        Utils._BuilderMessage("danger", "No se pueden realizar anticipos sobre este item");
                    }
                }
            });
        },

        onChangeFechaLegalizacionAnticipo: function (fecha) {
            if ($("#FechaAnticipo").val() > fecha.value) {
                Utils._BuilderMessage("warning", "La fecha de legalización del anticipo no puede ser inferior a la fecha del anticipo.");
            }
        },

        SubirArchivo: function (e) {

            RequestHttp._UploadFile(e, consultarItemPresupuestoAnticipo.URL_SUBIR_ARCHIVOS_TEMP_ANTICIPOS, function (result) {

                if (result != null) {
                    consultarItemPresupuestoAnticipo.CONTADOR++;

                    var object = {
                        'Id': consultarItemPresupuestoAnticipo.CONTADOR,
                        'Name': result.Name,
                        'Path': result.Path,
                        'OriginalName': result.OriginalName,
                        'Url': result.Url
                    };

                    consultarItemPresupuestoAnticipo.FILE.push(object);
                    consultarItemPresupuestoAnticipo.TablaArchivos();
                }
            });
        },

        TablaArchivos: function () {

            $("#Contenedor_Archivos").removeClass('hidden');
            $TABLA_ARCHIVOS = $("#tabla-Archivos").dataTable({
                "destroy": true,
                "serverSide": false,
                "data": consultarItemPresupuestoAnticipo.FILE,
                "columns": [
                    {
                        "data": "OriginalName"
                    },
                    {
                        "data": "Id",
                        "width": "20%",
                        "render": function (data, type, full, meta) {
                            return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="consultarItemPresupuestoAnticipo.EliminarArchivo(' + data + ')" >';
                        }
                    }
                ]
            });
        },

        EliminarArchivo: function (id) {
            var tamanoDataSetOpciones = consultarItemPresupuestoAnticipo.FILE.length;
            for (var i = 0; tamanoDataSetOpciones > i; i++) {
                if (consultarItemPresupuestoAnticipo.FILE[i]["Id"] == id) {
                    consultarItemPresupuestoAnticipo.FILE.splice(i, 1);
                    break;
                }
            }
            consultarItemPresupuestoAnticipo.TablaArchivos();
        },

        OnChangeAnticipo: function (anticipo, id) {
         
            //Inicializar valores
            if (!document.getElementById('check-impuesto-' + id).checked) {
                $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").val(0);
            }
            $("input.input_anticipo[data-item-excedente-id='" + id + "']").val(0);
            $("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(0);
            $("input.input_anticipo[data-item-porcentaje-anticipo-id='" + id + "']").val(0);
            //alert(document.getElementById('check-impuesto-' + id).checked);
            //$("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(0);
            
            var totalItem = parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal());
            var anticipos = parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal());
            var porcentaje = ((totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS) / totalItem) * 100;

            
            //Calcular impuestos
            var targets = [];
            $.each($("#impuesto" + id + "" +  " option:selected"), function () {
                targets.push($(this).val());

            });

            //Consultar el valor del impuesto para la empresa
            consultarItemPresupuestoAnticipo.IMPUESTOS = parseFloat($("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").formatPriceGetVal());

            var emresaId = PresupuestoConsultar.EMPRESA_ID;
            var totalImpuestos = 0;
            var anticipo = parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal());

            if (parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal()) + parseFloat($("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").formatPriceGetVal()) > parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal()) + parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal() * 0.2)) {
                consultarItemPresupuestoAnticipo.VALIDAR = 1;
            } else {
                consultarItemPresupuestoAnticipo.VALIDAR = 0;
            }

            //Validar anticipo
            if (parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal()) + parseFloat($("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").formatPriceGetVal()) > parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal()) + parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal()*0.2)) {
                $("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").val(0);
                $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").val(0);
                $("input.input_anticipo[data-item-excedente-id='" + id + "']").val(0);
                $("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(0);
                $("input.input_anticipo[data-item-porcentaje-anticipo-id='" + id + "']").val(0);
                Utils._BuilderMessage("warning", 'Ya ha superado el límite disponible para hacer anticipos sobre este ítem!..');
                return true;
            }

            if (consultarItemPresupuestoAnticipo.VALIDAR == 0) {

                var totalItem = parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal());
                var anticipos = parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal());
                var porcentaje = ((totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS) / totalItem) * 100;
                var exedente = totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS;
                $("input.input_anticipo[data-item-porcentaje-anticipo-id='" + id + "']").val(porcentaje.toFixed(1));
                $("input.input_anticipo[data-item-excedente-id='" + id + "']").val(formatNumber.new(exedente));
                var anticipoImpuetos = anticipos + consultarItemPresupuestoAnticipo.IMPUESTOS;
                $("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(formatNumber.new(anticipoImpuetos));
                $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").val(formatNumber.new(consultarItemPresupuestoAnticipo.IMPUESTOS));
                
            }

            for (var i = 0; i < targets.length; i++) {

                var parameters = {
                    id: emresaId,
                    impuestoId: targets[i]
                };

                //Consultar el porcentaje del impuesto para la empresa
                RequestHttp._Post(consultarItemPresupuestoAnticipo.URL_CONSULTAR_IMPUESTOS, parameters, null, function (responseData) {
                    if (responseData != null) {
                        var tipoMensaje = (responseData.state == true) ? "sucess" : "danger";
                        //Validar anticipo
                        if (parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal()) + parseFloat($("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").formatPriceGetVal()) > parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal()) + parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal() * 0.2)) {

                            consultarItemPresupuestoAnticipo.VALIDAR = 1;
                            $("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").val(0);
                            $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").val(0);
                            $("input.input_anticipo[data-item-excedente-id='" + id + "']").val(0);
                            $("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(0);
                            $("input.input_anticipo[data-item-porcentaje-anticipo-id='" + id + "']").val(0);
                            Utils._BuilderMessage("warning", 'Ya ha superado el límite disponible para hacer anticipos sobre este ítem!');
                            return;

                        } else {

                            consultarItemPresupuestoAnticipo.IMPUESTOS = consultarItemPresupuestoAnticipo.IMPUESTOS + (anticipo * responseData.data[0].Porcentaje) / 100;
                            if (consultarItemPresupuestoAnticipo.VALIDAR == 0) {
                                var totalItem = parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal());
                                var anticipos = parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal());
                                var porcentaje = ((totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS) / totalItem) * 100;
                                var exedente = totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS;
                                $("input.input_anticipo[data-item-porcentaje-anticipo-id='" + id + "']").val(porcentaje.toFixed(1));
                                $("input.input_anticipo[data-item-excedente-id='" + id + "']").val(formatNumber.new(exedente));
                                var anticipoImpuetos = anticipos + consultarItemPresupuestoAnticipo.IMPUESTOS;
                                $("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(formatNumber.new(anticipoImpuetos));
                                $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").val(formatNumber.new(consultarItemPresupuestoAnticipo.IMPUESTOS));
                                
                            }
                        }


                    }
                });
            }
        },

        OnChangeImpuestosAnticipo: function (e, id) {
            //Consultar el valor del impuesto para la empresa
            consultarItemPresupuestoAnticipo.IMPUESTOS = 0;
            var emresaId = PresupuestoConsultar.EMPRESA_ID;
            var totalImpuestos = 0;
            var anticipo = parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal());

            for (var i = 0; i < e.selectedOptions.length; i++) {

                var parameters = {
                    id: emresaId,
                    impuestoId: e.selectedOptions[i].value
                };
                //Consultar el porcentaje del impuesto para la empresa
                RequestHttp._Post(consultarItemPresupuestoAnticipo.URL_CONSULTAR_IMPUESTOS, parameters, null, function (responseData) {
                    if (responseData != null) {
                        var tipoMensaje = (responseData.state == true) ? "sucess" : "danger";
                        consultarItemPresupuestoAnticipo.IMPUESTOS = consultarItemPresupuestoAnticipo.IMPUESTOS + (anticipo * responseData.data[0].Porcentaje) / 100;
                        $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").val(formatNumber.new(consultarItemPresupuestoAnticipo.IMPUESTOS));

                        //Validar anticipo
                        if (parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal()) + parseFloat($("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").formatPriceGetVal()) > parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal()) + parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal() * 0.2)) {
                            $("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").val(0);
                            $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").val(0);
                            $("input.input_anticipo[data-item-excedente-id='" + id + "']").val(0);
                            //alert("si entra");
                            $("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(0);
                            $("input.input_anticipo[data-item-porcentaje-anticipo-id='" + id + "']").val(0);
                            Utils._BuilderMessage("warning", 'Ya ha superado el límite disponible para hacer anticipos sobre este ítem!');
                            return true;
                        }

                        var totalItem = parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal());
                        var anticipos = parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal());
                        var porcentaje = ((totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS) / totalItem) * 100;
                        var exedente = totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS;
                        $("input.input_anticipo[data-item-porcentaje-anticipo-id='" + id + "']").val(porcentaje.toFixed(1));
                        $("input.input_anticipo[data-item-excedente-id='" + id + "']").val(formatNumber.new(exedente));
                        var anticipoImpuetos = anticipos + consultarItemPresupuestoAnticipo.IMPUESTOS;
                        $("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(formatNumber.new(anticipoImpuetos));
                    }
                });

            }

            if (e.selectedOptions.length == 0) {
                consultarItemPresupuestoAnticipo.IMPUESTOS = 0;
                $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").val(0);
                var totalItem = parseFloat($("input.input_anticipo[data-item-disponible-id='" + id + "']").formatPriceGetVal());
                var anticipos = parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + id + "']").formatPriceGetVal());
                var porcentaje = ((totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS) / totalItem) * 100;
                var exedente = totalItem - anticipos - consultarItemPresupuestoAnticipo.IMPUESTOS;
                $("input.input_anticipo[data-item-porcentaje-anticipo-id='" + id + "']").val(porcentaje.toFixed(1));
                $("input.input_anticipo[data-item-excedente-id='" + id + "']").val(formatNumber.new(exedente));
                $("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").val(anticipos);
            }

        },

        /**
         * OnBeginCrearAnticipo
         * @param {any} jqXHR
         * @param {any} settings
        */
        OnBeginCrear: function (jqXHR, settings) {

            var data = $(this).serializeObject();

            for (var i = 0; i < consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS.length; i++) {
                //Calcular impuestos
                var targets = [];

                $.each($("#impuesto" + consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS[i] + "" + " option:selected"), function () {
                    targets.push($(this).val());
                });

                var objectData = {
                    "Id": consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS[i],
                    "Total": parseFloat($("input.input_anticipo[data-item-total-id='" + consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS[i] + "']").formatPriceGetVal()),
                    "ValorAnticipo": parseFloat($("input.input_anticipo[data-item-valor-anticipo-id='" + consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS[i] + "']").formatPriceGetVal()),
                    "Impuestos": parseFloat($("input.input_anticipo[data-item-anticipo-impuestos-id='" + consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS[i] + "']").formatPriceGetVal()),
                    "TotalImpuestoAnticipo": parseFloat($("input.input_anticipo[data-item-anticipomasimpuestos-id='" + consultarItemPresupuestoAnticipo.ARRAY_ANTICIPOS[i] + "']").formatPriceGetVal()),
                    "IdImpuetos": targets,
                };

                if (objectData.ValorAnticipo <= 0) {
                    Utils._BuilderMessage("warning", 'No se pueden crear anticipos por un valor de 0.');
                    return false;
                }
                consultarItemPresupuestoAnticipo.DATA_PRESUPUESTO_ANTICIPO.push(objectData);
            }

            if (consultarItemPresupuestoAnticipo.DATA_PRESUPUESTO_ANTICIPO.length > 0) {
                data["PresupuestoId"] = PresupuestoConsultar.PRESUPUESTO_ID;
                data["VersionPresupuestoId"] = PresupuestoConsultar.VERSION_PRESUPUESTO_ID;
                data["EstadoId"] = PresupuestoConsultar.ESTADO_ID;
                data["Adjuntos"] = consultarItemPresupuestoAnticipo.FILE;
                data["Anticipos"] = consultarItemPresupuestoAnticipo.DATA_PRESUPUESTO_ANTICIPO;
                data["EmpresaId"] = PresupuestoConsultar.EMPRESA_ID;

                settings.data = jQuery.param(data);
                return true; 

            } else {
                Utils._BuilderMessage("warning", 'Debe seleccionar al menos un anticipo');
                return false;
            }
        },
     
        OnCompleteCrear: function (response) {     
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                var tipoMensaje = "danger";
                if (resultado.state) {
                    tipoMensaje = "success";
                    PresupuestoItemListar.RecargarPaginaTabla();
                    Utils._CloseModal();
                }
                Utils._BuilderMessage(tipoMensaje, resultado.message + resultado.data);
            }
        },

        DescargarInforme: function () {
            var anticipoId = $("#Id").val();
            var parameters = {
                AnticipoId: anticipoId,
            };
            ReportsP._OpenTab("PDF", "Produccion/PresupuestoAnticipo/Anticipo.trdp", parameters);
        },

        //Impuesto Manual
        ImpuestoManual: function (id, este) {
            //$("input.input_anticipo[data-item-anticipomasimpuestos-id='" + id + "']").prop('readonly', false));
            //$('#inputId').prop('readonly', true); data-check-manual-id="' + full.Id .checked
            //alert($(este).attr('checked')); $("#dataPicker").selectpicker("refresh"); impuesto $("#dataPicker option:selected").val('default');
            //alert(este.checked);
            
            if (este.checked) {
                $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").prop('readonly', false);
                //alert($("#impuesto" + id + "" + " option:selected"));
                $("#impuesto" + id).selectpicker('deselectAll');
                $("#impuesto" + id).prop('disabled', true);
                $("#impuesto" + id).selectpicker('refresh');
                $("#impuesto" + id + "" + " option:selected").removeAttr("selected");
            }
            else {
                $("input.input_anticipo[data-item-anticipo-impuestos-id='" + id + "']").prop('readonly', true);
                $("#impuesto" + id).prop('disabled', false);
                $("#impuesto" + id).selectpicker('refresh');
            }

            //alert ("id " id);
           
        }

    }
}();