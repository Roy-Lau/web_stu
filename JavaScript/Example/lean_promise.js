let p = new Promise(function(resolve, reject) {
    if (true) {
        resolve('success: 第一个Promise')
    } else {
        reject('error: 第一个Promise')
    }
})

p
    .then(resp => {
        console.log(resp)
        return 'success: 第一个then传来的数据'
    }, error => {
        console.log(error)
        return 'error: 第一个then传来的数据'
    })
    .then(resp => {
        console.log(resp)
        return 'success: 第二个then传来的数据'
    }, error => {
        console.log(error)
        return 'error: 第二个then传来的数据'
    })
    .then(resp => {
        console.log(resp)
        return 'success: 第三个then传来的数据'
    }, error => {
        console.log(error)
        return 'error: 第三个then传来的数据'
    })


/*function one() {
    return new Promise(function(resolve, reject) {
        if (true) {
            resolve('success: 第一个PromiseFunction')
        } else {
            reject('error: 第一个PromiseFunction')
        }
    })
}

function two() {
    return new Promise(function(resolve, reject) {
        if (true) {
            resolve('success: 第二个PromiseFunction')
        } else {
            reject('error: 第二个PromiseFunction')
        }
    })
}
one()
    .then(resp => {
        console.log(resp)
        return two()
        // return 'success: 第一个thenFunction传来的数据'
    }, error => {
        console.log(error)
        return two()
        // return 'error: 第一个thenFunction传来的数据'
    })
    .then(resp => {
        console.log(resp)
        // return 'success: 第一个thenFunction传来的数据'
    }, error => {
        console.log(error)
        // return 'error: 第一个thenFunction传来的数据'
    })*/