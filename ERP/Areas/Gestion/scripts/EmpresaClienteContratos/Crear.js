$.datepicker.setDefaults($.datepicker.regional["es"]);
$("#FechaContrato").datepicker({
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+0",
    firstDay: 1
}).datepicker("setDate", new Date()).val('');
$("#FechaFirma").datepicker({
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+0",
}).val('');
$("#FechaTerminacion").datepicker({
    dateFormat: 'dd/mm/yy',
    changeMonth: true,
    changeYear: true,
    firstDay: 1
}).datepicker("setDate", new Date()).val('');