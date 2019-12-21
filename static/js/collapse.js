(() => {
    const app = {
        initialize() {
            console.log('\n' + `%c[service] collapse.js ${arguments.callee.name}() running! \n` + ' ', 'color: #00d400; font-weight: bold');
            console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
            this.cached();
    
            this.collapseTrigger.length !== 0 ? console.log(`\tcollapse triggers available`) : console.log(`\tno collapse triggers`);
            this.collapseTrigger.forEach((trigger) => {
                trigger.addEventListener("click", (() => {
                    this.collapseDo(trigger.dataset.collapseTrigger);
                }));
    
                if (trigger.classList.contains('collapse-hidden') == false) {
                    trigger.classList.add('collapse-hidden');
                }
                
                if (trigger.classList.contains('collapse') == false) {
                    trigger.classList.add('collapse');
                }
            });
    
            this.collapseTarget.forEach((item) => {
                if (item.classList.contains('collapse') == false) {
                    item.classList.add('collapse');
                }
    
                if (item.classList.contains('collapse-hidden') == false) {
                    item.classList.add('collapse-hidden');
                }
            })
        },
    
        cached() {
            console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
    
            // Put cache elements here
            this.collapseTrigger = document.querySelectorAll('[data-collapse-trigger]');
            this.collapseTarget = document.querySelectorAll('[data-collapse-target]');
            this.parent = '';
            this.targetName = '';
            this.trigger;
        },
    
        collapseDo(target) {
            console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
    
            this.targetName = target;
            target = document.querySelector(`[data-collapse-target='${target}']`);
    
            this.parent = target.dataset.collapseParent;
            this.parent = document.querySelectorAll(`[data-collapse-group="${this.parent}"] > .collapse`);
            this.trigger = document.querySelector(`[data-collapse-trigger="${this.targetName}"]`);
    
            // COLLAPSE TRIGGER
            if (this.trigger.classList.contains('collapse-show') == false) {
                this.itemShow(this.trigger);

                // HIDE ALSO OTHER ELEMENTS
                this.parent.forEach((item) => {
                    if (item.dataset.collapseTrigger !== this.targetName) {
                        this.itemHide(item);
                    }
                });
            } else {
                this.itemHide(this.trigger);
            }
    
            // COLLAPSE TARGET
            if (target.classList.contains('collapse-show') == false) {
                this.itemShow(target)
            } else {
                this.itemHide(target)

                // HIDE ALSO OTHER ELEMENTS
                this.parent.forEach((item) => {
                    if (item.dataset.collapseTarget !== this.targetName) {
                        this.itemHide(item);
                    }
                });
            }
        },

        itemHide(input) {
            input.classList.remove('collapse-show');
            input.classList.add('collapse-hidden');
        },

        itemShow(input) {
            input.classList.add('collapse-show');
            input.classList.remove('collapse-hidden');
        }
    }

    app.initialize();
})()