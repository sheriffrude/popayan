$(function () {
    $("#Fecha").datepicker({
        minDate: 'D',
        dateFormat: 'dd/mm/yy',
        onClose: function (dateText, inst) {
            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay));
        }
    });
});