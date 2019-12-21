(() => {
    const app = {
        initialize() {
            console.log('\n' + `%c[service] main.js ${arguments.callee.name}() running! \n` + ' ', 'color: #00d400; font-weight: bold');
            console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
        },

        cached() {
            console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
        },

    }

    app.initialize();
})()