function OnchangeEmpresa(e, url) {
    var empresaId = $(e).val();
    var parameters = {
        id: empresaId
    };
    var $elementListUnidadNegocio = $("#UnidadNegocioId");
    Utils._GetDropDownList($elementListUnidadNegocio, url, parameters);
}

function OnchangeUnidadNegocio(e, url) {
    var unidadNegocioId = $(e).val();
    var parameters = {
        id: unidadNegocioId,
        empresaId: $("#EmpresaId").val()
    };
    var $elementListAnio = $("#Anio");
    Utils._GetDropDownList($elementListAnio, url, parameters);
}