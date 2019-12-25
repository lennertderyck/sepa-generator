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

            this.btn.delete.paymentHistory.addEventListener('click', () => {
                this.removeHistoryPaymentRecords();
            })
            
            this.settings = {
                maxHistoryRecords: 10,
            }
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
                settingsSave: document.querySelector('[data-label="save-settings"]'),
                delete: {
                    paymentHistory: document.querySelector('[data-label="delete-payment-history"]')
                }
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

            let dbGenerated = TAFFY().store('generatedPayments');

            this.cookies = {
                settings: {
                    name: getCookie('settingsName'),
                    account: getCookie('settingsAccount'),
                }
            }

            this.generatePaymentHistoryCounter = 0;
        },

        generateUI() {
            this.cached();
            registerService(arguments.callee.name);

            document.querySelector('[data-label="header-name"]').innerHTML = this.cookies.settings.name;
            document.querySelector('#inputSettingsName').value = this.cookies.settings.name;
            document.querySelector('#inputSettingsAccount').value = this.cookies.settings.account;
            document.querySelector('#inputRequestAccount').value = this.cookies.settings.account;

            this.generateHistory();
        },

        generatePayment() {
            registerService(arguments.callee.name);
            this.cached();

            //https://haegepoorters.be/pay/generated?title=TITEL&amount=333&description=BESCHRIJVING&reciever=groepskas&account=BE18%207360%203138%209365

            generatedQRSrc = `https://qrcode.tec-it.com/API/QRCode?data=BCD%0a001%0a1%0aSCT%0aKREDBEBB%0a${this.settings.name}%0a${this.requestInput.account}%0a${this.requestInput.amount}%0a%0a${this.requestInput.descr}&backcolor=%23ffffff&method=image`
            let generatedAPIURL = `${window.location.href.split('/?')[0]}?api&r=${this.settings.name}&a=${this.requestInput.account}&m=${this.requestInput.amount}&d=${this.requestInput.descr}&c=${this.requestInput.contact}`

            this.window.code.img.innerHTML = this.generateQRImage(generatedQRSrc);
            this.window.code.copy.addEventListener('click', () => {
                this.copy(generatedAPIURL);
            });

            this.window.preview.reciever.innerHTML = this.cookies.settings.name;
            this.window.preview.account.innerHTML = (this.requestInput.account !== '') ? this.requestInput.account : 'no accountnumber';
            this.window.preview.amount.innerHTML = (this.requestInput.amount !== '') ? `€${this.requestInput.amount.toString().replace('.', ',')}` : '€0';
            this.window.preview.descr.innerHTML = (this.requestInput.descr !== '') ? `${this.requestInput.descr}` : 'no description';

            this.window.preview.url.value = '';
            this.window.preview.url.value = generatedAPIURL;

            if (this.db.generated().first().id == undefined) {
                this.db.generated.insert({"id":1,"name":this.settings.name,"account":this.settings.account,"amount":this.requestInput.amount,"descr":this.requestInput.descr,"contact":this.requestInput.contact,"code":generatedQRSrc,"api":generatedAPIURL});
            } else {
                this.db.generated.insert({"id":this.db.generated().last().id+1,"name":this.settings.name,"account":this.settings.account,"amount":this.requestInput.amount,"descr":this.requestInput.descr,"contact":this.requestInput.contact,"code":generatedQRSrc,"api":generatedAPIURL});
            }
            // this.db.generated({}).remove(true);
            this.generateHistory();
        },

        generateHistory() {
            if (this.generatePaymentHistoryCounter !== 0) {
                document.querySelector('[data-label="record-list"]').innerHTML = '';
            } else {
                this.btn.delete.paymentHistory.classList.add('d-none')
            }
            let tempStr = '';
            this.db.generated().order("id desc").each((r) => {
                this.generatePaymentHistoryCounter++
                if (this.generatePaymentHistoryCounter >= this.settings.maxHistoryRecords + 1) {
                    let lastGenerated = this.db.generated().first().id;
                    this.db.generated({'id':lastGenerated}).remove();
                }

                if (this.generatePaymentHistoryCounter == 1) {
                    document.querySelector('[data-label="record-list"] p').classList.add('d-none');
                    this.btn.delete.paymentHistory.classList.remove('d-none')
                }

                const div = document.createElement('div');
                div.classList.add('row','bg-color-main','p-3','mb-3','bd-radius');
                div.setAttribute('data-label','record');
                div.setAttribute('data-record-id',r.id);
                div.setAttribute('data-sesam-trigger','generatedQRCode');
                div.innerHTML = `
                    <div class="col-auto pl-0 d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><title>icon_qr_code</title><g data-name="Laag 2"><g id="Laag_1-2" data-name="Laag 1"><path d="M0,0V23.33H23.33V0ZM16.67,16.67h-10v-10h10Z"/><path d="M0,56.67V80H23.33V56.67ZM16.67,73.33h-10v-10h10Z"/><path d="M56.67,0V23.33H80V0ZM73.33,16.67h-10v-10h10Z"/><polygon points="73.33 30 73.33 50 56.67 50 56.67 56.67 80 56.67 80 30 73.33 30"/><polygon points="56.67 63.33 56.67 80 63.33 80 63.33 70 73.33 70 73.33 80 80 80 80 63.33 56.67 63.33"/><polygon points="30 0 30 6.67 43.33 6.67 43.33 23.33 50 23.33 50 0 30 0"/><polygon points="43.33 30 43.33 43.33 30 43.33 30 63.33 43.33 63.33 43.33 80 50 80 50 56.67 36.67 56.67 36.67 50 50 50 50 36.67 56.67 36.67 56.67 43.33 63.33 43.33 63.33 30 43.33 30"/><rect x="30" y="70" width="6.67" height="10"/><rect x="13.33" y="43.33" width="10" height="6.67"/><polygon points="30 13.33 30 30 0 30 0 50 6.67 50 6.67 36.67 36.67 36.67 36.67 13.33 30 13.33"/></g></g></svg>
                    </div>
                    <div class="col-auto">
                        <p class="mb-n2 small">amount</p>
                        <p class="mb-0 font-scnd">€${r.amount.toString().replace('.',',')}</p>
                    </div>
                    <div class="col-auto">
                        <p class="mb-n2 small">account</p>
                        <p class="mb-0 font-scnd">${r.account}</p>
                    </div>
                    <div class="col-auto">
                        <p class="mb-n2 small">from</p>
                        <p class="mb-0 font-scnd">${r.contact}</p>
                    </div>
                    <div class="col-auto">
                        <p class="mb-n2 small">because</p>
                        <p class="mb-0 font-scnd">${r.descr}</p>
                    </div>
                    <div class="ml-autocol-auto d-none align-items-center">
                        <i data-feather="share-2"></i>
                        <!-- <p class="mb-0 font-scnd small">share</p> -->
                    </div>
                `
                div.addEventListener('click', () => {
                    this.generateHistoryPayment(r.name,r.code,r.amount,r.account,r.contact,r.descr,r.api)
                })
                document.querySelector('[data-label="record-list"]').appendChild(div);
            });

            // document.querySelector('[data-label="record-list"]').innerHTML = tempStr;
        },

        generateHistoryPayment(name,code,amount,account,contact,descr,api) {
            this.window.code.img.src = code;
            this.window.code.copy.addEventListener('click', () => {
                this.copy(api);
            });

            this.window.preview.reciever.innerHTML = name;
            this.window.preview.account.innerHTML = account;
            this.window.preview.amount.innerHTML = `€${amount.toString().replace('.', ',')}`;
            this.window.preview.descr.innerHTML = descr;

            this.window.preview.url.value = '';
            this.window.preview.url.value = api;
        },

        generateQRImage(url) {
            var request = false;
            if (window.XMLHttpRequest) {
                    request = new XMLHttpRequest;
            } else if (window.ActiveXObject) {
                    request = new ActiveXObject("Microsoft.XMLHttp");
            }

            if (request) {
                    request.open("GET", url);
                    if (request.status == 200) { return true; }
            }

            return false;
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
                document.body.classList.add('api-detected');
                // document.querySelector('[data-sesam-trigger="payment"]').click();

                this.window.api.img.src = `https://qrcode.tec-it.com/API/QRCode?data=BCD%0a001%0a1%0aSCT%0aKREDBEBB%0a${this.getQueryVariable('r')}%0a${this.getQueryVariable('a')}%0a${this.getQueryVariable('m')}%0a%0a${decodeURI(this.getQueryVariable('d'))}&backcolor=%23ffffff&method=image`;

                this.window.api.name.innerHTML = decodeURI(this.getQueryVariable('r'));
                this.window.api.reciever.innerHTML = decodeURI(this.getQueryVariable('r'));
                this.window.api.account.innerHTML = decodeURI(this.getQueryVariable('a'));
                this.window.api.amount.innerHTML = `€${decodeURI(this.getQueryVariable('m')).toString().replace('.',',')}`;
                this.window.api.descr.innerHTML = decodeURI(this.getQueryVariable('d'));

                this.copy(decodeURI(this.getQueryVariable('a')));
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
        },

        removeHistoryPaymentRecords() {
            this.db.generated().remove();
            this.generateHistory()
            document.querySelector('[data-label="record-list"] p').classList.remove('d-none');
        },
    }

    app.initialize();
})()