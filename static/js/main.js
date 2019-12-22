function registerService(input) {
    console.log(`%c[service] ${input}()`, 'font-weight: bold');
}

(() => {
    let generatedQRSrc;

    const app = {
        initialize() {
            console.log('\n' + `%c[service] main.js ${arguments.callee.name}() running! \n` + ' ', 'color: #00d400; font-weight: bold');
            registerService(arguments.callee.name);

            this.cached();
            this.generateUI();
            this.checkAPI();

            this.btn.generate.addEventListener('click', () => {
                this.generatePayment();
            })

            this.btn.settingsSave.addEventListener('click', () => {
                this.saveSettings();
            })
        },

        cached() {
            registerService(arguments.callee.name);
            // console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
            
            this.requestInput = {
                amount: document.querySelector('#inputRequestAmount').value,
                contact: document.querySelector('#inputRequestContact').value,
                descr: document.querySelector('#inputRequestDescr').value,
                account: document.querySelector('#inputRequestAccount').value,
            }

            this.settings = {
                name: document.querySelector('#inputSettingsName').value,
                account: document.querySelector('#inputSettingsAccount').value
            }

            this.btn = {
                generate: document.querySelector('[data-label="generate-code"]'),
                settingsSave: document.querySelector('[data-label="save-settings"]')
            }

            this.window = {
                code: {
                    img: document.querySelector('[data-sesam-target="generatedQRCode"] [data-label="qrCode"]'),
                    copy: document.querySelector('[data-label="copy-api-url"]')
                },
                preview: {
                    reciever: document.querySelector('[data-sesam-target="generatedQRCode"] [data-label="reciever"]'),
                    account: document.querySelector('[data-sesam-target="generatedQRCode"] [data-label="account"]'),
                    amount: document.querySelector('[data-sesam-target="generatedQRCode"] [data-label="amount"]'),
                    descr: document.querySelector('[data-sesam-target="generatedQRCode"] [data-label="descr"]'),
                    url: document.querySelector('#generatedApiURL')
                },
                payment: document.querySelector('[data-label-target="payment"]'),
                api: {
                    img: document.querySelector('[data-label="payment-screen"] [data-label="qrCode"]'),
                    name: document.querySelector('[data-label="payment-screen"] [data-label="header-name"]'),
                    reciever: document.querySelector('[data-label="payment-screen"] [data-label="reciever"]'),
                    account: document.querySelector('[data-label="payment-screen"] [data-label="account"]'),
                    amount: document.querySelector('[data-label="payment-screen"] [data-label="amount"]'),
                    descr: document.querySelector('[data-label="payment-screen"] [data-label="descr"]'),
                    url: document.querySelector('#generatedApiURL')
                }
            }

            this.db = {
                generated: TAFFY().store('generatedPayments'),
                recieved: TAFFY().store('recievedPayments'),
            }

            this.cookies = {
                settings: {
                    name: getCookie('settingsName'),
                    account: getCookie('settingsAccount'),
                }
            }
        },

        generateUI() {
            this.cached();
            registerService(arguments.callee.name);

            document.querySelector('[data-label="header-name"]').innerHTML = this.cookies.settings.name;
            document.querySelector('#inputSettingsName').value = this.cookies.settings.name;
            document.querySelector('#inputSettingsAccount').value = this.cookies.settings.account;
            document.querySelector('#inputRequestAccount').value = this.cookies.settings.account;
        },

        generatePayment() {
            registerService(arguments.callee.name);
            this.cached();

            //https://haegepoorters.be/pay/generated?title=TITEL&amount=333&description=BESCHRIJVING&reciever=groepskas&account=BE18%207360%203138%209365

            generatedQRSrc = `https://qrcode.tec-it.com/API/QRCode?data=BCD%0a001%0a1%0aSCT%0aKREDBEBB%0a${this.settings.name}%0a${this.requestInput.account}%0a${this.requestInput.amount}%0a%0a${this.requestInput.descr}&backcolor=%23ffffff&method=image`
            let generatedAPIURL = `${window.location.href.split('/?')[0]}/?api&r=${this.settings.name}&a=${this.requestInput.account}&m=${this.requestInput.amount}&d=${this.requestInput.descr}&c=${this.requestInput.contact}`

            this.window.code.img.src = generatedQRSrc;
            this.window.code.copy.addEventListener('click', () => {
                this.copy(generatedAPIURL);
            });

            this.window.preview.reciever.innerHTML = this.cookies.settings.name;
            this.window.preview.account.innerHTML = (this.requestInput.account !== '') ? this.requestInput.account : 'no accountnumber';
            this.window.preview.amount.innerHTML = (this.requestInput.amount !== '') ? `€${this.requestInput.amount.toString().replace('.', ',')}` : '€0';
            this.window.preview.descr.innerHTML = (this.requestInput.descr !== '') ? `${this.requestInput.descr}` : 'no description';

            this.window.preview.url.value = '';
            this.window.preview.url.value = generatedAPIURL;

        },

        saveSettings() {
            registerService(arguments.callee.name);
            this.cached();

            createCookie('settingsName',this.settings.name, 3000);
            createCookie('settingsAccount',this.settings.account, 3000);

            this.generateUI();
        },

        checkAPI() {
            registerService(arguments.callee.name);

            if (window.location.href.indexOf("?api") > -1) {
                // this.apiQueries.reciever = this.getQueryVariable('r');
                // this.apiQueries.account = this.getQueryVariable('a');
                // this.apiQueries.amount = this.getQueryVariable('m');
                // this.apiQueries.descr = this.getQueryVariable('d');
                // this.apiQueries.contact = this.getQueryVariable('c');

                document.body.classList.add('api-detected');
                // document.querySelector('[data-sesam-trigger="payment"]').click();

                this.window.api.img.src = `https://qrcode.tec-it.com/API/QRCode?data=BCD%0a001%0a1%0aSCT%0aKREDBEBB%0a${this.getQueryVariable('r')}%0a${this.getQueryVariable('a')}%0a${this.getQueryVariable('m')}%0a%0a${decodeURI(this.getQueryVariable('d'))}&backcolor=%23ffffff&method=image`;

                this.window.api.name.innerHTML = decodeURI(this.getQueryVariable('r'));
                this.window.api.reciever.innerHTML = decodeURI(this.getQueryVariable('r'));
                this.window.api.account.innerHTML = decodeURI(this.getQueryVariable('a'));
                this.window.api.amount.innerHTML = `€${decodeURI(this.getQueryVariable('m')).toString().replace('.',',')}`;
                this.window.api.descr.innerHTML = decodeURI(this.getQueryVariable('d'));
            }
        },

        copy(input) {
            registerService(arguments.callee.name);

            var dummy = document.createElement('input'),
            text = input;
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
        },

        getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
            return(false);
        }
    }

    app.initialize();
})()