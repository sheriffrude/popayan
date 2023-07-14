var DATA_PARAMETRIZACION_PRESUPUESTO = null;
var DATA_EMPRESAS = null;
var CANTIDAD_UNIDADES_NEGOCIO = 0;
var CANTIDAD_EMPRESAS = 0;
var ITEM_SELECCIONADO = 0;
var PAGINA = 0;

$(function () {
    //alert("entrar");
    ConsultarItemsPresupuesto();
    //ConsultarUnidadesNegocio();
});

/**
 * ConsultarUnidadesNegocio
 */
function ConsultarUnidadesNegocio() {
    /*$.ajax({
        url: URL_LISTAR_EMPRESAS,
        type: "POST",
        dataType: "json",
        complete: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                if (resultado.state == true) {
                    ConstruirEmpresas(resultado.data);
                }
            }
        },
        error: function (request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });*/
}

/**
 * ConstruirEmpresas
 * @param {any} data
 */
function ConstruirEmpresas(data) {
    DATA_EMPRESAS = data;
    var $tr_empresas = $("#tabla-parametrizar .tr-empresas");
    var $tr_unidades_negocio = $("#tabla-parametrizar .tr-unidades-negocio");
    var longitudEmpresas = data.length;
    CANTIDAD_EMPRESAS = longitudEmpresas;

    for (var i = 0; i < longitudEmpresas; i++) {
        var empresa = data[i];

        var unidadesNegocio = empresa.UnidadesNegocio;
        var longitudUnidades = unidadesNegocio.length;
        CANTIDAD_UNIDADES_NEGOCIO += longitudUnidades;

        var html = '<th colspan="' + (longitudUnidades + 2) + '" class="text-center">' + data[i].Nombre + '</th>';
        $tr_empresas.append(html);

        html = '<th class="text-center th-porcentaje-empresa">% Empresa</th>';
        for (var j = 0; j < longitudUnidades; j++) {
            var unidadNegocio = unidadesNegocio[j];
            html += '<th class="text-center th-nombre-empresa">' + unidadNegocio.Nombre + '</th>';
        }
        html += '<th class="text-center th-porcentaje-acumulado-empresa">% Acumulado</th>';
        $tr_unidades_negocio.append(html);
    }
    ConsultarItemsPresupuesto();
}

/**
 * ConsultarItemsPresupuesto
 */
