
<script lang="js">
    const chgDate = (val) => {
    var gapDate = new Date().getTime() - val * 24 * 60 * 60 * 1000;
    var oldDate = new Date(gapDate);
    var newDate = {
        Y: oldDate.getFullYear() + "-",
        M: (oldDate.getMonth() + 1) < 10 ? "0" + (oldDate.getMonth() + 1 + "-") : (oldDate.getMonth() + 1 + "-"),
        D: (oldDate.getDate())  < 10 ? "0" + (oldDate.getDate() + "") : (oldDate.getDate() + ""),
    }
    var useDate = newDate.Y + newDate.M + newDate.D;
    return useDate;
    }
</script>