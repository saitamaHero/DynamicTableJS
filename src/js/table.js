let Table = function (table = new HTMLTableElement()) {
    this.table = table;
    this.headers = [];
    this.dataColumns = [];
    this.data = [];
    this.autoRender = true;
    this.headerFooter = true;

    let thisInstance = this;

    //Pagination
    this.pagination = {
        enabled: false,
        totalPages: 1,
        perPage: 0,
        currentPage: 1,
        setPerPage: function (perPage) {
            if ("number" == typeof perPage && perPage > 0) {
                this.perPage = perPage;
                thisInstance.calculatePagination();
                this.currentPage = 1;

                thisInstance.onperpagechange.call(this, this.perPage);

                if (thisInstance.autoRender) {
                    thisInstance.render();
                }
            }


        },
        previous: function () {
            let next = this.currentPage;

            if (this.currentPage > 1) {
                this.currentPage--;

                let previous = this.currentPage > 1 ? this.currentPage - 1 : 1;
                thisInstance.onpagechange.call(this, previous, this.currentPage, next, this.totalPages);
            }
            //console.log('currentPage', this.currentPage);
            thisInstance.render();
        },
        setActual: function (page = 1) {
            if ("number" == typeof page && page > 0 && page <= this.totalPages && page != this.currentPage) {
                this.currentPage = page;
            }
            //console.log('currentPage', this.currentPage);

            thisInstance.render();
        },
        next: function () {

            let previous = this.currentPage;

            if ((this.currentPage + 1) <= this.totalPages) {
                this.currentPage++;

                let next = this.currentPage < this.totalPages ? this.currentPage + 1 : this.totalPages;
                thisInstance.onpagechange.call(this, previous, this.currentPage, next, this.totalPages);
            }

            //console.log('currentPage', this.currentPage);
            thisInstance.render();
        }
    }

    //console.log(table.style);
    //this.table.style.backgroundColor = 'rgb(255,255,0)';
}

Table.prototype.addHeaders = function (headers = []) {
    if (null != headers && headers instanceof Array && headers.length > 0) {
        headers.forEach(header => {
            if (header.hasOwnProperty('label') && header.hasOwnProperty('name'))
                this.headers.push(header);
        });
    }
}

Table.prototype.addColumns = function (dataColumns = []) {
    if (dataColumns != undefined) {
        this.dataColumns = dataColumns;
    }
}

Table.prototype.addData = function (data = []) {
    console.log(data.length > 0);

    if (data.length > 0) {
        data.forEach(d => {
            this.data.push(d);
        });

        this.calculatePagination();
    }

    if (this.autoRender) {
        this.render();
    }
}

Table.prototype.addClassesTo = function (tElement = '', ...classes) {
    if (tElement.trim() != '') {
        console.log(classes);
    }

}

Table.prototype.removeHeader = function (header = '') {
    if (header != undefined && header.trim() != '') {
        let idx = this.dataColumns.indexOf(header);

        this.headers.splice(idx, 1);
        this.dataColumns.splice(idx, 1);


        if (this.autoRender) {
            this.render();
        }
    }
}

Table.prototype.remove = function (index = -1) {
    if (index == -1 || index > this.data.length) {
        return null;
    }

    let deleteItem = this.data.splice(index, 1);

    this.calculatePagination();

    if (this.autoRender) {
        this.render();
    }

    return deleteItem;
}

Table.prototype.calculatePagination = function () {
    if (this.pagination.enabled) {
        this.pagination.totalPages = Math.ceil(this.data.length / this.pagination.perPage);

        if (this.pagination.totalPages > 0 && this.pagination.currentPage > this.pagination.totalPages) {
            this.pagination.currentPage = this.pagination.totalPages;
        }
    }else{
        this.pagination.totalPages = 1;
        this.currentPage = 1;
    }
}

Table.prototype.rowCallback = function () {

}

Table.prototype.onrowclick = function () {

}

Table.prototype.onperpagechange = function (perPage) {

}

Table.prototype.onpagechange = function (previous, current, next, totalPages) {

}

Table.prototype.onfinisherender = function(){

}

Table.prototype.render = function () {
    let ownTableClass = this;
    let thead = this.table.tHead;
    let tfoot = this.table.tFoot;
    let tbody = this.table.tBodies.item(0);


    let dataToRender = null;

    if (ownTableClass.pagination.enabled) {
        let start = (ownTableClass.pagination.currentPage - 1) * ownTableClass.pagination.perPage;
        let end = ownTableClass.pagination.currentPage * ownTableClass.pagination.perPage;

        dataToRender = clone(this.data.slice(start, end));
    } else {
        dataToRender = clone(this.data);
    }

    //render the headers the first time or the headers change
    if (thead.childElementCount == 0 || thead.childElementCount != this.headers.length) {

        if (thead.childElementCount > 0) {
            let firstChild = thead.firstElementChild;

            while (firstChild) {
                thead.removeChild(firstChild);
                firstChild = thead.firstElementChild;
            }
        }

        this.headers.forEach(c => {
            let th = document.createElement('th');
            th.appendChild(document.createTextNode(c.label));

            thead.appendChild(th);
        });

        
        //Render the footer header if the headerFooter is true
        if (this.headerFooter) {
            if (tfoot.childElementCount > 0) {
                let firstChild = tfoot.firstElementChild;

                while (firstChild) {
                    tfoot.removeChild(firstChild);
                    firstChild = tfoot.firstElementChild;
                }
            }

            this.headers.forEach(c => {
                let th = document.createElement('th');
                th.appendChild(document.createTextNode(c.label));

                tfoot.appendChild(th);

            });
        }

    }

    //body
    if (tbody.childElementCount > 0) {
        let firstChild = tbody.firstElementChild;

        while (firstChild) {
            tbody.removeChild(firstChild);
            firstChild = tbody.firstElementChild;
        }
    }

    dataToRender.forEach(function (row, index, arr) {
        let tr = document.createElement('tr');

        ownTableClass.rowCallback.call(this, row, index, arr);

        ownTableClass.headers.forEach(value => {
            let td = document.createElement('td');

            if (row.hasOwnProperty(value.name)) {
                td.appendChild(document.createTextNode(row[value.name]));
            } else {
                let nRow = ownTableClass.pagination.perPage * (ownTableClass.pagination.currentPage - 1) + (index + 1);
                td.appendChild(document.createTextNode(nRow));

            }

            tr.appendChild(td);
        });

        tbody.appendChild(tr);

        tr.addEventListener('click', function (e) {
            let row = e.target.parentElement;
            let indexClicked = row.rowIndex;

            if (!ownTableClass.pagination.enabled) {
                if (indexClicked > -1 && indexClicked < ownTableClass.data.length) {
                    ownTableClass.onrowclick(ownTableClass.data[indexClicked], indexClicked, ownTableClass.data);
                }
            } else {
                let realIndex = ownTableClass.pagination.perPage * (ownTableClass.pagination.currentPage - 1) + indexClicked;
                ownTableClass.onrowclick(ownTableClass.data[realIndex], realIndex, ownTableClass.data);
            }
        });

        ownTableClass.onfinisherender();
    });
}



//Other things
function clone(obj) {
    if (null == obj || "object" != typeof obj) {
        return obj;
    }

    if (obj instanceof Array) {
        let copy = [];
        //console.log('Esto es un array:', obj);
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        //console.log('Esto es un arrayCopia:', obj);
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        let copy = {};
        //console.log('coping:', obj);
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }

        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}