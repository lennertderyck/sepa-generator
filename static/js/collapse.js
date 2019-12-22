(() => {
    const sesam = {
        initialize() {
            console.log('\n' + `%c[service] collapse.js ${arguments.callee.name}() running! \n` + ' ', 'color: #00d400; font-weight: bold');
            console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
            this.cached();
    
            this.collapseTrigger.length !== 0 ? console.log(`\tcollapse triggers available`) : console.log(`\tno collapse triggers`);
            this.collapseTrigger.forEach((trigger) => {
                trigger.addEventListener("click", (() => {
                    this.collapseDo(trigger.dataset.sesamTrigger);
                }));
    
                if (trigger.classList.contains('sesam-hidden') == false) {
                    trigger.classList.add('sesam-hidden');
                }
                
                if (trigger.classList.contains('sesam') == false) {
                    trigger.classList.add('sesam');
                }
            });
    
            this.collapseTarget.forEach((item) => {
                if (item.classList.contains('sesam') == false) {
                    item.classList.add('sesam');
                }
    
                if (item.classList.contains('sesam-hidden') == false) {
                    item.classList.add('sesam-hidden');
                }
            })
        },
    
        cached() {
            console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
    
            // Put cache elements here
            this.collapseTrigger = document.querySelectorAll('[data-sesam-trigger]');
            this.collapseTarget = document.querySelectorAll('[data-sesam-target]');
            this.parent = '';
            this.targetName = '';
            this.trigger;
        },
    
        collapseDo(target) {
            console.log(`%c[service] ${arguments.callee.name}()`, 'font-weight: bold');
    
            let targetClassesOnShow = '', targetClassesOnHide = '';
            const executeOtherFunctionDelay = 1000
    
            // Set target element
            this.targetName = target; 
            
            // Connect argument var name to element
            target = document.querySelector(`[data-sesam-target='${target}']`);
    
            if (target !== null) {
    
                // If parent exists, make var from parent
                if (target.dataset.sesamParent !== null) {
                    this.parent = target.dataset.sesamParent;
                    this.parent = document.querySelectorAll(`[data-sesam-group="${this.parent}"] > .sesam`);
                }
    
                // If extra classes were added, make var with classes 
                if (target.dataset.sesamClassShow) {
                    targetClassesOnShow = target.dataset.sesamClassShow
                }
                if (target.dataset.sesamClassHide) {
                    targetClassesOnHide = target.dataset.sesamClassHide
                }
                this.trigger = document.querySelector(`[data-sesam-trigger="${this.targetName}"]`);
        
                // COLLAPSE TRIGGER
                if (this.trigger.classList.contains('sesam-show') == false) {
                    this.itemShow(this.trigger);
    
                    if (parent !== null) {
                        // HIDE ALSO OTHER ELEMENTS
                        this.parent.forEach((item) => {
                            if (item.dataset.sesamTrigger !== this.targetName) {
                                this.itemHide(item);
                            }
                        });
                    }
                } else {
                    if (parent !== null) {
                        this.itemHide(this.trigger);
                    }
                }
        
                // COLLAPSE TARGET
                if (target.classList.contains('sesam-show') == false) {
                    this.itemShow(target)
    
                    if (target.dataset.sesamClassShow) {
                        target.classList.add(targetClassesOnShow);
                    }
                    if (target.dataset.sesamClassHide) {
                        target.classList.remove(targetClassesOnHide);
                    }
                } else {
                    this.itemHide(target)
    
                    if (parent !== null) {
                        // HIDE ALSO OTHER ELEMENTS
                        this.parent.forEach((item) => {
                            if (item.dataset.sesamTarget !== this.targetName) {
                                this.itemHide(item);
                            }
                        });
                    }
                    
                    if (target.dataset.sesamClassShow) {
                        target.classList.remove(targetClassesOnShow);
                    }
                    if (target.dataset.sesamClassHide) {
                        target.classList.add(targetClassesOnHide);
                    }
                }
            } else {
                console.log(`\t[error] you didn't created a target for ${target}`)
            }
        },
    
        itemHide(input) {
            input.classList.remove('sesam-show');
            input.classList.add('sesam-hidden');
        },
    
        itemShow(input) {
            input.classList.add('sesam-show');
            input.classList.remove('sesam-hidden');
        }
    }

    sesam.initialize();
})()


