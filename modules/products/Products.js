(function () {
    'use strict';
    class Products extends ListLoader {
        constructor(name, position,list) {
            super(name, position,list);
            this.Listeners = [
                {selector: '#products',
                    type: 'click',
                    action: function addProductToList(el) {
                        let _this=this,
                            elementClicked = el.target.closest('figure'),
                        refrigeratorContent = localStorage.getItem('HS.main');
                        if(refrigeratorContent && elementClicked){
                            let i = 1;
                            let positionSearch = function (str) {
                                let regex = new RegExp('data-index\\s*=\\s*"' + i + '"','igm');
                                if(regex.test(str)){
                                    i++;
                                    positionSearch(str);
                                } else {
                                    let r = /<\/div>/gmi;
                                    let newStr = refrigeratorContent.replace(r,`<figure data-category =${_this.getAttribute('data-location')} data-index="${i}">${elementClicked.innerHTML}</figure></div>`);
                                    localStorage.setItem('HS.main', newStr);
                                    elementClicked.remove();
                                }
                            };
                            positionSearch(refrigeratorContent);
                        }
                    }
                }
            ];
        }
    }
    window.Products = Products;
}());