function ConsultarItemsPresupuesto() {
    $(".tr-grupo, .tr-item").remove();
    $.ajax({
        url: URL_LISTAR_ITEMS,
        type: "POST",
        dataType: "json",
        complete: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                if (resultado.state == true) {
                    ConstruirTablaParametrizacion(resultado.data);
                }
            }
        },
        error: function (request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

/**
 * ConstruirTablaParametrizacion
 * @param {any} data
 */
function ConstruirTablaParametrizacion(data) {
    var $tabla_tbody = $("#tabla-parametrizar tbody");

    var longitudGrupos = data.length;
    var totalItemsMes = 0;

    for (var i = 0; i < longitudGrupos; i++) {
        var grupo = data[i];
        var html = '<tr class="tr-grupo">' +
            "<td colspan='4'>" + grupo.Nombre + "</td>" +
            //"<td colspan='" + ((CANTIDAD_EMPRESAS * 2) + CANTIDAD_UNIDADES_NEGOCIO + 1) + "'></td>"
        "</tr>";

        $tabla_tbody.append(html);

        var items = grupo.Items;
        var longitudItems = items.length;

        for (var j = 0; j < longitudItems; j++) {
            var item = items[j];
            var valorAnio = (parseInt(item.ValorMes) * 12);
            var class100Porciento = (item.PorcentajeAcumulado != 100) ? "no-100-porciento" : "";
            totalItemsMes = (totalItemsMes + parseInt(item.ValorMes));

            html = '<tr class="tr-item">' +
                '<td><button type="button" class="btn btn-xs btn-danger" onclick="ConfirmarEliminarItem(' + item.Id + ')" ><span class="glyphicon glyphicon-minus"></span></button></td>' +
                '<td>' + item.Nombre + '</td>' +
                '<td><input type="text" data-pagado-mes="' + i + '"  class="form-control " value="' + item.ValorMes + '"  data-update="true" data-format-price onkeyup="OnKeyUpValorPagado(this, event)"  data-valor-pagado data-mes="' + i + '" data-item="' + item.Id + '" /></td>' +

                '<td><input type="text" class="form-control text-right" input-presupuesto-anual="" data-format-price value="' + valorAnio + '" readonly="readonly" data-item="' + item.Id + '" data-update="true" /></td>' +
                '<td><input type="text" data-porcentaje-acumulado-item="' + item.Id + '" value="' + item.PorcentajeAcumulado + '" class="form-control ' + class100Porciento + '" min="0" max="100"  /></td>' +
                ConstruirRentabilidadEmpresa(item) +
                "</tr>";
            $tabla_tbody.append(html);
        }
    }

    $("#input-total-item-mes").val(totalItemsMes);
    $("#input-total-item-anio").val(totalItemsMes * 12);

    Utils._InputFormatPrice();
}

/**
 * OnKeyUpPresupuestoMensual
 * @param {any} e
 */
function OnKeyUpPresupuestoMensual(e) {
    var costo = $(e).formatPriceGetVal();
    var costoMensual = costo * 12;

    var itemId = $(e).attr("data-item");

    $(e).attr("data-update", true);

    $("input[input-presupuesto-anual][data-item=" + itemId + "]").val(costoMensual);

    Utils._InputFormatPrice();
}


function OnKeyUpValorPagado(e, event) {
    event.preventDefault();
    event.stopPropagation();

    $(e).attr("data-update", true);

    var itemId = $(e).attr("data-item");
    var mesId = $(e).attr("data-mes");

    var valorPagado = $(e).formatPriceGetVal();
    var valorItem = $('[data-valor-item][data-item=' + itemId + '][data-mes=' + mesId + ']').formatPriceGetVal();
    var valorDiferencia = parseInt(valorItem) - parseInt(valorPagado);

    var classValorPagado = 'valor-pagado-gris';
    if (valorDiferencia > 0)
        classValorPagado = 'valor-pagado-verde';
    else if (valorDiferencia < 0)
        classValorPagado = 'valor-pagado-rojo';

    $(e).removeClass('valor-pagado-gris valor-pagado-verde valor-pagado-rojo').addClass(classValorPagado);

    var porcentajePagado = (parseInt(valorPagado) * 100 / parseInt(valorItem)).toFixed(2);
    var porcentajeDiferencia = (parseInt(valorDiferencia) * 100 / parseInt(valorItem)).toFixed(2);

    $('[data-porcentaje-pagado][data-item=' + itemId + '][data-mes=' + mesId + ']').val(porcentajePagado);
    $('[data-porcentaje-diferencia][data-item=' + itemId + '][data-mes=' + mesId + ']').val(porcentajeDiferencia);

    $('[data-valor-diferencia][data-item=' + itemId + '][data-mes=' + mesId + ']').val(valorDiferencia);
    $('[data-valor-diferencia][data-item=' + itemId + '][data-mes=' + mesId + ']').removeClass('valor-pagado-gris valor-pagado-verde valor-pagado-rojo').addClass(classValorPagado);

    Utils._InputFormatPrice();
}

/**
 * ConfirmarEliminarItem
 * @param {any} id
 */
function ConfirmarEliminarItem(id) {
    ITEM_SELECCIONADO = id;
    Utils._BuilderConfirmation('Eliminar Item Presupuesto', '¿Esta seguro de eliminar el Item?', 'EliminarItem');
}

/**
 * EliminarItem
 */
function EliminarItem() {
    var parametros = {
        id: $("#PresupuestoGeneralId").val(),
        itemId: ITEM_SELECCIONADO
    };
    $.ajax({
        url: URL_ELIMINAR_ITEM,
        type: "POST",
        dataType: "json",
        data: parametros,
        complete: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                if (resultado.state == true) {
                    ConsultarItemsPresupuesto();
                }
            }
        },
        error: function (request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

/**
 * ConstruirRentabilidadEmpresa
 * @param {any} item
 */
function ConstruirRentabilidadEmpresa(item) {
    var itemId = item.Id;
    var porcentajes = item.Porcentajes;

    var html = "";
    var empresas = DATA_EMPRESAS;
    //var longitudEmpresas = DATA_EMPRESAS.length;

    /*for (var i = 0; i < longitudEmpresas; i++) {
        var empresa = empresas[i];
        var unidadesNegocio = empresa.UnidadesNegocio;
        var longitudUnidadesNegocio = unidadesNegocio.length;
        var porcentaje = ConsultarPorcentajeEmpresa(empresa.Id, porcentajes);
        html += '<td><input type="number" class="form-control" min="0" max="100" value="' + porcentaje + '" input-porcentaje-empresa data-id="' + empresa.Id + '" data-item="' + itemId + '" data-update="false" onchange="OnChangePorcentajeEmpresa(this, event)" /></td>';

        var porcentajeTotalEmpresa = 0;
        for (var j = 0; j < longitudUnidadesNegocio; j++) {
            var unidadNegocio = unidadesNegocio[j];
            var porcentajeUN = ConsultarPorcentajeUnidadNegocio(unidadNegocio.Id, porcentajes);
            porcentajeTotalEmpresa += porcentajeUN;
            html += '<td><input type="number" min="0" max="100" class="form-control" value="' + porcentajeUN + '" input-porcentaje-unidad-negocio data-id="' + unidadNegocio.Id + '" data-item="' + itemId + '" data-empresa="' + empresa.Id + '" data-update="false" onchange="OnChangePorcentajeUnidadNegocio(this, event)" /></td>';
        }

        var class100Porciento = (porcentajeTotalEmpresa != 100) ? 'no-100-porciento' : '';
        html += '<td><input type="text" min="0" max="100" class="form-control ' + class100Porciento + '" value="' + porcentajeTotalEmpresa + '" data-porcentaje-acumulado-empresa data-item="' + itemId + '" data-empresa="' + empresa.Id + '" readonly="readonly" /></td>';
    }*/
    //return html;
}

/**
 * ConsultarPorcentajeEmpresa
 * @param {any} empresaId
 * @param {any} porcentajes
 */
function ConsultarPorcentajeEmpresa(empresaId, porcentajes) {
    var porcentaje = 0;
    var longitudPorcentajes = porcentajes.length;
    for (var i = 0; i < longitudPorcentajes; i++) {
        if (porcentajes[i].EmpresaId == empresaId) {
            porcentaje = porcentajes[i].Porcentaje;
            break;
        }
    }
    return porcentaje;
}


/**
 * ConsultarPorcentajeUnidadNegocio
 * @param {any} unidadNegocioId
 * @param {any} porcentajes
 */
function ConsultarPorcentajeUnidadNegocio(unidadNegocioId, porcentajes) {
    var porcentaje = 0;
    var longitudPorcentajes = porcentajes.length;
    for (var i = 0; i < longitudPorcentajes; i++) {
        if (porcentajes[i].UnidadNegocioId == unidadNegocioId) {
            porcentaje = porcentajes[i].Porcentaje;
            break;
        }
    }
    return porcentaje;
}

/**
 * OnChangePorcentajeEmpresa
 * @param {any} e
 * @param {any} event
 */
function OnChangePorcentajeEmpresa(e, event) {
    event.preventDefault();
    event.stopPropagation();

    $(e).attr("data-update", true);
    var porcentajeAcumulado = 0;
    var itemId = $(e).attr("data-item");
    $("[input-porcentaje-empresa][data-item='" + itemId + "']").each(function () {
        porcentajeAcumulado = parseInt($(this).val()) + porcentajeAcumulado;
    });

    $("[data-porcentaje-acumulado-item='" + itemId + "']").val(porcentajeAcumulado);
    if (porcentajeAcumulado != 100)
        $("[data-porcentaje-acumulado-item='" + itemId + "']").addClass("no-100-porciento");
    else
        $("[data-porcentaje-acumulado-item='" + itemId + "']").removeClass("no-100-porciento");
}

/**
 * OnChangePorcentajeUnidadNegocio
 * @param {any} e
 * @param {any} event
 */

function OnChangePorcentajeUnidadNegocio(e, event) {
    event.preventDefault();
    event.stopPropagation();

    $(e).attr("data-update", true);
    var porcentajeAcumulado = 0;
    var itemId = $(e).attr("data-item");
    var empresaId = $(e).attr("data-empresa");
    $("[input-porcentaje-unidad-negocio][data-item='" + itemId + "'][data-empresa='" + empresaId + "']").each(function () {
        porcentajeAcumulado = parseInt($(this).val()) + porcentajeAcumulado;
    });

    $("[data-porcentaje-acumulado-empresa][data-item='" + itemId + "'][data-empresa='" + empresaId + "']").val(porcentajeAcumulado);
    if (porcentajeAcumulado != 100)
        $("[data-porcentaje-acumulado-empresa][data-item='" + itemId + "'][data-empresa='" + empresaId + "']").addClass("no-100-porciento");
    else
        $("[data-porcentaje-acumulado-empresa][data-item='" + itemId + "'][data-empresa='" + empresaId + "']").removeClass("no-100-porciento");
}

/**
 * OnBeginParametrizarPresupuestoGeneral
 * @param {any} jqXHR
 * @param {any} settings
 */

 /**function OnBeginParametrizarPresupuestoGeneral(jqXHR, settings) {
    var data = $(this).serializeObject();

    var itemsEmpresas = [];
    $("[input-porcentaje-empresa][data-update='true']").each(function () {
        var id = $(this).attr("data-id");
        var itemId = $(this).attr("data-item");
        var porcentaje = $(this).val();

        if (typeof $(this).attr("input-porcentaje-empresa") !== undefined) {
            itemsEmpresas.push({
                Id: id,
                ItemId: itemId,
                Porcentaje: porcentaje
            });
        }
    });

    var itemsUnidadesNegocio = [];
    $("[input-porcentaje-unidad-negocio][data-update='true']").each(function () {
        var id = $(this).attr("data-id");
        var itemId = $(this).attr("data-item");
        var porcentaje = $(this).val();

        if (typeof $(this).attr("input-porcentaje-empresa") !== undefined) {
            itemsUnidadesNegocio.push({
                Id: id,
                ItemId: itemId,
                Porcentaje: porcentaje
            });
        }
    });

    var items = [];
    $("input[input-presupuesto-mensual][data-update='true']").each(function () {
        var itemId = $(this).attr("data-item");
       var valor = $(this).val();
        
       items.push({
           ItemId: itemId,
           ValorMes: valor
       });
   });
    
    data["Empresas"] = itemsEmpresas;
    data["UnidadesNegocio"] = itemsUnidadesNegocio;
    settings.data = jQuery.param(data);
    return true;
}


**/

function OnBeginParametrizarItemPresupuestoGeneral(jqXHR, settings) {
    var data = $(this).serializeObject();
    console.log(data);
    var itemsParametrizar = [];
  

    $("input[data-valor-pagado][data-update='true']").each(function () {
        var itemId = $(this).attr("data-item");
        var valor = $(this).formatPriceGetVal();
        console.log(itemId);

        itemsParametrizar.push({
            ItemId: itemId,
            ValorMes: valor,

            
            
        });
      
    });

    console.log(itemsParametrizar);

    data["ItemsParametizar"] = itemsParametrizar;
    settings.data = jQuery.param(data);
    return true;
}




/**
 * OnCompleteParametrizarPresupuestoGeneral
 * @param {any} response
 */
function OnCompleteParametrizarPresupuestoGeneral(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        var tipoMensaje = "danger";
        if (resultado.state == true) {
            tipoMensaje = "success";
            ConsultarItemsPresupuesto();
            Utils._CloseModal();
        }
        Utils._BuilderMessage(tipoMensaje, resultado.message);
    }



}