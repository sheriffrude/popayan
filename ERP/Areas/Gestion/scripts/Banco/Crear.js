$(function () {
    $("#FechaAniversario").datepicker({
        minDate: 'D',
        dateFormat: 'dd/mm/yy',
        onClose: function (dateText, inst) {
            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay));
        }
    });
});

function OnchangePais(e, urlDepartamentos) {
    var paisId = $(e).val();
    var parameters = {
        id: paisId
    };
    var $elementListDepartamentos = $("#ParDepartamentoId");
    Utils._GetDataDropDownList($elementListDepartamentos, urlDepartamentos, parameters);
}

function OnchangeDepartamento(e, url) {
    var deptoId = $(e).val();
    var parameters = {
        id: deptoId
    };
    var $elementList = $("#ParCiudadId");
    Utils._GetDataDropDownList($elementList, url, parameters);
}