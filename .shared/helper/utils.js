import Swal from "sweetalert2";

export const openCommonError = (text = '请登录后再操作') => {
    Swal.fire({
        title: '系统提示',
        text, confirmButtonText: '确认'
    })
}

export const openLoginAlert = store => {
    Swal.fire({
        title: "请登录后再操作",
        text: "系统提示",
        confirmButtonText: '确认',
    })
    .then(dialog => {
        if(dialog.isConfirmed) {
            switch(typeof store) {
                case 'function':
                    // *-static-h5
                    store();
                case 'object':
                    // *-static-web
                    store.loginPageVisible = true
                default:
            }
        }
    })
}