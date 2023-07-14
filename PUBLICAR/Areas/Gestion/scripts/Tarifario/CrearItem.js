function onSuccessCrearTarifarioItem() {
    setTimeout(function () {
        if ($TABLA_TARIFARIO_ITEM != null) {
            $TABLA_TARIFARIO_ITEM.draw();
        }
    }, 1000);
}

function OnchangeGrupoCrear(e, url) {
    var grupoId = $(e).val();
    var $dropDownList = $("#SubNombre");
    var parameters = {
        id: grupoId
    };
    Utils._GetDataDropDownList($dropDownList, url, parameters);
}

/**
 * Evento onchange del select impuesto: Sirve para agregar el valor del impuesto en el campo Valor
 * @param {Object<>} e 
 * @param {string} url 
 * @returns {boolean} 
 */
function OnChangeImpuesto(e, url) {
    var impuestoId = $(e).val();
    var $textBox = $("#Valor");
    if (impuestoId == 0 || impuestoId == null || impuestoId == "") {
        $textBox.val(null);
        return false;
    }
    var parameters = {
        id: impuestoId
    };
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            $textBox.val(data);
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
    return false;
}